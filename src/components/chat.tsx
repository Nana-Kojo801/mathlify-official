import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ArrowUp, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn } from "@/lib/utils";

type ChatProps<T, I> = {
  messages: T[];
  sendMessage: (text: string) => Promise<void>;
  deleteMessage: (selectedMessage: I) => Promise<void>;
  isMessageSending: boolean;
  isMessageDeleting: boolean;
  render: (
    message: T,
    setSelectedMessage: React.Dispatch<unknown>
  ) => JSX.Element;
  className?: string;
};

function Chat<T, I>({
  messages,
  isMessageSending,
  render,
  sendMessage,
  deleteMessage,
  isMessageDeleting,
  className = "",
}: ChatProps<T, I>) {
  const textArea = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<unknown | null>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={cn("flex flex-col overflow-y-auto h-full", className)}>
      <div
        ref={chatContainerRef}
        className="flex-grow p-4 space-y-3 overflow-y-auto"
      >
        {messages.map((message) => render(message, setSelectedMessage))}
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
                await deleteMessage(selectedMessage as I);
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
            const text = textArea.current!.value.trim();
            if (text === "") return;
            await sendMessage(text);
            textArea.current!.value = "";
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
}

export default Chat;
