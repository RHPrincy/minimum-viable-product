// /app/components/Button.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "glass" | "danger";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    children: React.ReactNode;
    fullWidth?: boolean;
    isLoading?: boolean;
    rounded?: "none" | "sm" | "md" | "lg" | "full";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            children,
            fullWidth = false,
            isLoading = false,
            rounded = "md",
            ...props
        },
        ref
    ) => {
        const baseStyles =
            "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-300",
            secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
            outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-200",
            ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
            link: "bg-transparent text-indigo-600 hover:underline focus:ring-indigo-200",
            glass:
                "bg-white bg-opacity-20 backdrop-blur-md border border-gray-200/50 text-gray-900 hover:bg-opacity-30 focus:ring-gray-300",
            danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
        };

        const sizes = {
            xs: "h-8 px-2 text-xs",
            sm: "h-9 px-3 text-sm",
            md: "h-10 px-4 text-base",
            lg: "h-12 px-6 text-lg",
            xl: "h-14 px-8 text-xl",
        };

        const roundeds = {
            none: "rounded-none",
            sm: "rounded-sm",
            md: "rounded-md",
            lg: "rounded-lg",
            full: "rounded-full",
        };

        const widthClass = fullWidth ? "w-full" : "w-auto";
        const loadingClass = isLoading ? "relative text-transparent" : "";

        return (
            <button
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    roundeds[rounded],
                    widthClass,
                    loadingClass,
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {children}
                {isLoading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="h-5 w-5 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </span>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };