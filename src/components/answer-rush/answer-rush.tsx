import { useAnswerRushGameStore } from "@/lib/stores/answer-rush-store";
import Idle from "./idle";
import CountDown from "./count-down";
import Questioning from "./questioning";
import { useEffect, useRef } from "react";
import Results from "./results";
import { useNavigate } from "react-router";
import React from "react";

type AnswerRushProps = {
  CustomResults?: () => React.JSX.Element;
};

const AnswerRush = ({ CustomResults }: AnswerRushProps) => {
  const state = useAnswerRushGameStore((store) => store.state);
  const init = useAnswerRushGameStore((store) => store.init);
  const difficulty = useAnswerRushGameStore((store) => store.difficulty);
  const reset = useAnswerRushGameStore((store) => store.reset);
  const navigate = useNavigate();
  const isMounted = useRef(false);

  const playAgain = () => {
    init(difficulty);
  };

  const quit = () => {
    navigate("/app/practice", { replace: true });
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
    <div className="w-full h-full fixed top-0 left-0 bg-background flex justify-center items-center">
      {state === "idle" && <Idle />}
      {state === "countdown" && <CountDown />}
      {state === "questioning" && <Questioning />}
      {state === "results" && (
      CustomResults ? <CustomResults /> : <Results quit={quit} playAgain={playAgain} />
      )}
    </div>
  );
};

export default AnswerRush;
