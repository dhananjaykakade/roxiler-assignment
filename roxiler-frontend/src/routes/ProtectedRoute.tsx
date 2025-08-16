import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    if(role=="OWNER")
    return <Navigate to="/owner/dashboard" replace />;
    if(role=="USER")
    return <Navigate to="/" replace />;
  }


  return <Outlet />;
}
