import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/types";

type UserAvatarProps = {
  user: User;
  className?: string;
};

const UserAvatar = ({
  user: { username, avatar, isOnline },
  className,
}: UserAvatarProps) => {
  return (
    <div className="relative inline-block">
      <Avatar
        className={cn(
          "size-15 border-3",
          `${isOnline ? "border-green-500" : "border-red-500"}`,
          className
        )}
      >
        {" "}
        {/* Adjust size */}
        <AvatarImage className="object-cover" src={avatar} />
        <AvatarFallback className="text-3xl bg-gray-600">
          {username.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserAvatar;
