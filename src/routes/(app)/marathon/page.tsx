import PageHeader from "@/components/page-header";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { generateDifficulty } from "@/lib/helpers";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import useCasualGameStore from "@/lib/stores/casual-game-store";
import { Trophy, Timer, List, Play, Calendar } from "lucide-react";
import { Outlet, useNavigate } from "react-router";

const MarathonPage = () => {
  const user = useLiveUser()
  const stats = [
    {
      icon: Trophy,
      title: "Best Round",
      value: user.marathon.round,
      color: "text-yellow-500",
    },
    {
      icon: Timer,
      title: "Best Avg Time",
      value: `${user.marathon.avgTime}s`,
      color: "text-blue-400",
    },
    {
      icon: List,
      title: "Best Score",
      value: user.marathon.score,
      color: "text-green-400",
    },
  ];

  const init = useCasualGameStore((store) => store.init);
  const navigate = useNavigate();

  const playMarathon = () => {
    init(generateDifficulty(1));
    navigate("play");
  };

  return (
    <PageLayout>
      <PageHeader title="Marathon Mode" />

      <div className="p-4">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 bg-white/10 backdrop-blur-md rounded-lg shadow-md flex justify-between md:flex-col md:items-center"
            >
              <div className="flex items-center gap-3 md:flex-col md:items-center">
                <stat.icon size={24} className={stat.color} />
                <span className="text-lg font-semibold">{stat.title}</span>
              </div>
              <span className="text-2xl font-bold md:mt-2">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center mt-6">
          <Button onClick={playMarathon} className="text-lg w-full">
            <Play className="size-[20]" /> Play Marathon
          </Button>
        </div>

        <div className="w-full bg-white/10 backdrop-blur-md p-5 rounded-lg shadow-lg mt-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Calendar size={18} /> Weekly Online Marathon
          </h2>
          <p className="text-white/70 mt-1 text-sm">Coming soon...</p>
        </div>
      </div>
      <Outlet />
    </PageLayout>
  );
};

export default MarathonPage;
