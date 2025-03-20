import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

type PageHeaderProps = {
  title: string;
  returnTo?: string;
  previous?: boolean;
  className?: string;
};

const PageHeader = ({
  title,
  returnTo,
  className = "",
  previous,
}: PageHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header
      className={cn(
        "w-full px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md shadow-sm",
        className
      )}
    >
      {previous ? (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="size-6" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            {title}
          </h1>
        </button>
      ) : returnTo !== undefined ? (
        <Link className="flex items-center gap-2" to={returnTo}>
          <ArrowLeft className="size-6" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            {title}
          </h1>
        </Link>
      ) : (
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          {title}
        </h1>
      )}
    </header>
  );
};

export default PageHeader;
