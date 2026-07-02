import { useState } from "react";
import {
    TextField,
    InputAdornment,
    IconButton,
    TextFieldProps,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useField } from "formik";

type FormikPasswordFieldProps = Omit<TextFieldProps, "type"> & {
    name: string;
};

export default function FormikPasswordField({ name, ...props }: FormikPasswordFieldProps) {
    const [field, meta] = useField(name);
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <TextField
                {...field}
                {...props}
                fullWidth
                type={show ? "text" : "password"}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
                size="small"
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShow((prev) => !prev)}
                                    edge="end"
                                    size="small"
                                    aria-label={show ? "Hide password" : "Show password"}
                                >
                                    {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{
                    "& .MuiFormHelperText-root": {
                        position: "absolute",
                        bottom: "-24px",
                        margin: 0,
                    },
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#07c4ec" },              // default
                        "&:hover fieldset": { borderColor: "#07c4ec" },        // hover (before focus)
                        "&.Mui-focused fieldset": { borderColor: "#71dd37" },  // focused
                    },
                    "& .MuiInputLabel-root": { color: "#07c4ec" },             // default label
                    "& .MuiInputLabel-root.Mui-focused": { color: "#71dd37" }, // focused label
                }}
            />
        </div>
    );
}