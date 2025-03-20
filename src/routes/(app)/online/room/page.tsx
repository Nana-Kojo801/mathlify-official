import PageHeader from "@/components/page-header";
import Stats from "./_components/stats";
import GameSettings from "./_components/game-settings";
import RoomSettings from "./_components/room-settings";
import { useOutletContext } from "react-router";
import { OutletContext } from "./_types";

const RoomPage = () => {
  const { room } = useOutletContext<OutletContext>()
  return (
    <>
      <PageHeader title="Room" returnTo="/app/online" />

      <div className="flex flex-col p-4 gap-10">
        <Stats room={room} />
        <RoomSettings room={room} />
        <GameSettings room={room} />
      </div>
    </>
  );
};

export default RoomPage