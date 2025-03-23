import PageLayout from "@/components/page-layout";
import NavFooter from "./_components/nav-footer";
import { Outlet, useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRoomQuery } from "./queries";
import { Suspense, useEffect, useRef } from "react";
import { Room } from "@/lib/types";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { AnimatePresence, motion } from "framer-motion";

const RoomLayout = () => {
  const params = useParams();
  const { data: room } = useSuspenseQuery(
    getRoomQuery(params.roomId as Room["_id"])
  );

  return (
    <PageLayout className="fixed left-0 top-0 bg-background">
      <main className="flex-grow flex flex-col overflow-y-auto">
        <Outlet
          context={{
            room,
            roomId: params.roomId as Room["_id"],
          }}
        />
      </main>
      <NavFooter />
      <AnimatePresence>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          Game starts in {5}s
        </motion.div>
      </AnimatePresence>
    </PageLayout>
  );
};

export default function RoomSuspenseLayout() {
  const user = useLiveUser();
  const params = useParams();
  const leaveRoom = useMutation(api.rooms.leaveRoom);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      if (isMounted.current) {
        leaveRoom({ roomId: params.roomId as Room["_id"], userId: user._id });
      }
    };
  }, [leaveRoom, params.roomId, user._id]);

  return (
    <Suspense>
      <RoomLayout />
    </Suspense>
  );
}
