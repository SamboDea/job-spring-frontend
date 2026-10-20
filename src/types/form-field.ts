import { CheckboxProps, SelectProps, SxProps, TextFieldProps, Theme } from "@mui/material";
import { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { DateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";
import { ReactNode } from "react";

export type CheckboxFormProps = CheckboxProps & {
    name: string;
    label: ReactNode;
};

export type DateFieldProps = Omit<DatePickerProps, "value" | "onChange"> & {
    name: string;
};

export type DateTimeFieldProps = Omit<DateTimePickerProps, "value" | "onChange"> & {
    name: string;
};

export type PasswordFieldProps = Omit<TextFieldProps, "type"> & {
    name: string;
};

export type RichTextFieldProps = {
    name: string;
    label?: string;
    placeholder?: string;
    minHeight?: number;
};

export type SelectFieldProps = Omit<SelectProps, "name"> & {
    name: string;
    label: string;
    options: string[];
};

export type TextFormFieldProps = TextFieldProps & {
    name: string;
};

export type AutocompleteFieldProps = SingleProps | MultiProps;

export type SingleProps = {
    name: string;
    label: string;
    options: string[];
    multiple?: false;
    freeSolo?: boolean;
    size?: "small" | "medium";
    sx?: SxProps<Theme>;
    onValueChange?: (value: string, setFieldValue: (name: string, value: unknown) => void) => void;
};

export type MultiProps = {
    name: string;
    label: string;
    options: string[];
    multiple: true;
    freeSolo?: boolean;
    size?: "small" | "medium";
    sx?: SxProps<Theme>;
    onValueChange?: (value: string, setFieldValue: (name: string, value: unknown) => void) => void;
};