import { Room } from "@/lib/types";
import SettingItem from "./setting-items";

const RoomSettings = ({ room }: { room: Room }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Room Settings</h2>
      <div className="space-y-3">
        <SettingItem label="Name" value={room.name} />
        <SettingItem label="Owner" value={room.owner.username} />
        <SettingItem label="Max members" value={`${room.memberCount}`} />
        <SettingItem label="No. of members" value={`${room.members.length}`} />
      </div>
    </div>
  );
};

export default RoomSettings;
