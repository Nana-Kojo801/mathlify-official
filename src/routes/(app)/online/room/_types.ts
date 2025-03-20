import { Room } from "@/lib/types"

export type OutletContext = {
    room: Room,
    roomId: Room["_id"];
    startGame: () => Promise<void>
}