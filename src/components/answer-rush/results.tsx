import { Trophy, XCircle, RotateCw, Power } from "lucide-react";
import { Button } from "../ui/button";
import { useAnswerRushGameStore } from "@/lib/stores/answer-rush-store";
import { motion } from "framer-motion";

type ResultsProps = {
  playAgain: () => void;
  quit: () => void;
}

const Results = ({ playAgain, quit }: ResultsProps) => {
  const score = useAnswerRushGameStore((store) => store.score);
  const wrongs = useAnswerRushGameStore((store) => store.wrongs);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white py-6 px-5 bg-gradient-to-b from-gray-900 to-background">
      {/* Game Over Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-extrabold text-center text-yellow-400 mb-8 drop-shadow-lg"
      >
        Game Over
      </motion.h1>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl text-center w-full max-w-md border border-gray-700 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-black opacity-20 rounded-2xl"></div>

        {/* Correct Answers */}
        <div className="relative flex justify-between items-center text-lg md:text-xl font-semibold py-3">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400 w-7 h-7 animate-bounce" />
            <span>Correct:</span>
          </div>
          <span className="text-green-400">{score}</span>
        </div>

        {/* Wrong Answers */}
        <div className="relative flex justify-between items-center text-lg md:text-xl font-semibold py-3">
          <div className="flex items-center gap-2">
            <XCircle className="text-red-400 w-7 h-7 animate-pulse" />
            <span>Wrong:</span>
          </div>
          <span className="text-red-400">{wrongs}</span>
        </div>

        {/* Buttons: Play Again & Quit */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <Button
            onClick={playAgain}
            className="relative text-lg md:text-xl w-full md:w-1/2 flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 transition-all duration-200 transform hover:scale-105"
          >
            <RotateCw className="size-5" />
            Play Again
          </Button>
          <Button
            onClick={quit}
            variant="destructive"
            className="relative text-lg md:text-xl w-full md:w-1/2 flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
          >
            <Power className="size-5" />
            Quit
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Results;
