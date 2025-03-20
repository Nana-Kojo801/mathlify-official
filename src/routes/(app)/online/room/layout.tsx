import PageLayout from "@/components/page-layout";
import NavFooter from "./_components/nav-footer";
import { Outlet, useNavigate, useParams } from "react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRoomQuery } from "./queries";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Room } from "@/lib/types";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useAnswerRushGameStore } from "@/lib/stores/answer-rush-store";

const RoomLayout = () => {
  const params = useParams();
  const navigate = useNavigate();
  const initAnswerRushGame = useAnswerRushGameStore((store) => store.init);
  const { data: room } = useSuspenseQuery(
    getRoomQuery(params.roomId as Room["_id"])
  );
  const updateRoomCountdown = useConvexMutation(api.rooms.updateRoomCountdown);
  const updateRoomIsActive = useConvexMutation(api.rooms.updateRoomIsActive);
  const deleteRoom = useConvexMutation(api.rooms.deleteRoom);

  useQuery(
    convexQuery(api.roomMessages.getRoomMessages, {
      roomId: params.roomId as Room["_id"],
    })
  );

  const [startTimer, setStartTimer] = useState(5);

  const startGame = useCallback(async () => {
    await updateRoomCountdown({ roomId: room._id, value: true });
  }, [updateRoomCountdown, room._id]);

  useEffect(() => {
    if (!room.isCountingdown) return;
    const interval = setInterval(() => {
      setStartTimer((prevTimer) => {
        if (prevTimer <= 0) {
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [room.isCountingdown, startTimer]);

  useEffect(() => {
    if (room.isActive) setStartTimer(5);
  }, [room._id, room.isActive]);

  useEffect(() => {
    if(!room.members.find(member => member.userId === room.ownerId)) {
      deleteRoom({ roomId: room._id})
      navigate("/app/online")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.members])

  useEffect(() => {
    if (startTimer <= 0 && !room.isActive) {
      if (room.gameSettings.type === "Casual") {
        console.log("hello");
      } else {
        initAnswerRushGame(room.gameSettings.answerRush);
        updateRoomCountdown({ roomId: room._id, value: false });
      }
      updateRoomIsActive({ roomId: room._id, value: true });
      navigate("play");
    }
  }, [
    initAnswerRushGame,
    navigate,
    room._id,
    room.gameSettings.answerRush,
    room.gameSettings.type,
    room.isActive,
    startTimer,
    updateRoomCountdown,
    updateRoomIsActive,
  ]);

  return (
    <PageLayout className="fixed left-0 top-0 bg-background">
      <main className="flex-grow flex flex-col overflow-y-auto">
        <Outlet
          context={{ room, roomId: params.roomId as Room["_id"], startGame }}
        />
      </main>
      <NavFooter />
      <AnimatePresence>
        {room.isCountingdown && startTimer > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            Game starts in {startTimer}s
          </motion.div>
        )}
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
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    return () => {
      leaveRoom({ roomId: params.roomId as Room["_id"], userId: user._id });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Suspense>
      <RoomLayout />
    </Suspense>
  );
}
