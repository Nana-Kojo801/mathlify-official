import { cn } from "@/lib/utils";

const StatItem = ({
    label,
    value,
    className = "",
  }: {
    label: string;
    value: string | number;
    className?: string;
  }) => (
    <div
      className={cn(
        "flex flex-col items-center bg-gray-700 p-3 rounded-md",
        className
      )}
    >
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );

export default StatItem