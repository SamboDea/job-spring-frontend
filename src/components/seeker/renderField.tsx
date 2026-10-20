import {
    TextFormField,
    AutocompleteFormField,
    DateField,
    RichTextField,
    CheckBox,
} from "@/src/components/common/AppFormField";
import { EntryFieldConfig } from "@/src/types/dynamic-entry";

export function renderField(field: EntryFieldConfig, values: Record<string, any>) {
    if (field.hideWhen?.(values)) return null;
    const disabled = field.disableWhen?.(values);
    const gridClass = field.gridSpan === 2 ? "sm:col-span-2" : "";

    switch (field.type) {
        case "date":
            return (
                <div key={field.name} className={gridClass}>
                    <DateField name={field.name} label={field.label} disabled={disabled} />
                </div>
            );
        case "autocomplete":
            return (
                <div key={field.name} className={gridClass}>
                    <AutocompleteFormField
                        name={field.name}
                        label={field.label}
                        options={field.options ?? []}
                        multiple={false}
                        freeSolo={field.freeSolo}
                        onValueChange={field.onValueChange}  
                    />
                </div>
            );
        case "richtext":
            return (
                <div key={field.name} className={gridClass}>
                    <RichTextField name={field.name} label={field.label} placeholder={field.placeholder} />
                </div>
            );
        case "checkbox":
            return (
                <div key={field.name} className={gridClass}>
                    <CheckBox name={field.name} label={field.label} />
                </div>
            );
        default:
            return (
                <div key={field.name} className={gridClass}>
                    <TextFormField
                        name={field.name}
                        type={field.type === "email" ? "email" : "text"}
                        label={field.label}
                        placeholder={field.placeholder}
                        disabled={disabled}
                    />
                </div>
            );
    }
}