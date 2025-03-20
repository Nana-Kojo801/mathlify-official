import { buttonVariants } from "@/components/ui/button";
import { MessageCircle, Plus, Users } from "lucide-react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import UserList from "@/components/users-list";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { getFriendsQuery } from "@/lib/queries";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/components/auth-provider";

const FriendsList = () => {
  const { user } = useAuth()
  const { data: friends } = useSuspenseQuery(getFriendsQuery());

  const { data: liveFriends } = useQuery({
    ...convexQuery(api.users.getFriends, { userId: user._id }),
    initialData: friends,
    gcTime: Infinity
  })

  return (
    <section>
      <div className="flex flex-col mb-2 gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">👥 My Friends</h3>
          <div className="flex items-center gap-4">
            <Link to="/app/search-users">
              <Plus className="size-5" />
            </Link>
            <Link to="/app/friend-requests">
              <Users className="size-5" />
            </Link>
          </div>
        </div>
        <UserList
          list={liveFriends}
          className="size-12"
          actions={(friend) => {
            return (
              <Link
                to={`/app/chat-friend/${friend._id}`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-10 w-10"
                )}
              >
                <MessageCircle className="size-5" />
              </Link>
            );
          }}
          fallback={() => {
            return <p className="mt-1">No friends yet</p>;
          }}
        />
      </div>
    </section>
  );
};

export default FriendsList;
