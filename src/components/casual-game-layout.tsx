import { cn } from "@/lib/utils";
import React from "react";

export const InnerCasualGameLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex-grow flex justify-center items-center">{children}</div>
  );
};

const CasualGameLayout = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full h-full fixed left-0 top-0 bg-background overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export default CasualGameLayout;
