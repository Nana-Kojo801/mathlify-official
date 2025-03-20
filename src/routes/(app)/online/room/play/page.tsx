import { useOutletContext } from "react-router";
import { OutletContext } from "../_types";
import OnlineAnswerRushPlayPage from "./_components/online-answer-rush";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useEffect, useRef } from "react";
import { useLiveUser } from "@/lib/hooks/useLiveUser";

const OnlinePlayPage = () => {
  const { room } = useOutletContext<OutletContext>();
  const user = useLiveUser();
  const setGameId = useConvexMutation(api.rooms.setGameId);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (room.ownerId === user._id)
      setGameId({ gameId: String(crypto.randomUUID()), roomId: room._id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return room.gameSettings.type === "Answer Rush" ? (
    <OnlineAnswerRushPlayPage />
  ) : (
    <div></div>
  );
};

export default OnlinePlayPage;
