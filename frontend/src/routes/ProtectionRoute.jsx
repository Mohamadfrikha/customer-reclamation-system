import { Navigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  const roles = Array.isArray(user.roles)
    ? user.roles
    : [user.roles];

  if (role && !roles.includes(role)) {
    return <Navigate to="/" />; // ou /unauthorized
  }

  return children;
}