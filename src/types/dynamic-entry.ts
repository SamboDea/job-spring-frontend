// types.ts

/** A single entry in a dynamic list (experience, education, etc.) */
export interface EntryListItem extends Record<string, any> {
    id: number;
}

/** Supported field types, matching the switch in renderField.tsx */
export type EntryFieldType =
    | "text"
    | "email"
    | "date"
    | "autocomplete"
    | "richtext"
    | "checkbox";

export interface EntryFieldConfig {
    /** Formik field name / key in the entry's values object */
    name: string;
    label: string;
    type: EntryFieldType;
    placeholder?: string;
    freeSolo?: boolean;

    /** Options list, used by "autocomplete" (and reusable for a future "select") */
    options?: string[];

    /** Span both grid columns on sm+ screens when true (see gridClass in renderField) */
    gridSpan?: 1 | 2;

    /** Hide this field entirely based on current live form values */
    hideWhen?: (values: Record<string, any>) => boolean;

    /** Disable (but still show) this field based on current live form values */
    disableWhen?: (values: Record<string, any>) => boolean;

    /** Callback that runs when the field value changes (for derived state like country/capital) */
    onValueChange?: (
        value: string,
        setFieldValue: (name: string, value: unknown) => void
    ) => void;
}