import useCasualGameStore from "@/lib/stores/casual-game-store";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

const RoundHeader = ({ round }: { round: number }) => {
    const state = useCasualGameStore((store) => store.state);
    const isVisible = ["countdown", "questioning", "answer"].includes(state);
  
    return (
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full h-12 flex items-center justify-center bg-gray-800 text-lg font-bold shadow-md text-white gap-2 px-4 rounded-b-lg"
      >
        <Target className="w-6 h-6 text-yellow-400" />
        Round {round}
      </motion.div>
    );
  };

export default RoundHeader