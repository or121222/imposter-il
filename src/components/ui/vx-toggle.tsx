import * as React from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface VxToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  size?: "sm" | "md";
}

const SIZE_STYLES = {
  sm: {
    wrap: "w-[78px] h-9",
    btn: "h-7 w-7",
    icon: "h-4 w-4",
  },
  md: {
    wrap: "w-[86px] h-10",
    btn: "h-8 w-8",
    icon: "h-4 w-4",
  },
} as const;

export function VxToggle({
  value,
  onValueChange,
  disabled,
  className,
  size = "md",
  "aria-label": ariaLabel = "Toggle",
}: VxToggleProps) {
  const styles = SIZE_STYLES[size];

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/20 p-1 backdrop-blur-sm",
        styles.wrap,
        disabled && "opacity-50",
        className,
      )}
    >
      <button
        type="button"
        disabled={disabled}
        aria-pressed={value}
        onClick={() => onValueChange(true)}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          styles.btn,
          value
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted/30",
        )}
      >
        <Check className={styles.icon} />
      </button>

      <button
        type="button"
        disabled={disabled}
        aria-pressed={!value}
        onClick={() => onValueChange(false)}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          styles.btn,
          !value
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted/30",
        )}
      >
        <X className={styles.icon} />
      </button>
    </div>
  );
}
