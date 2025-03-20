import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bolt, Target, Trophy, BookOpen } from "lucide-react";
import { Link } from "react-router";

const GameModes = () => {
  const gameModes = [
    { name: "Casual", icon: Bolt, to: "" },
    { name: "Strategy Duel", icon: Target, to: "" },
    { name: "Practice", icon: BookOpen, to: "/app/practice" },
    { name: "Marathon", icon: Trophy, to: "/app/marathon" },
  ];

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Quick Play</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {gameModes.map((mode, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center text-center"
          >
            <mode.icon className="text-blue-400" size={36} />
            <p className="text-lg font-medium mt-2">{mode.name}</p>
            <Link
              to={mode.to}
              className={cn(buttonVariants(), "mt-3 w-full py-5")}
            >
              Play
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameModes;
