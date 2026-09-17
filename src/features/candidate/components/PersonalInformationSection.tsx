"use client";

import {
    AutocompleteFormField,
    DateField,
    RichTextField,
    TextFormField,
} from "@/src/components/common/AppFormField";
import { useTranslations } from "next-intl";
import { Formik, Form } from "formik";
import { usePersonalInfoForm } from "@/src/features/candidate/usePersonalInfoForm";
import { personalInfoValidationSchema } from "@/src/features/candidate/validation";
import { SubmitButton } from "./SubmitButton";

export function PersonalInformationSection() {
    const { initialValues, loading, submit } = usePersonalInfoForm();
    const t = useTranslations("PersonalInfo");

    if (loading) return null;

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={personalInfoValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    await submit(values);
                } catch (err) {
                    console.error("Failed to save personal information", err);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            <Form>
                <div className="space-y-6 mt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <TextFormField name="name" label={t("fullName")} placeholder="e.g. John Doe" />
                        <AutocompleteFormField name="gender" label="Gender" options={["Male", "Female"]} multiple={false} />
                        <TextFormField name="contactNumber" label="Phone" placeholder="e.g. 1234567890" />
                        <TextFormField name="email" type="email" label="Email" placeholder="e.g. example@example.com" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <DateField name="dateOfBirth" label="Date of birth" />
                        <AutocompleteFormField name="country" label="Country" options={["Khmer", "Kampuchea"]} multiple={false} />
                        <TextFormField name="jobTitle" label="Position" placeholder="e.g. Developer" />
                        <AutocompleteFormField
                            name="city"
                            label="City"
                            options={["Phnom Penh", "Siem Reap", "Sihanoukville", "Battambang"]}
                            multiple={false}
                        />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-1 gap-4">
                        <TextFormField name="address" label="Address" placeholder="e.g. 123 Main St" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <AutocompleteFormField
                            name="industry"
                            label="Industry"
                            options={["Information Technology", "Finance", "Banking", "Health"]}
                            multiple={false}
                        />
                        <TextFormField name="github" label="Github" placeholder="e.g. github/username" />
                        <TextFormField name="linkedin" label="Linkedin" placeholder="e.g. linkedin/username" />
                        <TextFormField name="portfolio" label="Portfolio" placeholder="e.g. portfolio.com" />
                    </div>
                    <div className="flex items-end justify-around gap-4">
                        <div className="flex-3">
                            <RichTextField name="description" label="Description" placeholder="Describe your self" />
                        </div>
                        <div className="flex-1 flex justify-end">
                            <SubmitButton />
                        </div>
                    </div>
                </div>
            </Form>
        </Formik>
    );
}

export default PersonalInformationSection;