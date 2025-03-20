import { Room } from "@/lib/types";
import SettingItem from "./setting-items";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { Pencil } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

const GameSettings = ({ room }: { room: Room }) => {
  const user = useLiveUser();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Game Settings</h2>
        {user._id === room.ownerId && (
          <Link to="game-settings" className={cn(buttonVariants(), "py-3")}>
            <Pencil className="size-4" />
            Edit
          </Link>
        )}
      </div>

      <div className="space-y-3">
        <SettingItem label="Game Type" value={room.gameSettings.type} />
        {room.gameSettings.type === "casual" ? (
          <CasualGameSettings settings={room.gameSettings.casual} />
        ) : (
          <AnswerRushGameSettings settings={room.gameSettings.answerRush} />
        )}
      </div>
    </div>
  );
};

export const CasualGameSettings = ({
  settings,
}: {
  settings: Room["gameSettings"]["casual"];
}) => {
  return (
    <>
      <SettingItem
        label="Range"
        value={`${settings.range.from}-${settings.range.to}`}
      />
      <SettingItem
        label="Quantity"
        value={`${settings.quantity.min}-${settings.quantity.max}`}
      />
      <SettingItem label="Time Interval" value={`${settings.timeInterval}s`} />
      <SettingItem label="Timer" value={`${settings.timer}s`} />
    </>
  );
};

export const AnswerRushGameSettings = ({
  settings,
}: {
  settings: Room["gameSettings"]["answerRush"];
}) => {
  return (
    <>
      <SettingItem
        label="Range"
        value={`${settings.range.from}-${settings.range.to}`}
      />
      <SettingItem
        label="Quantity"
        value={`${settings.quantity.min}-${settings.quantity.max}`}
      />
      <SettingItem label="Timer" value={`${settings.timer}s`} />
    </>
  );
};

export default GameSettings;
