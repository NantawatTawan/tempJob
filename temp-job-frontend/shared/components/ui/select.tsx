import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: SelectOption[];
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  size?: "default" | "sm" | "lg";
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      label,
      error,
      icon,
      size = "default",
      placeholder,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-8 text-xs px-2",
      default: "h-10 text-sm px-3",
      lg: "h-12 text-base px-4",
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <select
            className={cn(
              "appearance-none w-full rounded-md border border-gray-300 bg-white py-2 pr-8 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[size],
              icon && "pl-10",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled={props.required}>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
