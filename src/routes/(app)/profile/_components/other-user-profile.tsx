import UserProfile from "@/components/user-profile/user-profile";
import { User } from "@/lib/types";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

const OtherUserProfile = ({ userId }: { userId: User["_id"] }) => {
  const { data: user } = useSuspenseQuery({
    ...convexQuery(api.users.getUser, { id: userId }),
    staleTime: 1000 * 60,
  });
  return <UserProfile user={user} />;
};

export default function OtherUserSuspenseProfile({ userId }: { userId: User["_id"] }) {
  return (
    <Suspense>
      <OtherUserProfile userId={userId} />
    </Suspense>
  );
}
