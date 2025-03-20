import { User } from "@/lib/types";
import { Bolt, Target } from "lucide-react";

const Stats = ({ user }: { user: User }) => {
  const stats = [
    {
      title: "Casual",
      icon: Bolt,
      played: 0,
      elo: user.elo.casual,
    },
    {
      title: "Answer Rush",
      icon: Target,
      played: 0,
      elo: user.elo.answerRush,
    },
  ];

  return (
    <div className="p-4 space-y-3 flex flex-col">
      <h3 className="text-xl font-semibold">Stats</h3>

      {/* Games Played Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-row justify-around gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <stat.icon size={40} className="text-yellow-400 mb-2" />
            <p className="text-white text-3xl font-bold">{stat.played}</p>
            <p className="text-gray-400 text-sm">Games</p>
          </div>
        ))}
      </div>

      {/* ELO Stats Section */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
          >
            <stat.icon size={30} className="text-purple-400 mb-2" />
            <p className="text-white text-3xl font-bold">{stat.elo}</p>
            <p className="text-gray-300 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
