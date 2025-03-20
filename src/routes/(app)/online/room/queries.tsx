import { convexQuery } from "@convex-dev/react-query"
import { api } from "@convex/_generated/api"
import { Id } from "@convex/_generated/dataModel"
import { queryOptions } from "@tanstack/react-query"

export const getRoomQuery = (roomId: Id<"rooms">) => {
    return queryOptions({
        ...convexQuery(api.rooms.getRoom, { id: roomId }),
        gcTime: Infinity
    })
}