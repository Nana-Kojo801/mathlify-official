import { Room } from "@/lib/types";
import { CheckCircle, Gamepad2, XCircle } from "lucide-react";
import { useRoomUser } from "../hooks";
import { Button } from "@/components/ui/button";
import { useOutletContext } from "react-router";
import { OutletContext } from "../_types";

const Stats = ({ room }: { room: Room }) => {
  const user = useRoomUser(room);
  const { startGame } = useOutletContext<OutletContext>()
  return (
    <div className="space-y-6">
      {/* Games Played (Full Width, Centered) */}
      <div className="bg-gray-800 text-white p-6 rounded-lg flex flex-col items-center">
        <Gamepad2 size={36} className="mb-2 text-gray-400" />
        <div className="text-lg font-medium">Games Played</div>
        <div className="text-4xl font-bold">{room.gamesPlayed}</div>
      </div>

      {/* Games Won & Games Lost (Side by Side, Dashboard Style) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-600 text-white p-6 rounded-lg flex flex-col items-center">
          <CheckCircle size={30} className="mb-2" />
          <div className="text-md font-medium">Games Won</div>
          <div className="text-3xl font-bold">{user.gamesWon}</div>
        </div>
        <div className="bg-red-600 text-white p-6 rounded-lg flex flex-col items-center">
          <XCircle size={30} className="mb-2" />
          <div className="text-md font-medium">Games Lost</div>
          <div className="text-3xl font-bold">{user.gamesLost}</div>
        </div>
      </div>
      {user.userId === room.ownerId && (
        <Button onClick={startGame} className="w-full text-lg">Start Game</Button>
      )}
    </div>
  );
};

export default Stats;
