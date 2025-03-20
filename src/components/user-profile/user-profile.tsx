import { User } from "@/lib/types";
import PageLayout from "../page-layout";
import MainProfile from "./main-profile";
import Stats from "./stats";
import FriendsList from "./friends-list";

type UserProfileProps = {
  user: User;
  initialFriends?: User[];
};

const UserProfile = ({ user, initialFriends = [] }: UserProfileProps) => {
  return (
    <PageLayout>
      <MainProfile user={user} />

      <Stats user={user} />

      <FriendsList user={user} initialData={initialFriends} />
    </PageLayout>
  );
};

export default UserProfile;
