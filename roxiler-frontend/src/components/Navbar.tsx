import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  

  return (
    <nav className="bg-white shadow-md w-full fixed">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16">
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 cursor-pointer hover:text-black hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="hidden sm:flex sm:space-x-4 sm:items-center">
            {user?.role === "ADMIN" && window.location.pathname === "/profile" ? (
              <Button className="cursor-pointer" variant="ghost" onClick={() => navigate("/admin/dashboard")}>
                Admin Dashboard
              </Button>
            ) : user?.role === "OWNER" && window.location.pathname === "/profile" ? (
              <Button className="cursor-pointer" variant="ghost" onClick={() => navigate("/owner/dashboard")}>
                Owner Dashboard
              </Button>
            ) : window.location.pathname === "/profile" ? (
              <Button className="cursor-pointer" variant="ghost" onClick={() => navigate("/")}>
                Home
              </Button>
            ) : (
              <Button className="cursor-pointer" variant="ghost" onClick={() => navigate("/profile")}>
                Profile
              </Button>
            )}
            <Button variant="destructive" className="cursor-pointer" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2">
 {user?.role === "ADMIN" && window.location.pathname === "/profile" ? (
              <Button className="cursor-pointer" variant="ghost" onClick={() => navigate("/admin/dashboard")}>
                Admin Dashboard
              </Button>
            ) : user?.role === "OWNER" && window.location.pathname === "/profile" ? (
              <Button className="w-full cursor-pointer" variant="ghost" onClick={() => navigate("/owner/dashboard")}>
                Owner Dashboard
              </Button>
            ) : window.location.pathname === "/profile" ? (
              <Button className="cursor-pointer" variant="ghost" onClick={() => navigate("/")}>
                Home
              </Button>
            ) : (
              <Button className="cursor-pointer" variant="ghost" onClick={() => navigate("/profile")}>
                Profile
              </Button>
            )}
          <Button variant="destructive" className="w-full cursor-pointer" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
