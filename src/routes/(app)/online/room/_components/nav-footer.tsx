import { Home, MessageCircle, Trophy, Users } from "lucide-react";
import { Link } from "react-router";

const NavItem = ({ icon, label, to }: { icon: React.ReactNode; label: string; to: string; }) => (
  <Link to={to} className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white">
    {icon}
    <span className="text-xs">{label}</span>
  </Link>
);

const NavFooter = () => {
  return (
    <nav className="w-full bg-gray-900 text-white py-3 flex justify-around border-t border-gray-700">
      <NavItem to="" icon={<Home size={20} />} label="Home" />
      <NavItem to="members" icon={<Users size={20} />} label="Members" />
      <NavItem to="chat" icon={<MessageCircle size={20} />} label="Chat" />
      <NavItem to="leaderboard" icon={<Trophy size={20} />} label="Leaderboard" />
    </nav>
  );
};

export default NavFooter;
