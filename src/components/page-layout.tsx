import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type PageLayoutProps = PropsWithChildren & {
  className?: string;
};

const PageLayout = ({ children, className = "" }: PageLayoutProps) => {
  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {children}
    </div>
  );
};

export default PageLayout;
