import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { Bolt, Target } from "lucide-react";

const EloRatings = () => {
  const user = useLiveUser()
  
  const elos = [
    { name: "Casual", elo: user.elo.casual, icon: Bolt },
    { name: "Answer Rush", elo: user.elo.answerRush, icon: Target },
  ];

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Your ELO Ratings</h3>
      <div className="grid grid-cols-2 gap-4">
        {elos.map((mode, index) => (
          <div
            key={index}
            className="bg-gray-800 p-5 rounded-lg text-white flex flex-col items-center justify-center"
          >
            <mode.icon className="text-yellow-400" size={32} />
            <p className="text-lg mt-2">{mode.name}</p>
            <p className="font-bold text-2xl mt-1">{mode.elo}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EloRatings;
