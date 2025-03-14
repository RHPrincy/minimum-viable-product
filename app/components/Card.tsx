// /app/components/Card.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "outline" | "elevated";
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    animate?: "none" | "fade" | "slide-up" | "scale";
    hoverEffect?: boolean;
}

const Card = ({
    className,
    variant = "default",
    padding = "md",
    animate = "none",
    hoverEffect = false,
    ...props
}: CardProps) => {
    const variants = {
        default: "bg-white text-gray-900 shadow-md",
        glass: "bg-white bg-opacity-20 backdrop-blur-lg border border-gray-200/50",
        outline: "bg-white border border-gray-300 text-gray-900",
        elevated: "bg-white text-gray-900 shadow-lg",
    };

    const paddings = {
        none: "p-0",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
    };

    const animations = {
        none: "",
        fade: "animate-fade-in",
        "slide-up": "animate-slide-up",
        scale: "animate-scale-in",
    };

    const hoverStyles = hoverEffect
        ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        : "";

    return (
        <div
            className={cn(
                "rounded-lg overflow-hidden",
                variants[variant],
                paddings[padding],
                animations[animate],
                hoverStyles,
                className
            )}
            {...props}
        />
    );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: "left" | "center" | "right";
}

const CardHeader = ({ className, align = "left", ...props }: CardHeaderProps) => {
    const alignments = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    return (
        <div
            className={cn("flex flex-col space-y-2", alignments[align], className)}
            {...props}
        />
    );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    size?: "sm" | "md" | "lg";
}

const CardTitle = ({ className, size = "md", ...props }: CardTitleProps) => {
    const sizes = {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-2xl",
    };

    return (
        <h3
            className={cn("font-semibold leading-tight text-gray-900", sizes[size], className)}
            {...props}
        />
    );
};

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    size?: "sm" | "md" | "lg";
}

const CardDescription = ({ className, size = "md", ...props }: CardDescriptionProps) => {
    const sizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };

    return (
        <p className={cn("text-gray-600", sizes[size], className)} {...props} />
    );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    gap?: "none" | "sm" | "md" | "lg";
}

const CardContent = ({ className, gap = "md", ...props }: CardContentProps) => {
    const gaps = {
        none: "space-y-0",
        sm: "space-y-2",
        md: "space-y-4",
        lg: "space-y-6",
    };

    return (
        <div className={cn("pt-4", gaps[gap], className)} {...props} />
    );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: "left" | "center" | "right";
}

const CardFooter = ({ className, align = "center", ...props }: CardFooterProps) => {
    const alignments = {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
    };

    return (
        <div
            className={cn("flex items-center pt-4", alignments[align], className)}
            {...props}
        />
    );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };