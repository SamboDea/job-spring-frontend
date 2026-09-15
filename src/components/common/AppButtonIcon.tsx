"use client";

import { Button, type ButtonProps } from "@mui/material";
import { ReactNode } from "react";

interface AppButtonIconProps extends ButtonProps {
    bgColor?: string;
    icon?: ReactNode;
    text?: string;
    textColor?: string;
    iconGap?: number | string;
    border?: string;
    iconSize?: number | string;
    fontSize?: number | string;
}

export default function AppButtonIcon({
    bgColor = "#71dd37",
    icon,
    text,
    textColor = "#ffffff",
    border = "none",
    iconSize = 16,
    fontSize = 16,
    iconGap = 4,
    onClick = () => { },
    sx,
    ...props
}: AppButtonIconProps) {
    return (
        <Button
            {...props}
            onClick={onClick}
            sx={{
                height: 38,
                borderRadius: "24px",
                textTransform: "none",
                border,
                padding: "0 16px",

                fontSize,

                color: textColor,
                backgroundColor: bgColor,

                boxShadow: `0 4px 12px ${ bgColor } 33`,

                "&:hover": {
                    backgroundColor: bgColor,
                    boxShadow: `0 6px 16px ${ bgColor } 4D`,
                },

                "&.Mui-disabled": {
                    color: textColor,
                    backgroundColor: bgColor,
                    opacity: 0.6,
                },

                ...sx,
            }}
        >
            <span
                className="inline-flex items-center"
                style={{
                    gap: iconGap,
                }}
            >
                {icon && (
                    <span
                        className="inline-flex items-center"
                        style={{
                            fontSize: iconSize,
                        }}
                    >
                        {icon}
                    </span>
                )}

                {text && <span>{text}</span>}
            </span>
        </Button>
    );
}

