import { ResultsActionLayout } from "@/components/casual-game/results";
import { Button } from "@/components/ui/button";
import { FastForward, LogOut } from "lucide-react";
import StatItem from "./stat-items";

const CorrectActions = ({
  nextRound,
  quit,
  stats,
}: {
  nextRound: () => void;
  quit: () => void;
  stats: {
    round: number;
    avgTime: number;
    score: number;
  };
}) => {
  return (
    <div className="mt-4 w-full max-w-md flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md text-white">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <StatItem className="col-span-2" label="Avg Time" value={`${stats.avgTime}s`} />
      </div>

      {/* Action Buttons */}
      <ResultsActionLayout>
        <Button
          onClick={nextRound}
          className="py-6 w-[150px] text-lg bg-gray-700 hover:bg-gray-600"
        >
          <FastForward className="size-[22]" />
          Next round
        </Button>

        <Button
          onClick={quit}
          className="py-6 w-[150px] text-lg"
          variant="destructive"
        >
          <LogOut className="size-[22]" />
          Quit
        </Button>
      </ResultsActionLayout>
    </div>
  );
};

export default CorrectActions;
