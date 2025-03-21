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
  const { roomId } = useOutletContext<OutletContext>();
  const setState = useAnswerRushGameStore((store) => store.setState);
  const score = useAnswerRushGameStore((store) => store.score);
  const updateScore = useConvexMutation(api.rooms.updateAnswerRushScore);

  // Subscribe to game state
  const { data: gameState } = useQuery(
    convexQuery(api.games.getGameState, {
      roomId,
    })
  );

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

  useEffect(() => {
    if (gameState?.phase === "playing") {
      setState("countdown");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.phase]);

  return <AnswerRush CustomResults={AnswerRushResults} />;
};

export default OnlineAnswerRushPlayPage;
