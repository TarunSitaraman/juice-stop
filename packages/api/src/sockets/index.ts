import { Server } from "socket.io";
import { verifyAccess } from "../lib/jwt";

export function initSocket(io: Server) {
  // Restaurant staff authenticate via token in handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      // Unauthenticated connections can still receive order_updated events
      // (for customer status polling via socket). They cannot join restaurant room.
      return next();
    }
    try {
      const payload = verifyAccess(token);
      socket.data.staff = payload;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.data.staff) {
      // Authenticated staff join the restaurant room to receive new orders
      socket.join("restaurant");
      console.log(`Staff ${socket.data.staff.staffId} connected`);
    }

    socket.on("track_order", (orderId: string) => {
      // Customer joins an order-specific room for status updates
      socket.join(`order:${orderId}`);
    });

    socket.on("disconnect", () => {
      if (socket.data.staff) {
        console.log(`Staff ${socket.data.staff.staffId} disconnected`);
      }
    });
  });
}
