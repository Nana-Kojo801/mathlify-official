import { Button } from "@/components/ui/button";
import { LogOut, RotateCw } from "lucide-react";
import StatItem from "./stat-items";
import { ResultsActionLayout } from "@/components/casual-game/results";

type RoundLostActionsProps = {
  playAgain: () => void;
  quit: () => void;
  stats: {
    round: number;
    avgTime: number;
    score: number;
  };
};

const RoundLostActions = ({
  playAgain,
  quit,
  stats: { round, avgTime, score },
}: RoundLostActionsProps) => {
  return (
    <div className="mt-4 w-full max-w-md flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md text-white">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <StatItem label="Round" value={round} />
        <StatItem label="Avg Time" value={`${avgTime}s`} />
        <StatItem className="col-span-2" label="Score" value={score} />
      </div>

      {/* Action Buttons */}
      <ResultsActionLayout>
        <Button onClick={playAgain} className="py-6 text-lg bg-foreground">
          <RotateCw className="size-[22]" />
          Play Again
        </Button>

        <Button onClick={quit} className="py-6 text-lg" variant="destructive">
          <LogOut className="size-[22]" />
          Quit
        </Button>
      </ResultsActionLayout>
    </div>
  );
};

export default RoundLostActions;
