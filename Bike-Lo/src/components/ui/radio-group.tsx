import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {}

const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <fieldset
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
      />
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, label, id, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id || `radio-${autoId}`;
    return (
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id={inputId}
          className={cn(
            "h-4 w-4 border-primary text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };

