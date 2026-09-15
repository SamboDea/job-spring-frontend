import { SxProps, Theme } from "@mui/material";

export const FormFieldStyle: SxProps<Theme> = {
    "& .MuiFormHelperText-root": {
        position: "absolute",
        bottom: "-20px",
        margin: 0,
        color: "#ff3e1d !important",
    },

    "& .MuiOutlinedInput-input, & .MuiPickersOutlinedInput-input, & .MuiSelect-select": {
        color: "#07c4ec",
    },

    "& .MuiPickersSectionList-sectionContent": {
        color: "#07c4ec",
    },

    "& .MuiInputAdornment-root .MuiSvgIcon-root, & .MuiSelect-icon, & .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-popupIndicator .MuiSvgIcon-root, & .MuiAutocomplete-clearIndicator .MuiSvgIcon-root": {
        color: "#07c4ec !important",
    },

    "& .MuiAutocomplete-root": {
        "& .MuiOutlinedInput-root": {
            minHeight: "40px",
            paddingTop: "4px",
            paddingBottom: "4px",
        },
    },

    "& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root": {
        borderRadius: "10px",
        "& fieldset, & .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#07c4ec",
            borderWidth: "1px",
        },

        "&:hover fieldset, &:hover .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#07c4ec",
            borderWidth: "1px",
        },

        "&.Mui-focused fieldset, &.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#07c4ec !important",
            borderWidth: "1px",
        },
        "&.Mui-focused.Mui-error fieldset, &.Mui-focused.Mui-error .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#07c4ec !important",
            borderWidth: "1px",
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
                borderColor: "rgba(7, 196, 236, 0.3)",
            },

            "&:hover fieldset, &:hover .MuiPickersOutlinedInput-notchedOutline": {
                borderColor: "rgba(7, 196, 236, 0.3)",
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
        color: "#07c4ec",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#07c4ec !important",
    },

    "& .MuiInputLabel-root.Mui-error": {
        color: "#ff3e1d !important",
    },

    "& .MuiInputLabel-root.Mui-error.Mui-focused": {
        color: "#07c4ec !important",
    },

    "& .MuiInputLabel-root.Mui-disabled": {
        color: "#9ca3af !important",
    },
};

export const DropdownMenuStyle: SxProps<Theme> = {
    borderRadius: "10px",
    "& .MuiMenuItem-root": {
        color: "#07c4ec",
        "&.Mui-selected": {
            backgroundColor: "rgba(7, 196, 236, 0.12)",
            color: "#07c4ec",
            "&:hover": {
                backgroundColor: "rgba(7, 196, 236, 0.2)",
            },
        },
        "&:hover": {
            backgroundColor: "rgba(7, 196, 236, 0.08)",
        },
    },
    "& .MuiAutocomplete-option": {
        color: "#07c4ec",
        "&[aria-selected='true']": {
            backgroundColor: "rgba(7, 196, 236, 0.12) !important",
            color: "#07c4ec",
        },
        "&.Mui-focused, &:hover": {
            backgroundColor: "rgba(7, 196, 236, 0.08) !important",
        },
    },
};