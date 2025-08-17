import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import OwnerDashboard from "./pages/owner/Dashboard";
import Profile from "./pages/user/Profile";
import { Layout } from "./pages/admin/Layout";
import Stores from "./pages/admin/Stores";
import Users from "./pages/admin/Users";
import AddNewUser from "./pages/admin/AddNewUser";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes open to all the usrs */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/stores" element={<Stores />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/add" element={<AddNewUser />} />
          </Route>
        </Route>

        {/* User Routes only for authenticated users */}
        <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
          <Route path="/" element={<UserDashboard />} />
        </Route>

        {/* Owner Routes */}
        <Route element={<ProtectedRoute allowedRoles={["OWNER"]} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={["USER", "ADMIN", "OWNER"]} />}
        >
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
    
      </Routes>
    </BrowserRouter>
  );
}
