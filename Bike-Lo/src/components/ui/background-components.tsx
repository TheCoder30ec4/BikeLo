import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Tiles } from "@/components/ui/tiles";
import { useTheme } from "@/hooks/use-theme";

interface BackgroundComponentsProps {
  children?: ReactNode;
  className?: string;
}

export const BackgroundComponents = ({
  children,
  className,
}: BackgroundComponentsProps) => {
  const { resolvedTheme } = useTheme();

  const tileHoverColor =
    resolvedTheme === "dark"
      ? "rgba(247, 147, 30, 0.2)"
      : "rgba(247, 147, 30, 0.15)";

  const glowColor = resolvedTheme === "dark" ? "oklch(0.55 0.18 260)" : "#FFF991";

  return (
    <div
      className={cn("min-h-screen w-full relative", className)}
      style={
        { "--tile-hover": tileHoverColor } as React.CSSProperties
      }
    >
      {/* ── Global Tile Grid Background (fixed, behind everything) ── */}
      <div
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
        style={{ opacity: resolvedTheme === "dark" ? 0.4 : 0.5 }}
      >
        <Tiles
          rows={50}
          cols={20}
          tileSize="md"
          className="w-full h-full"
          tileClassName={cn(
            "transition-colors duration-500",
            resolvedTheme === "dark"
              ? "border-neutral-800/35"
              : "border-neutral-300/45"
          )}
        />
      </div>

      {/* ── Global Gradient Glow Overlay (fixed, behind everything) ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top center, ${glowColor} 0%, transparent 55%),
            radial-gradient(ellipse at bottom right, ${
              resolvedTheme === "dark"
                ? "rgba(147, 51, 234, 0.12)"
                : "rgba(247, 147, 30, 0.06)"
            } 0%, transparent 50%)
          `,
          opacity: resolvedTheme === "dark" ? 0.45 : 0.7,
          mixBlendMode: resolvedTheme === "dark" ? "screen" : "multiply",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};
