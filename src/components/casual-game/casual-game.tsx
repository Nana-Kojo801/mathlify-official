import useCasualGameStore from "@/lib/stores/casual-game-store";
import Idle from "./idle";
import CountDown from "./count-down";
import Questioning from "./questioning";
import Answer from "./answer";
import { Correct, Timeout, Wrong } from "./results";
import { useNavigate } from "react-router";
import { PropsWithChildren, useEffect, useRef } from "react";
import React from "react";

type CasualGameProps = PropsWithChildren & {
  quitTo: string;
  resultActions?: {
    correct?: () => React.JSX.Element;
    wrong?: () => React.JSX.Element;
    timeout?: () => React.JSX.Element;
  };
};

const CasualGame = ({ quitTo, children, resultActions }: CasualGameProps) => {
  const state = useCasualGameStore((store) => store.state);
  const setState = useCasualGameStore((store) => store.setState);
  const reset = useCasualGameStore((store) => store.reset);
  const init = useCasualGameStore((store) => store.init);
  const difficulty = useCasualGameStore((store) => store.difficulty);
  const navigate = useNavigate();
  const isMounted = useRef(false);

  const playAgain = () => {
    init(difficulty);
    setState("idle");
  };

  const quit = () => {
    navigate(quitTo, { replace: true });
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {state === "idle" && <Idle />}
      {state === "countdown" && <CountDown />}
      {state === "questioning" && <Questioning />}
      {state === "answer" && <Answer />}
      {state === "correct" && (
        <Correct
          playAgain={playAgain}
          quit={quit}
          CorrectActions={resultActions?.correct}
        />
      )}
      {state === "wrong" && (
        <Wrong playAgain={playAgain} quit={quit} WrongActions={resultActions?.wrong} />
      )}
      {state === "timeout" && (
        <Timeout
          playAgain={playAgain}
          quit={quit}
          TimeoutActions={resultActions?.timeout}
        />
      )}
      {children}
    </>
  );
};

export default CasualGame;
