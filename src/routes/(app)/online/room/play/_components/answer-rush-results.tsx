import { Trophy, Medal, ChevronLeft, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useOutletContext } from "react-router";
import { OutletContext } from "../../_types";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useEffect, useRef } from "react";
import { useRoomUser } from "../../hooks";

const AnswerRushResults = () => {
  const { room } = useOutletContext<OutletContext>();
  const user = useRoomUser(room);
  const currentGame = room.answerRushResults.find(
    (game) => game.gameId === room.currentGameId
  )!;
  const navigate = useNavigate();
  const updateRoomIsActive = useConvexMutation(api.rooms.updateRoomIsActive);
  const updateMember = useConvexMutation(api.rooms.updateMember);
  const increaseGamesPlayed = useConvexMutation(api.rooms.increaseGamesPlayed);
  const isMounted = useRef(false);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-500 w-6 h-6 md:w-6 md:h-6" />;
      case 1:
        return <Medal className="text-zinc-300 w-6 h-6 md:w-6 md:h-6" />;
      case 2:
        return <Medal className="text-amber-600 w-6 h-6 md:w-6 md:h-6" />;
      default:
        return (
          <Award className="text-primary w-5 h-5 md:w-5 md:h-5 opacity-75" />
        );
    }
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    updateMember({
      roomId: room._id,
      userId: user.userId,
      patch:
        currentGame.results[0].userId === user.userId
          ? { gamesWon: user.gamesWon + 1 }
          : { gamesLost: user.gamesLost + 1 },
    });
    if (room.ownerId === user.userId) increaseGamesPlayed({ roomId: room._id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 md:py-8">
      {/* Header section */}
      <div className="relative mb-6 md:mb-6">
        <div className="absolute top-0 right-0 w-24 h-24 md:w-28 md:h-28 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 md:w-20 md:h-20 bg-secondary/10 rounded-full blur-2xl -z-10"></div>

        <div className="flex items-center justify-center mb-2">
          <Sparkles className="text-primary w-5 h-5 md:w-5 md:h-5 mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            RESULTS
          </h1>
          <Sparkles className="text-primary w-5 h-5 md:w-5 md:h-5 ml-2" />
        </div>

        <div className="h-1 w-24 md:w-28 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full"></div>
      </div>

      {/* Scrollable leaderboard list */}
      <div className="max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-muted/10">
        <div className="flex flex-col space-y-3">
          {currentGame.results
            .sort((a, b) => b.score - a.score)
            .map((user, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 md:p-4 rounded-lg backdrop-blur-sm transition-all duration-300 hover:translate-x-1 ${
                  index === 0
                    ? "bg-primary/10 border-l-4 border-primary"
                    : index === 1
                    ? "bg-secondary/10 border-l-4 border-secondary"
                    : index === 2
                    ? "bg-accent/10 border-l-4 border-accent"
                    : "bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div
                    className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full shadow-inner ${
                      index === 0
                        ? "bg-primary/20 text-primary"
                        : index === 1
                        ? "bg-secondary/20 text-secondary"
                        : index === 2
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className="text-sm md:text-base font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-base md:text-lg font-medium text-foreground truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                    {user.username}
                  </span>
                </div>

                <div className="flex items-center space-x-2 md:space-x-3">
                  <div
                    className={`px-3 py-1 rounded-full text-sm md:text-sm font-bold ${
                      index === 0
                        ? "bg-primary/20 text-primary"
                        : index === 1
                        ? "bg-secondary/20 text-secondary"
                        : index === 2
                        ? "bg-accent/20 text-accent"
                        : "bg-background text-foreground border border-border"
                    }`}
                  >
                    {user.score}
                  </div>
                  {getRankIcon(index)}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-6 md:mt-6 flex justify-center">
        <Button
          onClick={async () => {
            await updateRoomIsActive({ roomId: room._id, value: false });
            navigate(`/app/online/room/${room._id}`);
          }}
          className="text-base w-full"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Room</span>
        </Button>
      </div>
    </div>
  );
};

export default AnswerRushResults;
