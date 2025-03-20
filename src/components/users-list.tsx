import { User } from "@/lib/types";
import React from "react";
import UserAvatar from "./user-avatar";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

type UserListProps = {
  children?: React.ReactNode;
  list: User[];
  actions?: (user: User) => React.JSX.Element;
  fallback?: () => React.JSX.Element;
  className?: string;
  render?: (user: User) => React.JSX.Element;
};

const UserList = ({
  list,
  actions,
  children,
  fallback,
  className,
  render,
}: UserListProps) => {
  if (list.length === 0) {
    if (fallback) return fallback();
  }
  return (
    <div className="space-y-2">
      {list.map((user) =>
        render ? (
          render(user)
        ) : (
          <div
            key={user._id}
            className="flex justify-between items-center py-2 border-b border-gray-700"
          >
            <Link
              to={`/app/profile/${user._id}`}
              className="flex items-center gap-3"
            >
              <UserAvatar className={cn(className)} user={user} />
              <p className="text-base text-white">{user.username}</p>
              <p className="text-gray-400 text-sm">({user.elo.casual})</p>
            </Link>
            <div className="flex items-center gap-3">
              {actions && actions(user)}
            </div>
          </div>
        )
      )}
      {children}
    </div>
  );
};

export default UserList;
