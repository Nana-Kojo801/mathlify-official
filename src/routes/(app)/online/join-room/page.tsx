import PageLayout from "@/components/page-layout";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { Room } from "@/lib/types";
import { convexQuery, useConvex } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const JoinRoomPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const user = useLiveUser();
  const { data: rooms } = useQuery({
    ...convexQuery(api.rooms.searchRoom, { roomName: searchTerm }),
    gcTime: 1000 * 60,
    initialData: [],
  });
  const convex = useConvex();
  const navigate = useNavigate();

  const joinRoom = async (roomId: Room["_id"]) => {
    await convex.mutation(api.rooms.joinRoom, { roomId, userId: user._id });
    navigate(`/app/online/room/${roomId}`);
  };

  return (
    <PageLayout>
      {/* Header Section */}
      <header className="border-b border-gray-700 pb-3 mb-3 p-4">
        <div className="relative flex items-center justify-center mb-3">
          <Link to="/app/online" className="absolute left-0 text-gray-400">
            <ArrowLeft className="size-6" />
          </Link>
          <h2 className="text-lg font-semibold text-white">Join Room</h2>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search rooms..."
          className="w-full bg-gray-800 text-white px-3 py-2 rounded-md outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      {/* Rooms List */}
      <div className="p-4 space-y-3">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room._id}
              onClick={async () => {
                await joinRoom(room._id);
              }}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition"
            >
              {/* Room Name */}
              <div className="text-white font-medium">{room.name}</div>

              {/* Players Count */}
              <div className="flex items-center space-x-2 text-gray-300">
                <Users size={18} />
                <span>
                  {room.members.length}/{room.memberCount}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No rooms found.</p>
        )}
      </div>
    </PageLayout>
  );
};

export default JoinRoomPage;
