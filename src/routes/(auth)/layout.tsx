import { useAuth } from "@/components/auth-provider";
import { Navigate, Outlet } from "react-router";

const AuthLayout = () => {
  const { authenticated, loading } = useAuth();
  if (authenticated && !loading) return <Navigate to="/app" />;
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
