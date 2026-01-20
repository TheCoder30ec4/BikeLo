import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BackgroundComponentsProps {
  children?: ReactNode;
  className?: string;
}

export const BackgroundComponents = ({ 
  children, 
  className,
}: BackgroundComponentsProps) => {
  return (
    <div 
      className={cn("min-h-screen w-full relative", className)}
      style={{ background: 'transparent' }}
    >
      {/* Content Layer */}
      <div className="relative min-h-screen">
        {children}
      </div>
    </div>
  );
};

