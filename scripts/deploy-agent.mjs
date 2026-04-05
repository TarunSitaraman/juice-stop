#!/usr/bin/env node
/**
 * Vercel Deployment Agent
 *
 * Watches the latest Vercel deployment after a git push.
 * If it fails, extracts the build logs, calls the Claude Code CLI
 * to fix the code, commits, and pushes — looping until success.
 *
 * Required env vars (set in .claude/settings.json → env):
 *   VERCEL_TOKEN        — Vercel API token (Settings → Tokens)
 *   VERCEL_PROJECT_NAME — your Vercel project name (default: "juice-stop")
 *   VERCEL_TEAM_ID      — team slug/ID if project is under a team (optional)
 */

import { execSync, spawnSync } from "child_process";

const TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_NAME = process.env.VERCEL_PROJECT_NAME ?? "juice-stop";
const TEAM_ID = process.env.VERCEL_TEAM_ID ?? "";
const MAX_FIX_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 12_000;
const MAX_POLL_ROUNDS = 50; // ~10 min timeout

if (!TOKEN) {
  console.error("[deploy-agent] VERCEL_TOKEN is not set — skipping.");
  process.exit(0);
}

const teamQuery = TEAM_ID ? `&teamId=${TEAM_ID}` : "";

async function api(path) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Vercel API ${path} → ${res.status}`);
  return res.json();
}

async function getProjectId() {
  const data = await api(`/v9/projects/${PROJECT_NAME}${TEAM_ID ? `?teamId=${TEAM_ID}` : ""}`);
  return data.id;
}

async function getLatestDeployment(projectId) {
  const data = await api(`/v6/deployments?projectId=${projectId}&limit=1${teamQuery}`);
  return data.deployments?.[0] ?? null;
}

async function getDeploymentState(deploymentId) {
  const data = await api(`/v13/deployments/${deploymentId}${TEAM_ID ? `?teamId=${TEAM_ID}` : ""}`);
  return data.status ?? data.readyState ?? "UNKNOWN";
}

async function getBuildLogs(deploymentId) {
  try {
    const data = await api(`/v2/deployments/${deploymentId}/events${TEAM_ID ? `?teamId=${TEAM_ID}` : ""}`);
    const events = Array.isArray(data) ? data : data.events ?? [];
    return events
      .filter((e) => e.type === "stderr" || e.type === "stdout" || e.text)
      .map((e) => e.text ?? e.payload?.text ?? "")
      .filter(Boolean)
      .join("\n")
      .slice(-8000); // last 8k chars — enough for Claude
  } catch {
    return "(could not fetch build logs)";
  }
}

function fixWithClaude(logs, attempt) {
  console.log(`[deploy-agent] Calling Claude to fix errors (attempt ${attempt})...`);
  const prompt = [
    `Vercel deployment failed (fix attempt ${attempt}/${MAX_FIX_ATTEMPTS}).`,
    `Analyze the build error logs below, fix the code, commit, and push to trigger a new deployment.`,
    `Do NOT add any attribution or co-author lines to the commit message.`,
    ``,
    `=== BUILD LOGS ===`,
    logs,
    `=== END LOGS ===`,
  ].join("\n");

  const result = spawnSync(
    "claude",
    ["--dangerouslySkipPermissions", "-p", prompt],
    {
      stdio: "inherit",
      cwd: process.cwd(),
      timeout: 5 * 60 * 1000, // 5 min per fix attempt
    }
  );

  if (result.error) {
    console.error("[deploy-agent] Failed to run claude CLI:", result.error.message);
    return false;
  }
  return result.status === 0;
}

async function waitForDeployment(projectId, skipUid = null) {
  console.log("[deploy-agent] Waiting for deployment to start...");

  for (let round = 0; round < MAX_POLL_ROUNDS; round++) {
    await sleep(POLL_INTERVAL_MS);

    const deployment = await getLatestDeployment(projectId);
    if (!deployment || deployment.uid === skipUid) continue;

    const state = await getDeploymentState(deployment.uid);
    console.log(`[deploy-agent] ${deployment.uid} → ${state}`);

    if (state === "READY") return { success: true, uid: deployment.uid };
    if (state === "ERROR" || state === "CANCELED") {
      const logs = await getBuildLogs(deployment.uid);
      return { success: false, uid: deployment.uid, logs };
    }
    // BUILDING / QUEUED / INITIALIZING — keep polling
  }

  return { success: false, uid: null, logs: "Timed out waiting for deployment" };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("[deploy-agent] Starting deployment watch...");

  let projectId;
  try {
    projectId = await getProjectId();
    console.log(`[deploy-agent] Project: ${PROJECT_NAME} (${projectId})`);
  } catch (err) {
    console.error("[deploy-agent] Could not resolve project:", err.message);
    process.exit(0);
  }

  // Grab current latest deployment UID so we can skip it and wait for the new one
  const current = await getLatestDeployment(projectId);
  const previousUid = current?.uid ?? null;

  for (let attempt = 1; attempt <= MAX_FIX_ATTEMPTS; attempt++) {
    const result = await waitForDeployment(projectId, attempt === 1 ? previousUid : null);

    if (result.success) {
      console.log(`[deploy-agent] ✅ Deployment ${result.uid} succeeded.`);
      process.exit(0);
    }

    console.log(`[deploy-agent] ❌ Deployment failed (attempt ${attempt}/${MAX_FIX_ATTEMPTS})`);

    if (attempt === MAX_FIX_ATTEMPTS) {
      console.error("[deploy-agent] Max fix attempts reached. Manual intervention required.");
      process.exit(1);
    }

    const fixed = fixWithClaude(result.logs, attempt);
    if (!fixed) {
      console.error("[deploy-agent] Claude fix failed. Stopping.");
      process.exit(1);
    }

    // Small delay to let Vercel pick up the new push
    await sleep(8_000);
  }
}

main().catch((err) => {
  console.error("[deploy-agent] Fatal:", err);
  process.exit(1);
});
