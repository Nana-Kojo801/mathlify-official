import PageLayout from "@/components/page-layout";
import NavFooter from "./_components/nav-footer";
import { Outlet, useNavigate, useParams, useLocation } from "react-router";
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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const RoomLayout = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initAnswerRushGame = useAnswerRushGameStore((store) => store.init);
  const { data: room } = useSuspenseQuery(
    getRoomQuery(params.roomId as Room["_id"])
  );
  const updateGameState = useConvexMutation(api.games.updateGameState);
  const recoverGame = useConvexMutation(api.games.recoverGame);
  const deleteRoom = useConvexMutation(api.rooms.deleteRoom);
  const initializeGameMutation = useConvexMutation(api.rooms.initializeGame);
  const user = useLiveUser();
  const [, setTick] = useState(0);
  const [isGameStarting, setIsGameStarting] = useState(false);
  
  // Check if the current user is the room owner
  const isRoomOwner = user?._id === room?.ownerId;

  // Subscribe to game state changes
  const { data: gameState } = useQuery(
    convexQuery(api.games.getGameState, {
      roomId: params.roomId as Room["_id"],
    })
  );

  // Update countdown timer
  useEffect(() => {
    if (gameState?.phase !== "countdown") return;
    
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState?.phase]);

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
    if (!room || !isRoomOwner || !updateGameState) return;

    setIsGameStarting(true);

    try {
      // Generate a unique game ID
      const gameId = crypto.randomUUID();
      const startTime = Date.now() + 5000; // 5 seconds from now

      // Update the game state to countdown phase
      await updateGameState({
        roomId: room._id,
        phase: "countdown",
        currentGameId: gameId,
        startTime: startTime,
        settings: room.gameSettings
      });
      
      toast.success("Game starting...");
    } catch (error) {
      console.error("Failed to start game:", error);
      toast.error("Failed to start the game");
      setIsGameStarting(false);
    }
  }, [room, isRoomOwner, updateGameState]);

  // Handle countdown to playing phase transition
  useEffect(() => {
    if (!gameState || !room) return;

    const now = Date.now();
    const startTime = gameState.startTime;

    if (gameState.phase === "countdown" && startTime && now >= startTime) {
      if (room.gameSettings.type === "Answer Rush") {
        initAnswerRushGame(room.gameSettings.answerRush);
      }
      
      // Create a new game ID
      const newGameId = String(crypto.randomUUID());
      
      // Initialize the game in database
      initializeGameMutation({
        roomId: room._id,
        gameId: newGameId,
      });
      
      // Update game state to playing
      updateGameState({
        roomId: room._id,
        phase: "playing",
        currentGameId: newGameId,
      });
      
      // Navigate to the play page
      navigate(`/app/online/room/${room._id}/play`);
      
      // Reset the game starting state
      setIsGameStarting(false);
    }
  }, [gameState, room, updateGameState, initAnswerRushGame, initializeGameMutation, navigate, setIsGameStarting]);

  // When game state changes to playing phase, we navigate to the play route
  useEffect(() => {
    if (!room) return;

    const playPath = `/app/online/room/${room._id}/play`;

    if (gameState?.phase === "playing" && location.pathname !== playPath) {
      console.log("Navigating to play route");
      navigate(playPath);
    } else if (gameState?.phase === "finished" && location.pathname === playPath) {
      console.log("Game finished, returning to room");
      // Give some time for the results component to display before navigating
      const timer = setTimeout(() => {
        navigate(`/app/online/room/${room._id}`);
      }, 6000); // Slightly longer than the results component's timer
      
      return () => clearTimeout(timer);
    } else if (gameState?.phase === "error") {
      console.error("Game error:", gameState.error);
      toast.error(gameState.error?.message || "An unknown error occurred");
      navigate(`/app/online/room/${room._id}`);
    }
  }, [gameState?.phase, room, navigate, location.pathname, gameState?.error]);

  // Handle room owner leaving
  useEffect(() => {
    const owner = room.members?.find((member) => member?.userId === room.ownerId);
    if (!owner) {
      deleteRoom({ roomId: room._id });
      navigate("/app/online");
      toast("Room owner left the group");
    }
  }, [room.members, room.ownerId, deleteRoom, navigate, room._id]);

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
            {gameState.error?.message || "Recovering game..."}
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
