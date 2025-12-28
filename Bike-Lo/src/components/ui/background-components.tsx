import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { ReactNode } from "react";

interface BackgroundComponentsProps {
  children?: ReactNode;
  className?: string;
}

export const BackgroundComponents = ({ 
  children, 
  className 
}: BackgroundComponentsProps) => {
  const { resolvedTheme } = useTheme();

  // Light mode: Soft yellow glow (#FFF991)
  // Dark mode: Soft blue/purple glow for better contrast
  const glowColor = resolvedTheme === 'dark' 
    ? 'oklch(0.55 0.18 260)' // Soft blue-purple glow for dark mode
    : '#FFF991'; // Soft yellow glow for light mode

  return (
    <div className={cn("min-h-screen w-full relative bg-background", className)}>
      {/* Soft Glow Effect - Theme Aware */}
      <div
        className="absolute inset-0 z-0 transition-all duration-300 ease-in-out"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)
          `,
          opacity: resolvedTheme === 'dark' ? 0.25 : 0.6,
          mixBlendMode: resolvedTheme === 'dark' ? 'screen' : 'multiply',
        }}
      />
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

