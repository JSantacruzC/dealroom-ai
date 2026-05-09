import { ReactNode } from "react";
import { Navigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth/useAuth";
import { FullPageSpinner } from "./Spinner";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullPageSpinner />;
  if (!session) return <Navigate to="/login" search={{ redirect: location.href }} replace />;
  return <>{children}</>;
}
