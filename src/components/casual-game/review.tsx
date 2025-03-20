import useCasualGameStore from "@/lib/stores/casual-game-store";
import { Eye } from "lucide-react";
import { useState } from "react";

const Review = () => {
  const numbers = useCasualGameStore((store) => store.questions);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    numbers.length - 1
  );

  const calculateSum = (index: number) => {
    return numbers.slice(0, index + 1).reduce((acc, num) => acc + num, 0);
  };
  return (
    <div className="mt-10 w-full max-w-md bg-white/10 backdrop-blur-md p-5 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
        <Eye size={20} />
        Review
      </h2>

      {/* Number List */}
      <div className="grid grid-cols-5 gap-3 justify-center">
        {numbers.map((num, index) => (
          <button
            key={index}
            className={`px-4 py-3 rounded-lg shadow-md grid place-content-center text-white font-semibold text-xl transition active:scale-95 ${
              selectedIndex === index ? "bg-green-500" : "bg-white/20"
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            {num}
          </button>
        ))}
      </div>
      {selectedIndex !== null && (
        <div className="mt-4 p-3 text-lg text-center bg-green-500/20 border border-green-500 rounded-lg shadow-md text-green-400">
          Sum: {calculateSum(selectedIndex)}
        </div>
      )}
    </div>
  );
};

export default Review;
