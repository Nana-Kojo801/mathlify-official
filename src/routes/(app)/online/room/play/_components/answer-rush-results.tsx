import { Trophy, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import { OutletContext } from "../../_types";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { api } from "@convex/_generated/api";

// Define a type for game results to include the rank property
type GameResult = {
  userId: string;
  username: string;
  score: number;
  rank?: number;
};

/**
 * Results component for the Answer Rush online game
 * Shows the leaderboard and final scores
 */
const AnswerRushResults = () => {
  const navigate = useNavigate();
  const { roomId } = useOutletContext<OutletContext>();
  const user = useLiveUser();

  // Get room data (which contains game results)
  const { data: room } = useQuery(
    convexQuery(api.rooms.getRoom, {
      id: roomId,
    })
  );

  // Get game state
  const { data: gameState } = useQuery(
    convexQuery(api.games.getGameState, {
      roomId,
    })
  );

  // Find the current game results
  const currentGame = useMemo(() => {
    if (!room?.answerRushResults || !gameState?.currentGameId) return null;
    
    // Find the game with matching ID
    const game = room.answerRushResults.find(
      (game) => game.gameId === gameState.currentGameId
    );
    
    if (!game) return null;
    
    // Make sure the results have at least one item
    return game.results.length > 0 ? game : null;
  }, [room?.answerRushResults, gameState?.currentGameId]);

  // Sort results and calculate ranks
  const sortedResults = useMemo<GameResult[]>(() => {
    if (!currentGame?.results?.length) return [];
    
    // Sort by score (highest first)
    const sorted = [...currentGame.results].sort((a, b) => b.score - a.score);
    
    // If results already have ranks, return them
    if ('rank' in sorted[0]) {
      return sorted as GameResult[];
    }
    
    // Otherwise, calculate ranks
    let currentRank = 1;
    let prevScore = sorted[0].score;
    
    return sorted.map((result, index) => {
      // Same score = same rank
      if (index > 0 && result.score < prevScore) {
        currentRank = index + 1;
        prevScore = result.score;
      }
      
      return {
        ...result,
        rank: currentRank
      } as GameResult;
    });
  }, [currentGame?.results]);

  // Get icon for player rank
  const getRankIcon = (rank?: number) => {
    if (rank === undefined) return null;
    
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

  // Navigate back to room when finished
  // useEffect(() => {
  //   if (gameState?.phase === "finished") {
  //     const timer = setTimeout(() => {
  //       navigate(`/app/online/room/${roomId}`);
  //     }, 5000); // Automatically return to room after 5 seconds

  //     return () => clearTimeout(timer);
  //   }
  // }, [gameState?.phase, navigate, roomId]);

  // If no results yet, show loading
  if (!sortedResults.length) {
    return <div className="flex justify-center items-center h-full">Loading results...</div>;
  }

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
