import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { BookOpen, Home, Play, Trophy, User } from "lucide-react";
import { Link } from "react-router";

const NavigationPanel = () => {
  const user = useLiveUser();
  return (
    <nav className=" w-full bg-gray-800 px-2 py-4 flex justify-around gap-3 border-t border-gray-700">
      {[
        { icon: Home, label: "Home", to: "/app" },
        { icon: Trophy, label: "Marathon", to: "/app/marathon" },
        { icon: Play, label: "Online", to: "/app/online" },
        { icon: BookOpen, label: "Practice", to: "/app/practice" },
        { icon: User, label: "Profile", to: `/app/profile/${user._id}` },
      ].map((nav, index) => (
        <Link
          to={nav.to}
          key={index}
          className="text-white flex flex-col items-center gap-1"
        >
          <nav.icon size={20} />
          <span className="text-xs">{nav.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default NavigationPanel;
