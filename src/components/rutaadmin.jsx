// src/components/RutaAdmin.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaAdmin({ children }) {
  const { user, loading } = useAuth();

    console.log("RutaAdmin -> loading:", loading, "user:", user); 

  // Mientras se revisa si había sesión guardada, no decidimos nada todavía
  if (loading) return null;

  // No logueado, o logueado pero sin rol admin -> afuera
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
