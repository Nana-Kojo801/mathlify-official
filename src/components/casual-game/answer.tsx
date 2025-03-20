import useCasualGameStore from "@/lib/stores/casual-game-store";
import { Delete, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const Answer = () => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const difficulty = useCasualGameStore((store) => store.difficulty)!;
  const [timer, setTimer] = useState(difficulty.timer * 100); // Store timer in centiseconds (100 = 1 second)
  const setState = useCasualGameStore((store) => store.setState);
  const correctAnswer = useCasualGameStore((store) => store.correctAnswer)!;
  const setTimeUsed = useCasualGameStore((store) => store.setTimeUsed);

  const handleCharacterClicked = (character: string) => {
    setCurrentAnswer((prevAnswer) => prevAnswer.concat(character));
  };

  const handleDeleteClicked = () => {
    setCurrentAnswer((prevAnswer) => prevAnswer.slice(0, -1));
  };

  const handleMinusClicked = () => {
    if (currentAnswer.length) return;
    handleCharacterClicked("-");
  };

  const handleSubmit = () => {
    setTimeUsed((difficulty.timer * 100 - timer) / 100); // Convert centiseconds back to seconds
    const playerAnswer = parseInt(currentAnswer);
    if (playerAnswer == correctAnswer) setState("correct");
    else setState("wrong");
  };

  useEffect(() => {
    if (timer < 0) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setState("timeout");
          return 0;
        }
        return prevTimer - 1;
      });
    }, 10); // Update every 10ms for smooth countdown

    return () => clearInterval(interval);
  }, [setState, timer]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between px-4 py-10 bg-gray-900 text-white">
      <div className="flex items-center gap-2 text-lg font-semibold bg-gray-800 px-4 py-2 rounded-lg">
        <Timer className="text-yellow-400 w-6 h-6" />
        <span className="text-yellow-400 text-xl">
          {(timer / 100).toFixed(2)}s
        </span>
      </div>

      {/* Answer Display */}
      <div className="w-full max-w-xs text-center bg-gray-800 text-4xl font-bold py-3 h-16 rounded-lg shadow-md">
        {currentAnswer}
      </div>

      {/* Custom Keypad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-4">
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"].map((key) => (
          <button
            key={key}
            className="text-2xl p-4 bg-gray-700 rounded-lg active:bg-gray-600 shadow-md"
            onClick={() => handleCharacterClicked(key)}
          >
            {key}
          </button>
        ))}
        <button
          onClick={handleMinusClicked}
          className="text-2xl font-bold p-4 bg-gray-700 rounded-lg active:bg-gray-600 shadow-md"
        >
          −
        </button>
        <button
          onClick={handleDeleteClicked}
          className="p-4 bg-red-600 rounded-lg active:bg-red-500 shadow-md flex items-center justify-center"
        >
          <Delete className="w-6 h-6 text-white" />
        </button>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full max-w-xs bg-blue-500 text-xl py-6 shadow-md"
      >
        Submit
      </Button>
    </div>
  );
};

export default Answer;
