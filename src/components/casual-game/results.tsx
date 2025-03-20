import Review from "./review";
import { CheckCircle, Clock, LogOut, RotateCcw, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const Timeout = ({
  playAgain,
  quit,
  TimeoutActions,
}: {
  playAgain: () => void;
  quit: () => void;
  TimeoutActions?: () => React.JSX.Element;
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-6">
      {/* Timeout Message */}
      <div className="flex flex-col items-center">
        <Clock size={90} className="mb-4 text-yellow-500 drop-shadow-lg" />
        <h1 className="text-5xl font-extrabold tracking-wide text-yellow-400">
          Time's Up!
        </h1>
        <p className="text-lg mt-2 text-white/80">Don't worry, try again!</p>
      </div>

      {/* Buttons */}
      {TimeoutActions ? (
        <TimeoutActions />
      ) : (
        <div className="flex gap-4 mt-8">
          <Button
            onClick={playAgain}
            className="py-6 w-[150px] text-lg bg-gray-700 hover:bg-gray-600"
          >
            <RotateCcw className="size-[22]" />
            Play Again
          </Button>

          <Button
            onClick={quit}
            className="py-6 w-[150px] text-lg"
            variant="destructive"
          >
            <LogOut className="size-[22]" />
            Quit
          </Button>
        </div>
      )}

      {/* Review Section */}
      <Review />
    </div>
  );
};

export const Wrong = ({
  playAgain,
  quit,
  WrongActions,
}: {
  playAgain: () => void;
  quit: () => void;
  WrongActions?: () => React.JSX.Element;
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-6">
      {/* Failure Message */}
      <div className="flex flex-col items-center">
        <XCircle size={90} className="mb-4 text-red-500 drop-shadow-lg" />
        <h1 className="text-5xl font-extrabold tracking-wide text-red-400">
          Wrong!
        </h1>
        <p className="text-lg mt-2 text-white/80">Oops! Try again next time.</p>
      </div>

      {/* Buttons */}
      {WrongActions ? (
        <WrongActions />
      ) : (
        <div className="flex gap-4 mt-8">
          <Button
            onClick={playAgain}
            className="py-6 w-[150px] text-lg bg-gray-700 hover:bg-gray-600"
          >
            <RotateCcw className="size-[22]" />
            Play Again
          </Button>

          <Button
            onClick={quit}
            className="py-6 w-[150px] text-lg"
            variant="destructive"
          >
            <LogOut className="size-[22]" />
            Quit
          </Button>
        </div>
      )}

      {/* Review Section */}
      <Review />
    </div>
  );
};

export const Correct = ({
  playAgain,
  quit,
  CorrectActions,
}: {
  playAgain: () => void;
  quit: () => void;
  CorrectActions?: () => React.JSX.Element;
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-6">
      {/* Success Message */}
      <div className="flex flex-col items-center">
        <CheckCircle size={90} className="mb-4 text-green-500 drop-shadow-lg" />
        <h1 className="text-5xl font-extrabold tracking-wide text-green-400">
          Correct!
        </h1>
        <p className="text-lg mt-2 text-white/80">Nice work! You nailed it.</p>
      </div>

      {/* Buttons */}
      {CorrectActions ? (
        <CorrectActions />
      ) : (
        <div className="flex gap-4 mt-8">
          <Button
            onClick={playAgain}
            className="py-6 w-[150px] text-lg bg-gray-700 hover:bg-gray-600"
          >
            <RotateCcw className="size-[22]" />
            Play Again
          </Button>

          <Button
            onClick={quit}
            className="py-6 w-[150px] text-lg"
            variant="destructive"
          >
            <LogOut className="size-[22]" />
            Quit
          </Button>
        </div>
      )}

      {/* Review Section */}
      <Review />
    </div>
  );
};

export const ResultsActionLayout = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("grid grid-cols-2 gap-3 w-full", className)}>
      {children}
    </div>
  );
};
