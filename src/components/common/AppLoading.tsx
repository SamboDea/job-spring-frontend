"use client";

interface AppLoadingProps {
    size?: "sm" | "md" | "lg";
    color?: string;
    className?: string;
}

const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-5 w-5 border-2",
    lg: "h-8 w-8 border-[3px]",
};

export default function Loading({
    size = "md",
    color = "#71dd37",
    className = "",
}: AppLoadingProps) {
    return (
        <span
            role="status"
            aria-label="Loading"
            className={`
                inline-block
                animate-spin
                rounded-full
                border-gray-200
                border-t-[${color}]
                ${sizeMap[size]}
                ${className}
            `}
            style={{
                borderTopColor: color,
            }}
        />
    );
}