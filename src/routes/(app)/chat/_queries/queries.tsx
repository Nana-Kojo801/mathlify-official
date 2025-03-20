import { getFriendMessages } from "@/lib/api/friend-messages";
import { getFriend } from "@/lib/api/friends";
import type { User } from "@/lib/types";
import { queryOptions } from "@tanstack/react-query";

export const friendQuery = (friendId: string) => {
  return queryOptions({
    queryKey: ["friend", friendId],
    queryFn: async () => {
      return await getFriend(friendId as User["_id"]);
    },
    gcTime: Infinity
  });
};

export const messagesQuery = (userId: User["_id"], friendId: User["_id"]) => {
  return queryOptions({
    queryKey: ["friend-messages", userId, friendId],
    queryFn: async () => {
      return await getFriendMessages(userId, friendId);
    },
    gcTime: Infinity
  });
};
