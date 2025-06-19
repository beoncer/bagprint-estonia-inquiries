import { BadgeType, BADGE_CONFIGS } from "@/lib/badge-constants";
import { cn } from "@/lib/utils";
import { Leaf, RefreshCcw, Recycle } from "lucide-react";

const ICONS = {
  LeafIcon: Leaf,
  RefreshCcwIcon: RefreshCcw,
  RecycleIcon: Recycle,
};

interface ProductBadgeProps {
  type: BadgeType;
  className?: string;
}

export const ProductBadge = ({ type, className }: ProductBadgeProps) => {
  const config = BADGE_CONFIGS[type];
  const Icon = config.icon ? ICONS[config.icon as keyof typeof ICONS] : null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
        "bg-white border",
        className
      )}
      style={{ borderColor: config.borderColor }}
    >
      {Icon && (
        <Icon
          size={16}
          style={{ color: config.borderColor }}
          className="shrink-0"
        />
      )}
      <span
        className="text-sm font-medium"
        style={{ color: config.borderColor }}
      >
        {config.label}
      </span>
    </div>
  );
}; 