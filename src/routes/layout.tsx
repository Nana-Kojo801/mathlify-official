import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="w-screen h-dvh relative overflow-y-auto text-white">
      <Outlet />
    </div>
  );
};

export default RootLayout;
