import { useAuth } from "@/components/auth-provider";
import NavigationPanel from "@/components/navigation-panel";
import SplashScreen from "@/components/splash-screen";
import { Navigate, Outlet } from "react-router";

const AppLayout = () => {
  const { authenticated, loading } = useAuth();

  if (loading)
    return (
      <SplashScreen />
    );
  
    if(!authenticated) return <Navigate to="/auth/login" />;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <main className="flex-grow overflow-y-auto">
        <Outlet />
      </main>
      <NavigationPanel />
    </div>
  )
};

export default AppLayout;
