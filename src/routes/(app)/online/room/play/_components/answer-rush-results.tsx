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
import { useEffect, useMemo } from "react";

const AnswerRushResults = () => {
  const navigate = useNavigate();
  const { roomId } = useOutletContext<OutletContext>();
  const user = useLiveUser();
  const updateUser = useConvexMutation(api.users.updateUser);

  // Subscribe to game state and room data for results
  const { data: gameState } = useQuery(
    convexQuery(api.games.getGameState, {
      roomId,
    })
  );
  
  const { data: room } = useQuery(
    convexQuery(api.rooms.getRoom, {
      id: roomId,
    })
  );

  // Get current game results from room data
  const currentGame = room?.answerRushResults?.find(
    (game) => game.gameId === gameState?.currentGameId
  );

  // Sort results and calculate ranks
  const sortedResults = useMemo(() => {
    if (!currentGame?.results) return [];
    
    // Sort by score (highest first)
    const sorted = [...currentGame.results].sort((a, b) => b.score - a.score);
    
    // Add rank
    let currentRank = 1;
    let lastScore = sorted[0]?.score ?? 0;
    
    return sorted.map((result, index) => {
      // Same score = same rank
      if (index > 0 && result.score < lastScore) {
        currentRank = index + 1;
        lastScore = result.score;
      }
      
      return {
        ...result,
        rank: currentRank
      };
    });
  }, [currentGame]);

  // Update user stats when game ends
  useEffect(() => {
    if (!sortedResults.length || !user) return;

    const userResult = sortedResults.find(
      (result) => result.userId === user._id
    );
    if (!userResult) return;

    const isWinner = userResult.rank === 1;
    // Update only valid fields for the user
    updateUser({
      id: user._id,
      // Store wins/losses in the elo object
      elo: {
        ...user.elo,
        answerRush: user.elo?.answerRush + (isWinner ? 10 : -5)
      }
    });
  }, [sortedResults, user, updateUser]);

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
        {sortedResults.map((result) => (
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
