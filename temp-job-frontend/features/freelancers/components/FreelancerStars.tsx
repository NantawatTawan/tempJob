import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FreelancerStarsProps {
  rating: number;
  showCount?: boolean;
  count?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-6 w-6"
};

export const FreelancerStars = ({
  rating,
  showCount = false,
  count = 0,
  size = "md",
  className
}: FreelancerStarsProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeMap[size],
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-sm text-gray-600 ml-1">
          ({count} รีวิว)
        </span>
      )}
    </div>
  );
}; 