import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({ size = "lg", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  return (
    <div className="flex w-full h-full justify-center items-center py-8">
      <Loader2
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}