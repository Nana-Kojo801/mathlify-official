import { queryOptions } from "@tanstack/react-query";
import { getFriends } from "./api/friends";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { User } from "./types";

export const getFriendsQuery = () => {
  return queryOptions({
    queryFn: getFriends,
    gcTime: Infinity,
    queryKey: ["friends"],
  });
};

export const getLiveUserQuery = (initialUser: User) => {
  return queryOptions({
    ...convexQuery(api.users.getUser, { id: initialUser._id }),
    initialData: initialUser,
    gcTime: Infinity
  })
}
