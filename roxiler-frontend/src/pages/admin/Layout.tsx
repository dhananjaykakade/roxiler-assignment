import { Sidebar } from "./Sidebar"
import { Outlet } from "react-router-dom";



//i added layout component so that we can have a consistent sidebar and main content area across all admin pages
export function Layout() {
  return (
    <div className="flex ">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="p-6 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

