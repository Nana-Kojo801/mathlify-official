import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { useParams } from "react-router";
import PageLayout from "@/components/page-layout";
import CurrentUserSuspenceProfile from "./_components/CurrentUserProfile";
import OtherUserSuspenseProfile from "./_components/other-user-profile";
import { User } from "@/lib/types";

const ProfilePage = () => {
  const params = useParams();
  const user = useLiveUser();
  return (
    <PageLayout>
      {params.userId === user._id ? (
        <CurrentUserSuspenceProfile />
      ) : (
        <OtherUserSuspenseProfile userId={params.userId as User["_id"]} />
      )}
    </PageLayout>
  );
};

export default ProfilePage;
