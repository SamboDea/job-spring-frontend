import {
    Autocomplete,
    Box,
    Checkbox,
    Chip,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import { AutocompleteFieldProps, CheckboxFormProps, DateFieldProps, DateTimeFieldProps, PasswordFieldProps, RichTextFieldProps, SelectFieldProps, TextFormFieldProps } from "@/src/types/form-field";
import { useEffect, useState } from "react";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { DropdownMenuStyle, FormFieldStyle } from "./FromFiledStyle";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

const COLORS = {
    border: '#e2e8f0',
    focus: '#07c4ec',
    error: '#ff3e1d',
};

interface PasswordStrengthProps {
    password: string;
}

const CHECKS = [
    { label: "8+ characters", test: (p: string) => p.length >= 8 },
    { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Number", test: (p: string) => /[0-9]/.test(p) },
];

const COLORSPASSWORD = ["#ef4444", "#f59e0b", "#71dd37"];
const LABELS = ["Weak", "Fair", "Strong"];

function toLocalDateString(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toLocalIsoString(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    );
}

export function CheckBox({ name, label, ...props }: CheckboxFormProps) {
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
                    alignItems: "flex-start item-center",
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

export function DateField({ name, sx, ...props }: DateFieldProps) {
    const [field, meta, helpers] = useField(name);
    const [isFocused, setIsFocused] = useState(false);

    const hasError = meta.touched && Boolean(meta.error);
    const iconColor = hasError ? "#ff3e1d" : isFocused ? "#07c4ec" : "#07c4ec";

    return (
        <DatePicker
            {...props}
            value={field.value ? new Date(field.value) : null}
            onChange={(date) => helpers.setValue(date ? toLocalDateString(date) : null)}
            onClose={() => helpers.setTouched(true)}
            slotProps={{
                textField: {
                    fullWidth: true,
                    size: "small",
                    onFocus: () => setIsFocused(true),
                    onBlur: () => {
                        setIsFocused(false);
                        helpers.setTouched(true);
                    },
                    error: hasError,
                    helperText: meta.touched && meta.error,
                    sx: [FormFieldStyle, ...(Array.isArray(sx) ? sx : [sx])],
                },
                openPickerButton: {
                    sx: {
                        color: iconColor,
                    },
                },
            }}
        />
    );
}

export function DateTimeField({ name, sx, ...props }: DateTimeFieldProps) {
    const [field, meta, helpers] = useField(name);
    const [isFocused, setIsFocused] = useState(false);

    const hasError = meta.touched && Boolean(meta.error);
    const iconColor = hasError ? "#ff3e1d" : isFocused ? "#07c4ec" : "#07c4ec";

    return (
        <DateTimePicker
            {...props}
            value={field.value ? new Date(field.value) : null}
            onChange={(date) => helpers.setValue(date ? toLocalIsoString(date) : null)}
            onClose={() => helpers.setTouched(true)}
            slotProps={{
                textField: {
                    fullWidth: true,
                    size: "small",
                    onFocus: () => setIsFocused(true),
                    onBlur: () => {
                        setIsFocused(false);
                        helpers.setTouched(true);
                    },
                    error: hasError,
                    helperText: meta.touched && meta.error,
                    sx: [FormFieldStyle, ...(Array.isArray(sx) ? sx : [sx])],
                },
                openPickerButton: {
                    sx: {
                        color: iconColor,
                    },
                },
            }}
        />
    );
}

export function PasswordField({ name, sx, ...props }: PasswordFieldProps) {
    const [field, meta] = useField(name);
    const [show, setShow] = useState(false);

    return (
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
            sx={[FormFieldStyle, ...(Array.isArray(sx) ? sx : [sx])]}
        />
    );
}

export function RichTextField({
    name,
    label,
    placeholder,
    minHeight = 120,
}: RichTextFieldProps) {
    const [field, meta, helpers] = useField(name);
    const hasError = meta.touched && Boolean(meta.error);

    const editor = useEditor({
        extensions: [StarterKit, Placeholder.configure({ placeholder })],
        content: field.value || '',
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            helpers.setValue(editor.getHTML());
        },
        onBlur: () => {
            helpers.setTouched(true);
        },
        editorProps: {
            attributes: {
                class: 'rich-text-editor-content',
            },
        },
    });

    const outlineColor = hasError ? COLORS.error : COLORS.border;

    useEffect(() => {
        if (!editor) return;
        // Don't stomp on the user's cursor while they're actively editing
        if (editor.isFocused) return;
        if (field.value !== editor.getHTML()) {
            editor.commands.setContent(field.value || '', { emitUpdate: false });
        }
    }, [field.value, editor]);

    const toolbarButtons = [
        { key: 'bold', label: 'Bold', icon: <FormatBoldIcon fontSize="small" />, action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
        { key: 'italic', label: 'Italic', icon: <FormatItalicIcon fontSize="small" />, action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
        { key: 'bulletList', label: 'Bullet list', icon: <FormatListBulletedIcon fontSize="small" />, action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList') },
        { key: 'orderedList', label: 'Numbered list', icon: <FormatListNumberedIcon fontSize="small" />, action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList') },
    ];

    return (
        <Box sx={{ position: "relative" }}>
            {label && (
                <InputLabel
                    shrink
                    sx={{
                        fontSize: 18,
                        color: '#1e293b',
                    }}
                >
                    {label}
                </InputLabel>
            )}

            <Box
                sx={{
                    border: "1px solid",
                    borderColor: outlineColor,
                    borderRadius: "8px",
                    bgcolor: "#FAFBFC",
                    transition: "border-color 0.15s ease",
                    "&:hover": {
                        borderColor: outlineColor,
                    },
                    "&:focus-within": {
                        borderColor: hasError ? COLORS.error : COLORS.focus,
                    },
                }}
            >
                <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        px: 0.5,
                        py: 0.5,
                    }}
                >
                    {toolbarButtons.map((btn) => (
                        <IconButton
                            key={btn.key}
                            aria-label={btn.label}
                            size="small"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={btn.action}
                            sx={{
                                color: btn.active ? "#2563eb" : "#1e293b",
                            }}
                        >
                            {btn.icon}
                        </IconButton>
                    ))}
                </Stack>

                <Box
                    sx={{
                        px: 1.5,
                        py: 1,
                        minHeight,
                        fontSize: 14,
                        color: "#1e293b",
                        "& .rich-text-editor-content": {
                            outline: "none",
                        },
                        "& .ProseMirror p.is-editor-empty:first-of-type::before": {
                            content: "attr(data-placeholder)",
                            color: "text.disabled",
                            float: "left",
                            height: 0,
                            pointerEvents: "none",
                        },
                        "& ul": {
                            listStyleType: "disc",
                            paddingLeft: "1.25rem",
                            margin: 0,
                        },
                        "& ol": {
                            listStyleType: "decimal",
                            paddingLeft: "1.25rem",
                            margin: 0,
                        },
                        "& li": {
                            display: "list-item",
                        },
                        "& li p": {
                            margin: 0,
                        },
                        "& p": {
                            margin: 0,
                        },
                    }}
                >
                    <EditorContent editor={editor} />
                </Box>
            </Box>

            {hasError && (
                <FormHelperText
                    error
                    sx={{ position: 'absolute', bottom: '-22px', margin: 0 }}
                >
                    {meta.error}
                </FormHelperText>
            )}
        </Box>
    );
}

export function SelectField({ name, label, options, sx, ...props }: SelectFieldProps) {
    const [field, meta, helpers] = useField(name);
    const hasError = !!(meta.touched && meta.error);

    return (
        <FormControl fullWidth error={hasError} size="small" sx={[FormFieldStyle, ...(Array.isArray(sx) ? sx : [sx])]}>
            <InputLabel>{label}</InputLabel>
            <Select
                {...props}
                label={label}
                value={field.value ?? ""}
                onChange={(e: SelectChangeEvent<unknown>) => helpers.setValue(e.target.value)}
                onBlur={() => helpers.setTouched(true)}
                MenuProps={{
                    slotProps: {
                        paper: {
                            sx: DropdownMenuStyle,
                        },
                    },
                }}
            >
                {options.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
            </Select>
            {hasError && <FormHelperText>{meta.error}</FormHelperText>}
        </FormControl>
    );
}

export function TextFormField({ name, sx, ...props }: TextFormFieldProps) {
    const [field, meta] = useField(name);

    return (
        <TextField
            {...field}
            {...props}
            fullWidth
            suppressHydrationWarning
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
            autoComplete="off"
            size="small"
            sx={[FormFieldStyle, ...(Array.isArray(sx) ? sx : [sx])]}
        />
    );
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    if (!password) return null;

    const checks = CHECKS.map((c) => ({ label: c.label, pass: c.test(password) }));
    const strength = checks.filter((c) => c.pass).length;

    return (
        <div className="space-y-2">
            <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: i < strength ? COLORSPASSWORD[strength - 1] : "#e5e7eb",
                        }}
                    />
                ))}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-3">
                    {checks.map((c) => (
                        <span
                            key={c.label}
                            className="text-xs flex items-center gap-1 transition-colors duration-200"
                            style={{ color: c.pass ? "#71dd37" : "#9ca3af" }}
                        >
                            <span>{c.pass ? "✓" : "○"}</span>
                            {c.label}
                        </span>
                    ))}
                </div>
                {strength > 0 && (
                    <span className="text-xs font-semibold" style={{ color: COLORSPASSWORD[strength - 1] }}>
                        {LABELS[strength - 1]}
                    </span>
                )}
            </div>
        </div>
    );
}

