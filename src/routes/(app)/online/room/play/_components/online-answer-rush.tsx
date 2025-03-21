import AnswerRush from "@/components/answer-rush/answer-rush";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { useAnswerRushGameStore } from "@/lib/stores/answer-rush-store";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useEffect } from "react";
import { useOutletContext } from "react-router";
import { OutletContext } from "../../_types";
import AnswerRushResults from "./answer-rush-results";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

const OnlineAnswerRushPlayPage = () => {
  const user = useLiveUser();
  const { roomId, room } = useOutletContext<OutletContext>();
  const setState = useAnswerRushGameStore((store) => store.setState);
  const score = useAnswerRushGameStore((store) => store.score);
  const updateScore = useConvexMutation(api.rooms.updateAnswerRushScore);
  const initAnswerRushGame = useAnswerRushGameStore((store) => store.init);
  const updateGameState = useConvexMutation(api.games.updateGameState);
  const finalizeGame = useConvexMutation(api.rooms.finalizeGame);

  // Subscribe to game state
  const { data: gameState } = useQuery(
    convexQuery(api.games.getGameState, {
      roomId,
    })
  );

  // Initialize game when entering play page
  useEffect(() => {
    if (gameState?.phase === "playing") {
      initAnswerRushGame(room.gameSettings.answerRush);
      setState("countdown");
    }
  }, [gameState?.phase, room.gameSettings.answerRush, initAnswerRushGame, setState]);

  // Update score
  useEffect(() => {
    if (!gameState?.currentGameId) return;
    updateScore({ 
      score, 
      roomId, 
      userId: user._id, 
      gameId: gameState.currentGameId 
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  // Handle game state transitions
  useEffect(() => {
    if (!gameState) return;

    const state = useAnswerRushGameStore.getState().state;
    if (state === "results" && gameState.phase === "playing") {
      // First update the game state to finished
      updateGameState({
        roomId,
        phase: "finished",
        endTime: Date.now(),
      });
      
      // Then finalize the game to update player stats
      if (gameState.currentGameId) {
        finalizeGame({
          roomId,
          gameId: gameState.currentGameId
        });
      }
    }
  }, [gameState, roomId, updateGameState, finalizeGame]);

  return <AnswerRush CustomResults={AnswerRushResults} />;
};

export default OnlineAnswerRushPlayPage;
