import { useEffect } from "react";
import { useOutletContext } from "react-router";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import AnswerRush from "@/components/answer-rush/answer-rush";
import AnswerRushResults from "./answer-rush-results";
import { useAnswerRushGameStore } from "@/lib/stores/answer-rush-store";
import type { OutletContext } from "../../_types";
import { useLiveUser } from "@/lib/hooks/useLiveUser";

/**
 * The online version of the Answer Rush game component
 * Handles score updates, game initialization, and game state transitions
 */
const OnlineAnswerRushPlayPage = () => {
  // Get context and auth
  const { room, roomId } = useOutletContext<OutletContext>();
  const user = useLiveUser();
  
  // Local game state
  const state = useAnswerRushGameStore((store) => store.state);
  const setState = useAnswerRushGameStore((store) => store.setState);
  const score = useAnswerRushGameStore((store) => store.score);
  const initAnswerRushGame = useAnswerRushGameStore((store) => store.init);

  // Server mutations
  const updateScore = useMutation(api.rooms.updateScore);
  const updateGameState = useMutation(api.games.updateGameState);
  const finalizeGame = useMutation(api.rooms.finalizeGame);

  // Get game state from server
  const gameState = useQuery(api.games.getGameState, { 
    roomId 
  });

  // Initialize game when entering play page
  useEffect(() => {
    if (!gameState || !room?.gameSettings?.answerRush) return;

    // Only initialize if we're in the playing phase and it's an Answer Rush game
    if (gameState.phase === "playing" && room.gameSettings.type === "Answer Rush") {
      // Initialize local state to countdown if not already playing
      if (state === "idle") {
        console.log("Initializing Answer Rush game");
        // Initialize with the game settings
        initAnswerRushGame(room.gameSettings.answerRush);
        setState("countdown");
      }
    }
  }, [gameState, room, state, setState, initAnswerRushGame]);

  // Update score on server when local score changes
  useEffect(() => {
    if (!user?._id || !gameState?.currentGameId || score === 0) return;

    const updateServerScore = async () => {
      try {
        await updateScore({
          roomId,
          gameId: gameState.currentGameId!,
          userId: user._id,
          score,
        });
      } catch (error) {
        console.error("Failed to update score:", error);
      }
    };

    updateServerScore();
  }, [score, roomId, gameState?.currentGameId, user?._id, updateScore]);

  // Handle game end
  useEffect(() => {
    if (!gameState || !user?._id) return;

    // When local game ends, update server game state
    if (state === "results" && gameState.phase === "playing") {
      const finishGame = async () => {
        try {
          // Update game state to finished
          await updateGameState({
            roomId,
            phase: "finished",
            endTime: Date.now()
          });

          // Finalize game (update player stats)
          if (gameState.currentGameId) {
            await finalizeGame({
              roomId,
              gameId: gameState.currentGameId,
            });
          }
        } catch (error) {
          console.error("Failed to finalize game:", error);
        }
      };

      finishGame();
    }
  }, [state, gameState, roomId, user?._id, updateGameState, finalizeGame]);

  return (
    <AnswerRush
      CustomResults={AnswerRushResults}
    />
  );
};

export default OnlineAnswerRushPlayPage;
