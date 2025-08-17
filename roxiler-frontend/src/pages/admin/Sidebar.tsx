import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import {useNavigate } from "react-router-dom"
import { X, Menu } from "lucide-react"
import { useState } from "react"

const links = [
  { path: "/admin/dashboard", label: "Dashboard" },
  { path: "/admin/users", label: "Users" },
  { path: "/admin/stores", label: "Stores" },
  { path: "/profile", label: "Profile" },
  { path: "/admin/users/add", label: "Add User" }
]

export function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
    const [open, setOpen] = useState<boolean>(false)
  

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

return (
    <>
      <div className="md:hidden h-2 flex items-center justify-between text-black m-1 p-4 overflow-hidden">
        
        <button onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" color="white" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-primary text-white p-4 transform transition-transform duration-300 z-40 overflow-hidden
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-6 hidden md:block">Admin Panel</h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)} 
              className={`block p-2 rounded hover:bg-gray-700 ${
                pathname === link.path ? "bg-gray-700" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button
            className="w-full cursor-pointer"
            onClick={handleLogout}
            variant="destructive"
          >
            Logout
          </Button>
        </nav>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
