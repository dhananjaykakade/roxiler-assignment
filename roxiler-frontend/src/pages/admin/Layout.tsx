// src/components/layout/Layout.tsx
import { Sidebar } from "./Sidebar"
import { Outlet } from "react-router-dom";


export function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <div className="p-6">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}

