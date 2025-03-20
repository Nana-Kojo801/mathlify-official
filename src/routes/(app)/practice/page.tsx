import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bolt, Hourglass } from "lucide-react";
import PageLayout from "@/components/page-layout";
import CasualSettings from "./_components/casual-settings";
import AnswerRushSettings from "./_components/answer-rush-settings";
import { Outlet } from "react-router";
import PageHeader from "@/components/page-header";

const PracticePage = () => {
  const [mode, setMode] = useState("casual");

  return (
    <PageLayout>
      <PageHeader title="Practice Mode" />
      <div className="p-4">
        <Tabs value={mode} onValueChange={setMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2 place-content-center px-2 py-6 bg-gray-800 rounded-lg">
            <TabsTrigger
              value="casual"
              className="flex-1 flex items-center justify-center gap-2 px-8 text-lg"
            >
              <Bolt size={20} /> Casual
            </TabsTrigger>
            <TabsTrigger
              value="answer-rush"
              className="flex-1 flex items-center justify-center gap-2 px-8 text-lg"
            >
              <Hourglass size={20} /> Answer Rush
            </TabsTrigger>
          </TabsList>

          <TabsContent value="casual" className="w-full mt-5">
            <CasualSettings />
          </TabsContent>

          <TabsContent value="answer-rush" className="w-full mt-8">
            <AnswerRushSettings />
          </TabsContent>
        </Tabs>
      </div>
      <Outlet />
    </PageLayout>
  );
};

export default PracticePage;
