import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../pages/utils/auth.js";

export default function ProtectedRoute({ children }) {
  const user = getCurrentUser();

  return user ? children : <Navigate to="/login" />;
}