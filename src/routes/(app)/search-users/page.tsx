import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import UserList from "@/components/users-list";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery as useConvexQuery } from "convex/react";
import { ArrowLeft, Check, Clock3, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const SearchUsersPage = () => {
  const user = useLiveUser();
  const [searchTerm, setSearchTerm] = useState("");
  const users =
    useConvexQuery(api.users.searchUser, {
      username: searchTerm,
      user: user.username,
    }) || [];
  const requests =
    useConvexQuery(api.requests.getSentRequest, { userId: user._id }) || [];
  const createRequest = useMutation(api.requests.createRequest);

  const checkRequestSent = (userId: Id<"users">) => {
    return requests.find((r) => r.receiverId === userId) ? true : false;
  };

  const checkFriend = (userId: Id<"users">) => {
    return user.friends.find((friendId) => friendId === userId) ? true : false;
  };

  return (
    <PageLayout className="fixed inset-0 bg-background">
      {/* Header */}
      <div className="border-b border-gray-700 pb-3 mb-3 p-4">
        <div className="relative flex items-center justify-center mb-3">
          {/* Back Button (Left) */}
          <Link to="/app" className="absolute left-0 text-gray-400">
            <ArrowLeft className="size-6" />
          </Link>

          {/* Title (Centered) */}
          <h2 className="text-lg font-semibold text-white">
            Search for Friends
          </h2>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search users..."
          className="w-full bg-gray-800 text-white px-3 py-2 rounded-md outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="px-4 pb-4 overflow-y-auto">
        <UserList
          list={users}
          actions={(listUser) => {
            const alreadySent = checkRequestSent(listUser._id);
            const friend = checkFriend(listUser._id);
            return friend ? (
              <Check className="size-6 mr-2 text-green-400" />
            ) : alreadySent ? (
              <Clock3 className="size-6 mr-2 text-yellow-400" />
            ) : (
              <Button
                onClick={async () => {
                  await createRequest({
                    senderId: user._id,
                    receiverId: listUser._id,
                  });
                }}
                className="py-3"
              >
                <UserPlus />
                Add
              </Button>
            );
          }}
        />
      </div>
    </PageLayout>
  );
};

export default SearchUsersPage;
