import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0, 100], onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState<number[]>(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value);
      const newValue = [Math.min(newMin, localValue[1]), localValue[1]];
      setLocalValue(newValue);
      onValueChange?.(newValue);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value);
      const newValue = [localValue[0], Math.max(newMax, localValue[0])];
      setLocalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <div className={cn("relative flex items-center space-x-4", className)}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f7931e]"
          ref={ref}
          {...props}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f7931e]"
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };

