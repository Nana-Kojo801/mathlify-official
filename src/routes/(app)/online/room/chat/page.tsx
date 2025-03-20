import Chat from "@/components/chat";
import PageHeader from "@/components/page-header";
import PageLayout from "@/components/page-layout";
import { Room } from "@/lib/types";
import { convexQuery } from "@convex-dev/react-query";
import { useConvex } from "convex/react";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { Id } from "@convex/_generated/dataModel";
import UserAvatar from "@/components/user-avatar";

const RoomChatPage = () => {
  const params = useParams();
  const convex = useConvex();
  const user = useLiveUser();
  const { data: messages } = useQuery({
    ...convexQuery(api.roomMessages.getRoomMessages, {
      roomId: params.roomId as Room["_id"],
    }),
    gcTime: Infinity,
    initialData: [],
  });
  const { mutateAsync: sendMessage, isPending: isMessageSending } = useMutation(
    {
      mutationFn: async (text: string) => {
        await convex.mutation(api.roomMessages.createRoomMessage, {
          text,
          roomId: params.roomId as Room["_id"],
          senderId: user._id,
        });
      },
    }
  );

  const { mutateAsync: deleteMessage, isPending: isMessageDeleting } =
    useMutation({
      mutationFn: async (messageId: Id<"roomMessages">) => {
        await convex.mutation(api.roomMessages.deleteRoomMessage, {
          messageId,
        });
      },
    });

  return (
    <PageLayout className="fixed left-0 top-0 bg-background overflow-y-auto">
      <PageHeader previous title="Chat" />

      <Chat
        messages={messages}
        sendMessage={sendMessage}
        isMessageSending={isMessageSending}
        deleteMessage={deleteMessage}
        isMessageDeleting={isMessageDeleting}
        render={(message, setSelectedMessage) => {
          const owner = message.senderId === user._id;
          return (
            <div
              key={message._id}
              className={`relative flex ${
                owner ? "justify-end" : "items-start gap-2"
              }`}
              onDoubleClick={() => {
                if (owner) {
                  setSelectedMessage(message._id);
                }
              }}
            >
              {!owner && message.sender && (
                <UserAvatar className="size-12" user={message.sender} />
              )}

              <div
                className={`p-3 rounded-lg max-w-[75%] ${
                  owner ? "bg-primary text-white" : "bg-gray-800 text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          );
        }}
      />
    </PageLayout>
  );
};

export default RoomChatPage;
