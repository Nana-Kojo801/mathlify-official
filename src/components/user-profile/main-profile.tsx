import { useAuth } from "@/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { useLiveUser } from "@/lib/hooks/useLiveUser";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LogOut, Pencil } from "lucide-react";
import { Link } from "react-router";

const MainProfile = ({ user }: { user: User }) => {
  const currentUser = useLiveUser();
  const { logout } = useAuth();
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gray-800 p-4 w-full">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <UserAvatar className="size-20" user={user} />
        <h2 className="text-xl md:text-2xl font-bold text-white">
          @{user.username}
        </h2>
      </div>
      {currentUser._id === user._id && (
        <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Link
            to="/app/profile/edit"
            className={cn(
              buttonVariants(),
              "flex-1 md:flex-none text-white border-gray-600 px-4 py-3"
            )}
          >
            <Pencil className="mr-2 size-5" /> Edit Profile
          </Link>
          <Button
            onClick={logout}
            variant="destructive"
            className="flex-1 md:flex-none px-4 py-2"
          >
            <LogOut className="mr-2 size-5" /> Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default MainProfile;
