import { SxProps, Theme } from "@mui/material";

export const FormFieldStyle: SxProps<Theme> = {
    "& .MuiFormHelperText-root": {
        position: "absolute",
        bottom: "-20px",
        margin: 0,
        color: "#ff3e1d !important",
        fontSize: "0.75rem",
        fontWeight: 500,
    },

    "& .MuiOutlinedInput-input, & .MuiPickersOutlinedInput-input, & .MuiSelect-select": {
        color: "#1e293b",
        fontSize: "0.9375rem",
    },

    "& .MuiPickersSectionList-sectionContent": {
        color: "#1e293b",
    },

    "& .MuiInputAdornment-root .MuiSvgIcon-root, & .MuiSelect-icon, & .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-popupIndicator .MuiSvgIcon-root, & .MuiAutocomplete-clearIndicator .MuiSvgIcon-root": {
        color: "#64748b !important",
        transition: "color 0.2s ease",
    },

    "& .MuiAutocomplete-root": {
        "& .MuiOutlinedInput-root": {
            minHeight: "44px",
            paddingTop: "4px",
            paddingBottom: "4px",
        },
    },

    "& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: "#fafbfc",
        transition: "background-color 0.2s ease, box-shadow 0.2s ease",

        "& fieldset, & .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#e2e8f0",
            borderWidth: "1.5px",
            transition: "border-color 0.2s ease",
        },

        "&:hover": {
            backgroundColor: "#ffffff",
        },
        "&:hover fieldset, &:hover .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#07c4ec",
            borderWidth: "1.5px",
        },

        "&.Mui-focused": {
            backgroundColor: "#ffffff",
            boxShadow: "0 0 0 4px rgba(7, 196, 236, 0.12)",
        },
        "&.Mui-focused fieldset, &.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#07c4ec !important",
            borderWidth: "1.5px",
        },
        "&.Mui-focused.Mui-error": {
            boxShadow: "0 0 0 4px rgba(255, 62, 29, 0.12)",
        },
        "&.Mui-focused.Mui-error fieldset, &.Mui-focused.Mui-error .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#ff3e1d !important",
            borderWidth: "1.5px",
        },

        "&.Mui-error:not(.Mui-focused) fieldset, &.Mui-error:not(.Mui-focused) .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#ff3e1d !important",
        },

        "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: "#07c4ec !important",
        },

        "&.Mui-error:not(.Mui-focused) .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: "#ff3e1d !important",
        },

        "&.Mui-disabled": {
            bgcolor: "rgba(7, 196, 236, 0.04)",

            "& fieldset, & .MuiPickersOutlinedInput-notchedOutline": {
                borderColor: "rgba(7, 196, 236, 0.2)",
            },

            "&:hover fieldset, &:hover .MuiPickersOutlinedInput-notchedOutline": {
                borderColor: "rgba(7, 196, 236, 0.2)",
            },
        },
    },

    "& .MuiOutlinedInput-input.Mui-disabled, & .MuiPickersOutlinedInput-input.Mui-disabled, & .MuiSelect-select.Mui-disabled": {
        WebkitTextFillColor: "#9ca3af",
        color: "#9ca3af",
        cursor: "not-allowed",
    },

    "& .Mui-disabled .MuiInputAdornment-root .MuiSvgIcon-root, & .MuiSelect-icon.Mui-disabled": {
        color: "#9ca3af !important",
    },

    "& .MuiInputLabel-root": {
        color: "#64748b",
        fontSize: "0.9375rem",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#07c4ec !important",
        fontWeight: 500,
    },

    "& .MuiInputLabel-root.Mui-error": {
        color: "#ff3e1d !important",
    },

    "& .MuiInputLabel-root.Mui-error.Mui-focused": {
        color: "#ff3e1d !important",
    },

    "& .MuiInputLabel-root.Mui-disabled": {
        color: "#9ca3af !important",
    },
};

export const DropdownMenuStyle: SxProps<Theme> = {
    borderRadius: "12px",
    marginTop: "6px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
    border: "1px solid #f1f5f9",
    overflow: "hidden",

    "& .MuiMenuItem-root": {
        color: "#475569",
        fontSize: "0.9375rem",
        padding: "10px 16px",
        transition: "background-color 0.15s ease",
        "&.Mui-selected": {
            background: "linear-gradient(135deg, rgba(7, 196, 236, 0.12), rgba(113, 221, 55, 0.12))",
            color: "#0891a8",
            fontWeight: 500,
            "&:hover": {
                background: "linear-gradient(135deg, rgba(7, 196, 236, 0.18), rgba(113, 221, 55, 0.18))",
            },
        },
        "&:hover": {
            backgroundColor: "rgba(7, 196, 236, 0.06)",
        },
    },
    "& .MuiAutocomplete-option": {
        color: "#475569",
        fontSize: "0.9375rem",
        padding: "10px 16px",
        "&[aria-selected='true']": {
            background: "linear-gradient(135deg, rgba(7, 196, 236, 0.12), rgba(113, 221, 55, 0.12)) !important",
            color: "#0891a8",
            fontWeight: 500,
        },
        "&.Mui-focused, &:hover": {
            backgroundColor: "rgba(7, 196, 236, 0.06) !important",
        },
    },
};