import PageLayout from "@/components/page-layout";
import GameModes from "./_components/game-modes";
import EloRatings from "./_components/elo-ratings";
import FriendsList from "./_components/friends-list";
import MarathonLeaderboard from "./_components/marathon-leaderboard";

const HomePage = () => {
  return (
    <PageLayout>
      <header className="p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/images/logo.png"
            alt="Mathlify Logo"
            className="w-[40px] rounded-full"
          />
          <h2 className="text-xl font-bold">Mathlify</h2>
        </div>
      </header>
      <main className="flex-grow p-4 flex flex-col gap-6">
        <EloRatings />

        <GameModes />

        <FriendsList />

        <MarathonLeaderboard />
      </main>
    </PageLayout>
  );
};

export default HomePage;
