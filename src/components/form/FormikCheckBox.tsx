import {
    Checkbox,
    CheckboxProps,
    FormControl,
    FormControlLabel,
    FormHelperText,
} from "@mui/material";
import { useField } from "formik";
import { ReactNode } from "react";

type FormikCheckboxProps = CheckboxProps & {
    name: string;
    label: ReactNode;
};

export default function FormikCheckBox({ name, label, ...props }: FormikCheckboxProps) {
    const [field, meta] = useField({ name, type: "checkbox" });

    return (
        <FormControl error={meta.touched && Boolean(meta.error)}>
            <FormControlLabel
                control={
                    <Checkbox
                        {...field}
                        {...props}
                        checked={field.value}
                        size="small"
                        sx={{
                            color: "#d1d5db",
                            "&.Mui-checked": { color: "#71dd37" },
                            ...props.sx,
                        }}
                    />
                }
                label={label}
                sx={{
                    alignItems: "flex-start",
                    "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        paddingTop: "2px",
                    },
                }}
            />
            {meta.touched && meta.error && (
                <FormHelperText>{meta.error}</FormHelperText>
            )}
        </FormControl>
    );
}