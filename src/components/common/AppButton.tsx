"use client";

import { Button, type ButtonProps } from "@mui/material";
import Loading from "./AppLoading";

interface AppButtonProps extends ButtonProps {
    loading?: boolean;
    loadingText?: string;
    bgColor?: string;
}

export default function AppButton({
    loading = false,
    loadingText = "Loading...",
    children,
    disabled,
    bgColor = "#E8FADF",
    sx,
    ...props
}: AppButtonProps) {
    return (
        <Button
            {...props}
            disabled={disabled || loading}
            type="submit"
            onClick={props.onClick}
            sx={{
                height: 46,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "#82E14F",

                backgroundColor: bgColor,

                boxShadow: `0 4px 12px ${bgColor}33`,

                "&:hover": {
                    backgroundColor: bgColor,
                    boxShadow: `0 6px 16px ${bgColor}4D`,
                },

                "&.Mui-disabled": {
                    color: "#ffffff",
                    backgroundColor: bgColor,
                    opacity: 0.6,
                },

                ...sx,
            }}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <Loading
                        size="sm"
                        color="#ffffff"
                    />

                    {loadingText}
                </span>
            ) : (
                children
            )}
        </Button>
    );
}