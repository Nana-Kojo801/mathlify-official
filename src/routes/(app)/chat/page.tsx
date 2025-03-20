import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import type { FriendMessage, User } from "@/lib/types";
import { api } from "@convex/_generated/api";
import {
  useMutation,
  useQuery,
  useSuspenseQueries,
} from "@tanstack/react-query";
import { ArrowLeft, ArrowUp, Loader } from "lucide-react";
import { Link, useParams } from "react-router";
import { friendQuery, messagesQuery } from "./_queries/queries";
import { convexQuery, useConvex } from "@convex-dev/react-query";
import {
  addFriendMessage,
  deleteFriendMessage,
} from "@/lib/api/friend-messages";
import { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLiveUser } from "@/lib/hooks/useLiveUser";

const FriendChatPage = () => {
  const params = useParams();
  const user = useLiveUser()
  const convex = useConvex();
  const textArea = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the chat container
  const [selectedMessage, setSelectedMessage] = useState<
    FriendMessage["_id"] | null
  >(null);

  const [{ data: friend }, { data: messages }] = useSuspenseQueries({
    queries: [
      friendQuery(params.friendId as User["_id"]),
      messagesQuery(user._id, params.friendId as User["_id"]),
    ],
  });

  const { data: liveMessages } = useQuery({
    ...convexQuery(api.friendMessages.getFriendMessages, {
      user1: user._id,
      user2: params.friendId as User["_id"],
    }),
    initialData: messages,
    gcTime: Infinity,
  });

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [liveMessages]);

  const { mutateAsync: sendMessage, isPending: isMessageSending } = useMutation(
    {
      mutationFn: async () => {
        const text = textArea.current!.value.trim();
        if (text === "") return;
        const newMessage = await convex.mutation(
          api.friendMessages.sendFriendMessage,
          {
            senderId: user._id,
            receiverId: params.friendId as User["_id"],
            text,
          }
        );
        textArea.current!.value = "";
        await addFriendMessage(newMessage);
        scrollToBottom();
      },
    }
  );

  const { mutateAsync: deleteMessage, isPending: isMessageDeleting } =
    useMutation({
      mutationFn: async () => {
        await Promise.all([
          convex.mutation(api.friendMessages.deleteFriendMessage, {
            messageId: selectedMessage as FriendMessage["_id"],
          }),
          deleteFriendMessage(selectedMessage as FriendMessage["_id"]),
        ]);
        setSelectedMessage(null);
      },
    });

  return (
    <div className="w-full h-full flex flex-col fixed inset-0 bg-background">
      <div className="flex items-center px-4 py-3 border-b border-gray-700">
        <Link to="/app" className="text-gray-400 mr-3">
          <ArrowLeft size={24} />
        </Link>
        <UserAvatar user={friend} />
        <p className="text-white text-lg font-medium ml-3">{friend.username}</p>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {liveMessages.map((message) => {
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
              {!owner && friend && (
                <UserAvatar
                  className="size-12"
                  user={friend}
                />
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
        })}
      </div>

      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="w-[calc(100%_-30px)] max-w-[500px] rounded-md">
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <p className="text-gray-500">
              Are you sure you want to delete this message?
            </p>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              disabled={isMessageDeleting}
              variant="outline"
              onClick={() => setSelectedMessage(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isMessageDeleting}
              onClick={async () => {
                await deleteMessage();
              }}
            >
              {isMessageDeleting ? (
                <Loader className="animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="p-3 border-t border-gray-700 flex items-start gap-3">
        <textarea
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white px-4 py-3 min-h-10 rounded-md outline-none resize-none field-sizing-content overflow-y-auto"
          ref={textArea}
        ></textarea>
        <Button
          onClick={async () => {
            await sendMessage();
          }}
          disabled={isMessageSending}
          className="size-[47px] p-2 rounded-md"
        >
          {isMessageSending ? (
            <Loader className="animate-spin" />
          ) : (
            <ArrowUp size={20} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default FriendChatPage;
