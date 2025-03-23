import { useAuth } from "@/components/auth-provider";
import SplashScreen from "@/components/splash-screen";
import { Outlet } from "react-router";

const RootLayout = () => {
  const { loading } = useAuth();
  if (loading) return <SplashScreen />;
  return (
    <div className="w-screen h-dvh relative overflow-y-auto text-white">
      <Outlet />
    </div>
  );
};

export default RootLayout;
