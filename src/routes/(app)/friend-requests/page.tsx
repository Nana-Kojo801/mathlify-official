import { useAuth } from "@/components/auth-provider";
import PageHeader from "@/components/page-header";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { addFriend } from "@/lib/api/friends";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Check } from "lucide-react";

const FriendRequestsPage = () => {
  const user = useLiveUser()
  const { updateAuthUser } = useAuth();
  const requests =
    useQuery(api.requests.getReceivedRequest, { userId: user._id }) || [];
  const acceptRequest = useMutation(api.requests.acceptRequest);
  return (
    <PageLayout className="fixed top-0 left-0">
      {/* Header */}
      <PageHeader
        returnTo="/app"
        title="Requests"
        className="bg-background border-b border-gray-700"
      />

      {/* Friend Requests List */}
      <div className="space-y-4 mt-2 p-4">
        {requests.map((request, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-gray-800 rounded-md"
          >
            <UserAvatar user={request.sender} />
            <div className="flex-1">
              <p className="text-white font-medium">
                {request.receiver.username}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={async () => {
                  await acceptRequest({ requestId: request._id });
                  await addFriend(request.sender);
                  await updateAuthUser({
                    friends: [...user.friends, request.senderId],
                  });
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm"
              >
                <Check size={16} />
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default FriendRequestsPage;
