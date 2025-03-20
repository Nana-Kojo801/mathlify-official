import UserProfile from "@/components/user-profile/user-profile";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { getFriendsQuery } from "@/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

const CurrentUserProfile = () => {
  const user = useLiveUser();
  const { data: initialFriends } = useSuspenseQuery(getFriendsQuery());
  return <UserProfile user={user} initialFriends={initialFriends} />;
};

export default function CurrentUserSuspenceProfile() {
    return (
        <Suspense>
            <CurrentUserProfile />
        </Suspense>
    )
}
