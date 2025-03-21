import { Trophy, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import { OutletContext } from "../../_types";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useEffect } from "react";

const AnswerRushResults = () => {
  const navigate = useNavigate();
  const { roomId, room } = useOutletContext<OutletContext>();
  const user = useLiveUser();
  const updateUserStats = useConvexMutation(api.users.updateUserStats);

  // Subscribe to game state
  const { data: gameState } = useQuery(
    convexQuery(api.games.getGameState, {
      roomId,
    })
  );

  // Get current game results
  const currentGame = gameState?.games.find(
    (game) => game._id === gameState.currentGameId
  );

  // Update user stats when game ends
  useEffect(() => {
    if (!currentGame || !user) return;

    const userResult = currentGame.results.find(
      (result) => result.userId === user._id
    );
    if (!userResult) return;

    const isWinner = userResult.rank === 1;
    updateUserStats({
      userId: user._id,
      gamesWon: isWinner ? 1 : 0,
      gamesLost: isWinner ? 0 : 1,
    });
  }, [currentGame, user, updateUserStats]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return null;
    }
  };

  if (!currentGame) return <div>Loading results...</div>;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-2xl font-bold">Game Results</h2>
      <div className="w-full max-w-md space-y-4">
        {currentGame.results
          .sort((a, b) => a.rank - b.rank)
          .map((result) => (
            <div
              key={result.userId}
              className="flex items-center justify-between p-4 bg-card rounded-lg"
            >
              <div className="flex items-center gap-2">
                {getRankIcon(result.rank)}
                <span className="font-semibold">
                  {result.userId === user?._id ? "You" : result.username}
                </span>
              </div>
              <span className="text-lg font-bold">{result.score}</span>
            </div>
          ))}
      </div>
      <Button
        onClick={() => navigate(`/app/online/room/${roomId}`)}
        className="mt-4"
      >
        Back to Room
      </Button>
    </div>
  );
};

export default AnswerRushResults;
