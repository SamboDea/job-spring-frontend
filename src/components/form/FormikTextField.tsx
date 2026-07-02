import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";

type FormikTextFieldProps = TextFieldProps & {
    name: string;
};

export default function FormikTextField({ name, ...props }: FormikTextFieldProps) {
    const [field, meta] = useField(name);

    return (
        <TextField
            {...field}
            {...props}
            fullWidth
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
            size="small"
            sx={{
                "& .MuiFormHelperText-root": {
                    position: "absolute",
                    bottom: "-24px",
                    margin: "0",
                },
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "#07c4ec" },              // default
                    "&:hover fieldset": { borderColor: "#07c4ec" },        // hover (before focus)
                    "&.Mui-focused fieldset": { borderColor: "#71dd37" },  // focused
                },
                "& .MuiInputLabel-root": { color: "#07c4ec" },             // default label
                "& .MuiInputLabel-root.Mui-focused": { color: "#71dd37" },
                ...props.sx,
            }}
        />
    );
}