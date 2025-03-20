import useCasualGameStore from "@/lib/stores/casual-game-store";
import { useEffect, useState } from "react";

const Questioning = () => {
  const questions = useCasualGameStore((store) => store.questions);
  const difficulty = useCasualGameStore((store) => store.difficulty)!;
  const setState = useCasualGameStore((store) => store.setState);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex > questions.length - 1) return setState("answer");

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 1000 * difficulty.timeInterval);

    return () => clearInterval(interval);
  }, [currentIndex, difficulty.timeInterval, questions.length, setState]);

  return <p className="text-6xl font-bold">{questions[currentIndex]}</p>;
};
export default Questioning;
