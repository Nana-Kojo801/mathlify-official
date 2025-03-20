import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { Room } from "@/lib/types";

export const useRoomUser = (room: Room) => {
    const user = useLiveUser()
    return room.members.find(member => member.userId === user._id)!
}