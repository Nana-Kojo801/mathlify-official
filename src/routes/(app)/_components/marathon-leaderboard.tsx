// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const MarathonLeaderboard = () => {
  // const players = [
  //   { name: "PlayerA", elo: 1600, score: 1500, avatar: "/avatars/playerA.png" },
  //   { name: "PlayerB", elo: 1550, score: 1450, avatar: "/avatars/playerB.png" },
  //   { name: "PlayerC", elo: 1500, score: 1400, avatar: "/avatars/playerC.png" },
  // ];

  // // Mock user position
  // const user = {
  //   name: "You",
  //   elo: 1420,
  //   score: 1350,
  //   rank: 7,
  //   avatar: "/avatars/you.png",
  // };

  return (
    <section>
      <h3 className="text-xl font-semibold mb-3">🏆 Marathon Leaderboard</h3>
      <p>Coming soon...</p>
      {/* <div className="bg-gray-800 p-3 rounded-lg">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-gray-700 last:border-none"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={player.avatar} alt={player.name} />
                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="text-gray-300 text-base">
                #{index + 1} {player.name}{" "}
                <span className="text-gray-400">({player.elo})</span>
              </p>
            </div>

            <p className="font-bold text-yellow-400">{player.score}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-gray-800 p-3 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-gray-300 text-base">
            #{user.rank} {user.name}{" "}
            <span className="text-gray-400">({user.elo})</span>
          </p>
        </div>
        <p className="font-bold text-yellow-400">{user.score}</p>
      </div> */}
    </section>
  );
};

export default MarathonLeaderboard;
