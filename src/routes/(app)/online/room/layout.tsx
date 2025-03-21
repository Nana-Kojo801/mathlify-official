import PageLayout from "@/components/page-layout";
import NavFooter from "./_components/nav-footer";
import { Outlet, useNavigate, useParams } from "react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRoomQuery } from "./queries";
import { Suspense, useCallback, useEffect, useRef } from "react";
import { Room, GamePhase } from "@/lib/types";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useAnswerRushGameStore } from "@/lib/stores/answer-rush-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const RoomLayout = () => {
  const params = useParams();
  const navigate = useNavigate();
  const initAnswerRushGame = useAnswerRushGameStore((store) => store.init);
  const { data: room } = useSuspenseQuery(
    getRoomQuery(params.roomId as Room["_id"])
  );
  const updateGameState = useConvexMutation(api.games.updateGameState);
  const recoverGame = useConvexMutation(api.games.recoverGame);
  const deleteRoom = useConvexMutation(api.rooms.deleteRoom);
  const user = useLiveUser();

  // Subscribe to game state changes
  const { data: gameState } = useQuery(
    convexQuery(api.games.getGameState, {
      roomId: params.roomId as Room["_id"],
    })
  );

  // Update player presence
  useEffect(() => {
    if (!gameState) return;
    
    const interval = setInterval(() => {
      updateGameState({
        roomId: room._id,
        playerUpdate: {
          userId: user._id,
          lastSeen: Date.now(),
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [gameState, room._id, user._id, updateGameState]);

  const startGame = useCallback(async () => {
    try {
      await updateGameState({
        roomId: room._id,
        phase: "countdown",
        startTime: Date.now() + 5000,
      });
    } catch (error) {
      toast.error("Failed to start the game");
    }
  }, [updateGameState, room._id]);

  // Handle game phase transitions
  useEffect(() => {
    if (!gameState) return;

    const now = Date.now();
    const startTime = gameState.startTime;
    const endTime = gameState.endTime;

    switch (gameState.phase) {
      case "countdown":
        if (startTime && now >= startTime) {
          if (room.gameSettings.type === "Answer Rush") {
            initAnswerRushGame(room.gameSettings.answerRush);
          }
          updateGameState({
            roomId: room._id,
            phase: "playing",
          });
        }
        break;

      case "playing":
        if (endTime && now >= endTime) {
          updateGameState({
            roomId: room._id,
            phase: "finished",
          });
        }
        break;

      case "error":
        toast.error(gameState.error?.message || "Game error occurred");
        break;
    }
  }, [gameState, room._id, room.gameSettings, initAnswerRushGame, updateGameState]);

  // Handle room owner leaving
  useEffect(() => {
    if (!room.members.find((member) => member.userId === room.ownerId)) {
      deleteRoom({ roomId: room._id });
      navigate("/app/online");
      toast("Room owner left the group");
    }
  }, [room.members, deleteRoom, navigate, room._id, room.ownerId]);

  // Calculate countdown
  const countdown = gameState?.phase === "countdown" && gameState.startTime
    ? Math.max(0, Math.ceil((gameState.startTime - Date.now()) / 1000))
    : 0;

  const handleRecoverGame = async () => {
    try {
      await recoverGame({ roomId: room._id });
      toast.success("Attempting to recover game...");
    } catch (error) {
      toast.error("Failed to recover game");
    }
  };

  return (
    <PageLayout className="fixed left-0 top-0 bg-background">
      <main className="flex-grow flex flex-col overflow-y-auto">
        <Outlet
          context={{ room, roomId: params.roomId as Room["_id"], startGame }}
        />
      </main>
      <NavFooter />
      <AnimatePresence>
        {gameState?.phase === "countdown" && countdown > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            Game starts in {countdown}s
          </motion.div>
        )}
        {gameState?.phase === "error" && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-4"
          >
            <span>{gameState.error?.message}</span>
            {room.ownerId === user._id && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRecoverGame}
              >
                Recover Game
              </Button>
            )}
          </motion.div>
        )}
        {gameState?.phase === "recovering" && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {gameState.error?.message}
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
