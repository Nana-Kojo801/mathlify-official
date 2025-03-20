import { Users, Swords, DoorOpen } from "lucide-react";
import PageHeader from "@/components/page-header";
import PageLayout from "@/components/page-layout";
import { Link } from "react-router";

const OnlinePage = () => {
  const options = [
    {
      title: "Ranked 1v1",
      icon: Swords,
      description: "Compete in ranked matches.",
      iconColor: "text-red-500",
      to: "/app/online/ranked"
    },
    {
      title: "Create Room",
      icon: Users,
      description: "Host a private game.",
      iconColor: "text-blue-500",
      to: "/app/online/create-room"
    },
    {
      title: "Join Room",
      icon: DoorOpen,
      description: "Join an existing game.",
      iconColor: "text-green-500",
      to: "/app/online/join-room"
    },
  ];

  return (
    <PageLayout>
      <PageHeader title="Online" />

      {/* Online Game Modes */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option, index) => (
            <Link
              key={index}
              to={option.to}
              className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center justify-center text-white hover:bg-gray-700 transition-all cursor-pointer"
            >
              <option.icon size={50} className={`${option.iconColor} mb-4`} />
              <p className="text-2xl font-semibold">{option.title}</p>
              <p className="text-sm text-gray-300 mt-2">{option.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default OnlinePage;
