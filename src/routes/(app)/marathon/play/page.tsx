import CasualGame from "@/components/casual-game/casual-game";
import CasualGameLayout, {
  InnerCasualGameLayout,
} from "@/components/casual-game-layout";
import useCasualGameStore from "@/lib/stores/casual-game-store";
import { useEffect, useRef, useState } from "react";
import { calculateMarathonScore, generateDifficulty } from "@/lib/helpers";
import { useNavigate } from "react-router";
import RoundHeader from "./_components/round-header";
import CorrectActions from "./_components/correct-actions";
import RoundLostActions from "./_components/round-lost-actions";
import { useAuth } from "@/components/auth-provider";
import { User } from "@/lib/types";

const MarathonPlayPage = () => {
  const [round, setRound] = useState(1);
  const { user, updateAuthUser } = useAuth();
  const setState = useCasualGameStore((store) => store.setState);
  const state = useCasualGameStore((store) => store.state);
  const init = useCasualGameStore((store) => store.init);
  const timeUsed = useCasualGameStore((store) => store.timeUsed);
  const [totalTime, setTotalTime] = useState(0);
  const isMounted = useRef(false);
  const stats = useRef<User["marathon"]>(user.marathon);

  const navigate = useNavigate();

  const nextRound = () => {
    setRound((prevRound) => prevRound + 1);
    init(generateDifficulty(round + 1));
    setState("idle");
  };

  const quit = () => {
    navigate("/app/marathon");
  };

  const playAgain = () => {
    setRound(1);
    init(generateDifficulty(1));
    setState("idle");
  };

  const onGameOver = async () => {
    await updateAuthUser({
      marathon: {
        round: Math.max(user.marathon.round, stats.current.round),
        avgTime:
          user.marathon.avgTime === 0
            ? stats.current.avgTime
            : Math.min(user.marathon.avgTime, stats.current.avgTime),
        score: Math.max(user.marathon.score, stats.current.score),
      },
    });
  };

  const onCorrect = () => {
    setTotalTime((prevTotalTime) => prevTotalTime + timeUsed);

    const avgTime = parseFloat(((totalTime + timeUsed) / round).toFixed(2));
    stats.current = {
      round: round,
      avgTime,
      score: calculateMarathonScore(avgTime, round),
    };
  };

  useEffect(() => {
    if (["wrong", "timeout"].includes(state)) onGameOver();
    if (state === "correct") onCorrect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    return () => {
      onGameOver();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  return (
    <CasualGameLayout className="flex flex-col">
      <RoundHeader round={round} />
      <InnerCasualGameLayout>
        <CasualGame
          quitTo="/app/marathon"
          resultActions={{
            correct: () => (
              <CorrectActions
                stats={stats.current}
                nextRound={nextRound}
                quit={quit}
              />
            ),
            wrong: () => (
              <RoundLostActions
                stats={stats.current}
                quit={quit}
                playAgain={playAgain}
              />
            ),
            timeout: () => (
              <RoundLostActions
                stats={stats.current}
                quit={quit}
                playAgain={playAgain}
              />
            ),
          }}
        />
      </InnerCasualGameLayout>
    </CasualGameLayout>
  );
};

export default MarathonPlayPage;
