// import { useOutletContext } from "react-router";
// import { OutletContext } from "../_types";
// import OnlineAnswerRushPlayPage from "./_components/online-answer-rush";
// import { useConvexMutation } from "@convex-dev/react-query";
// import { api } from "@convex/_generated/api";
// import { useEffect } from "react";
// import { useLiveUser } from "@/lib/hooks/useLiveUser";
// import { useQuery } from "@tanstack/react-query";
// import { convexQuery } from "@convex-dev/react-query";

import OnlineAnswerRushPlayPage from "./_components/online-answer-rush";

const OnlinePlayPage = () => {
  // const { room } = useOutletContext<OutletContext>();
  // const user = useLiveUser();
  // const updateGameState = useConvexMutation(api.games.updateGameState);
  
  // // Subscribe to game state
  // const { data: gameState } = useQuery(
  //   convexQuery(api.games.getGameState, {
  //     roomId: room._id,
  //   })
  // );

  // // Initialize game when entering play page
  // useEffect(() => {
  //   if (room.ownerId === user._id && gameState?.phase === "playing") {
  //     updateGameState({
  //       roomId: room._id,
  //       currentGameId: room.currentGameId,
  //     });
  //   }
  // }, [room._id, room.ownerId, user._id, gameState?.phase, updateGameState]);

  // if (room.gameSettings.type !== "Answer Rush") {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <p className="text-lg text-gray-600">
  //         {room.gameSettings.type} game mode is not yet implemented
  //       </p>
  //     </div>
  //   );
  // }

  return <OnlineAnswerRushPlayPage />;
};

export default OnlinePlayPage;
