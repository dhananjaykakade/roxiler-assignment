// src/components/layout/Sidebar.tsx
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

const links = [
  { path: "/admin/dashboard", label: "Dashboard" },
  { path: "/admin/users", label: "Users" },
  { path: "/admin/stores", label: "Stores" },
  { path: "/profile", label: "Profile" },
  { path: "/admin/users/add", label: "Add User" }
]

export function Sidebar() {
  const { logout } = useAuth()
  const { pathname } = useLocation()
  return (
    <aside className="w-64 bg-primary text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block p-2 rounded hover:bg-gray-700 ${
              pathname === link.path ? "bg-gray-700" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
    <Button className="w-full cursor-pointer" onClick={logout} variant="destructive">Logout</Button>

      </nav>
    </aside>
  )
}
