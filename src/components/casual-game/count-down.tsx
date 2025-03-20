import useCasualGameStore from "@/lib/stores/casual-game-store";
import { useEffect, useState } from "react";

const CountDown = () => {
  const stages = ["3", "2", "1", "GO!!!"];
  const setState = useCasualGameStore((store) => store.setState);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex > stages.length - 1) return setState("questioning");

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, stages.length, setState]);

  return (
    <p className="text-5xl font-bold text-foreground">{stages[currentIndex]}</p>
  );
};

export default CountDown;
