import { useEffect, useState } from "react";
import { Timer, Trophy } from "lucide-react";
import { Button } from "../ui/button";
import { useAnswerRushGameStore } from "@/lib/stores/answer-rush-store";
import { cn } from "@/lib/utils";

const Questioning = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const score = useAnswerRushGameStore((store) => store.score);
  const wrongs = useAnswerRushGameStore((store) => store.wrongs);
  const difficulty = useAnswerRushGameStore((store) => store.difficulty)!;
  const setScore = useAnswerRushGameStore((store) => store.setScore);
  const setWrongs = useAnswerRushGameStore((store) => store.setWrongs);
  const question = useAnswerRushGameStore((store) => store.question)!;
  const generateQuestion = useAnswerRushGameStore(
    (store) => store.generateQuestion
  );
  const setState = useAnswerRushGameStore((store) => store.setState);
  const [timer, setTimer] = useState(difficulty.timer);

  const handleOptionClicked = (answer: number, index: number) => {
    if (selected !== null) return;

    setSelected(index);

    if (answer === question.correctAnswer) setScore(score + 1);
    else setWrongs(wrongs + 1)

    setTimeout(() => {
      setSelected(null);
      generateQuestion();
    }, 700);
  };

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // New useEffect to safely update state
  useEffect(() => {
    if (timer === 0) {
      setState("results");
    }
  }, [timer, setState]);

  return (
    <div className="w-full h-full flex flex-col text-white py-4 px-5">
      {/* Header */}
      <div className="w-full flex justify-between items-center py-4">
        <div className="flex items-center gap-2 bg-gray-800 px-5 py-3 rounded-lg text-lg font-semibold shadow-md">
          <Trophy className="text-yellow-400 w-6 h-6" />
          <span>{score}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 px-5 py-3 rounded-lg text-lg font-semibold shadow-md">
          <Timer className="text-red-400 w-6 h-6" />
          <span>{timer}s</span>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="text-4xl md:text-5xl font-bold text-center bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg break-words whitespace-normal">
          {question.question}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 w-full max-w-lg mx-auto pb-10">
        {question.options.map((answer, index) => {
          const isCorrect = answer === question.correctAnswer;
          return (
            <Button
              key={index}
              disabled={selected !== null}
              onClick={() => handleOptionClicked(answer, index)}
              className={cn(
                "text-2xl md:text-3xl py-8 shadow-lg rounded-xl w-full transition-all duration-300 focus:ring-0 focus:outline-none",
                "bg-primary",
                selected !== null
                  ? isCorrect
                    ? "!bg-green-500"
                    : "!bg-red-500"
                  : ""
              )}
            >
              {answer}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Questioning;
