import useCasualGameStore from "@/lib/stores/casual-game-store";
import { Button } from "../ui/button";
import { PlayIcon } from "lucide-react";

const Idle = () => {
  const setState = useCasualGameStore((store) => store.setState);
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
