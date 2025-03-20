import AnswerRush from "@/components/answer-rush/answer-rush";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { useAnswerRushGameStore } from "@/lib/stores/answer-rush-store";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useEffect } from "react";
import { useOutletContext } from "react-router";
import { OutletContext } from "../../_types";
import AnswerRushResults from "./answer-rush-results";

const OnlineAnswerRushPlayPage = () => {
  const user = useLiveUser();
  const { roomId, room } = useOutletContext<OutletContext>();
  const setState = useAnswerRushGameStore((store) => store.setState);
  const score = useAnswerRushGameStore((store) => store.score);
  const updateScore = useConvexMutation(api.rooms.updateAnswerRushScore);

  useEffect(() => {
    updateScore({ score, roomId, userId: user._id, gameId: room.currentGameId });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  useEffect(() => {
    setState("countdown");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AnswerRush CustomResults={AnswerRushResults} />;
};

export default OnlineAnswerRushPlayPage;
