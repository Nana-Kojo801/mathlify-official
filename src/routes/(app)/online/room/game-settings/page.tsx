import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/page-header";
import PageLayout from "@/components/page-layout";
import { useState } from "react";
import CasualGameSettings from "./_components/casual-game-settings";
import AnswerRushGameSettings from "./_components/answer-rush-game-settings";
import { useOutletContext } from "react-router";
import { OutletContext } from "../_types";

const GameSettingsPage = () => {
  const { room } = useOutletContext<OutletContext>();
  const [type, setType] = useState<"Casual" | "Answer Rush">(
    room.gameSettings.type as "Casual" | "Answer Rush"
  );

  return (
    <PageLayout>
      <PageHeader previous title="Game Settings" />
      <div className="p-4 space-y-4">
        <h2 className="text-gray-400 text-base mb-1">Type</h2>
        <Select
          onValueChange={(type) => setType(type as "Casual" | "Answer Rush")}
          defaultValue={type}
        >
          <SelectTrigger className="py-5 bg-gray-700">
            <SelectValue placeholder="Select game type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700">
            <SelectItem className="py-3" value="Casual">
              Casual
            </SelectItem>
            <SelectItem className="py-3" value="Answer Rush">
              Answer Rush
            </SelectItem>
          </SelectContent>
        </Select>
        {type === "Casual" && <CasualGameSettings />}
        {type === "Answer Rush" && <AnswerRushGameSettings />}
      </div>
    </PageLayout>
  );
};

export default GameSettingsPage;
