import { MenuGrid } from "@/components/menu/menu-grid";

export default function HomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Our Menu</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fresh juices, shakes & smoothies made to order
        </p>
      </div>
      <MenuGrid />
    </div>
  );
}
