import { Button } from "../ui/button";
import { PlayIcon } from "lucide-react";
import { useAnswerRushGameStore } from "@/lib/stores/answer-rush-store";

const Idle = () => {
  const setState = useAnswerRushGameStore((store) => store.setState);
  return (
    <Button
      className="w-[150px] py-6 text-xl"
      onClick={() => setState("countdown")}
    >
      <PlayIcon />
      Start
    </Button>
  );
};

export default Idle;
