import CasualGame from "@/components/casual-game/casual-game";
import CasualGameLayout, {
  InnerCasualGameLayout,
} from "@/components/casual-game-layout";

const CasualPracticePlayPage = () => {
  return (
    <CasualGameLayout className="flex flex-col">
      <InnerCasualGameLayout>
        <CasualGame quitTo="/app/practice" />
      </InnerCasualGameLayout>
    </CasualGameLayout>
  );
};

export default CasualPracticePlayPage;
