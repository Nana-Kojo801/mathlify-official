import { buttonVariants } from "@/components/ui/button";
import UserList from "@/components/users-list";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router";

const FriendsList = ({
  user,
  initialData = [],
}: {
  user: User;
  initialData: User[];
}) => {
  const currentUser = useLiveUser();
  const { data: liveFriends } = useQuery({
    ...convexQuery(api.users.getFriends, { userId: user._id }),
    initialData,
    gcTime: Infinity,
  });
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold text-white mb-4">Friends</h3>
      <UserList
        list={liveFriends}
        className="size-12"
        actions={(friend) => {
          return currentUser.friends.includes(friend._id) ? (
            <Link
              to={`/app/chat-friend/${friend._id}`}
              className={cn(buttonVariants({ variant: "ghost" }), "h-10 w-10")}
            >
              <MessageCircle className="size-5" />
            </Link>
          ) : (
            <></>
          );
        }}
        fallback={() => {
          return <p className="mt-1">No friends yet</p>;
        }}
      />
    </div>
  );
};

export default FriendsList;