export function AutocompleteFormField(props: AutocompleteFieldProps) {
    const { name, label, options, multiple, freeSolo = false, size = "small", sx, onValueChange } = props; // <-- added onValueChange
    const [field, meta] = useField(name);
    const { setFieldValue, setFieldTouched } = useFormikContext();

    const mergedSx = [FormFieldStyle, ...(Array.isArray(sx) ? sx : [sx])];

    if (multiple) {
        return (
            <Autocomplete
                multiple
                freeSolo={freeSolo}
                options={options}
                size={size}
                fullWidth
                value={field.value ?? []}
                onChange={(_, newValue) => {
                    setFieldValue(name, newValue);
                }}
                onBlur={() => {
                    setFieldTouched(name, true);
                }}
                sx={mergedSx}
                slotProps={{
                    paper: {
                        sx: DropdownMenuStyle,
                    },
                }}
                renderValue={(value, getItemProps) =>
                    value.map((option, index) => {
                        const { key, ...itemProps } = getItemProps({ index });
                        return <Chip sx={{ bgcolor: "#E8FADF", color: "#82E14F", fontSize: "1" }} key={key} label={option} size="small" {...itemProps} />;
                    })
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched && meta.error}
                    />
                )}
            />
        );
    }

    return (
        <Autocomplete
            freeSolo={freeSolo}
            autoSelect={freeSolo}
            options={options}
            size={size}
            fullWidth
            value={field.value ?? null}
            onChange={(_, newValue) => {
                setFieldValue(name, newValue);
                onValueChange?.((newValue as string) ?? "", setFieldValue);
            }}
            onBlur={() => {
                setFieldTouched(name, true);
            }}
            sx={mergedSx}
            slotProps={{
                paper: {
                    sx: DropdownMenuStyle,
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                />
            )}
        />
    );
}