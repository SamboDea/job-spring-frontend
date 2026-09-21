"use client";

import { AutocompleteFormField, DateField, RichTextField, TextFormField } from "@/src/components/common/AppFormField";
import { SubmitButton } from "@/src/features/candidate/components/SubmitButton";
import { Form, Formik, FormikHelpers } from "formik";
import { personalInfoValidationSchema } from "../personal-information/validation";
import useCandidate from "../useCandidate";
import { authClient } from "@/src/lib/auth-client";
import { Candidate } from "../slice";
import Swal from "sweetalert2";
import { title } from "process";

export default function Personal() {
    const { data: session } = authClient.useSession();
    const { createCandidate } = useCandidate();

    const handleFormikSubmit = async (
        values: PersonalValues,
        { setSubmitting, resetForm }: FormikHelpers<PersonalValues>
    ) => {
        try {
            if (!session?.user?.id) throw new Error("Not signed in");

            const payload = toPayload(values, session.user.id);
            console.log("Submitting API Payload:", JSON.stringify(payload, null, 2));

            await createCandidate(payload);
            resetForm();
            Swal.fire({
                icon: "success",
                title,
                text: "Candidate created successfully",
                confirmButtonColor: "#07c4ec",
            });
        } catch (err) {
            console.error("Failed to create candidate", err);
            Swal.fire({
                icon: "error",
                title,
                text: "Candidate already exists",
                confirmButtonColor: "#07c4ec",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const initialValues = {
        name: "",
        email: "",
        gender: "",
        contactNumber: "",
        dateOfBirth: "",
        country: "",
        jobTitle: "",
        jobLevelId: "",
        city: "",
        address: "",
        industry: "",
        githubUsername: "",
        linkedinUsername: "",
        portfolio: "",
        description: "",
    };

    type PersonalValues = typeof initialValues;

    const toPayload = (values: PersonalValues, userId: string): Candidate => {
        // name/email come from the session, so they aren't sent to /candidates
        const { name: _name, email: _email, jobLevelId, ...fields } = values;

        return {
            userId,
            ...(Object.fromEntries(
                Object.entries(fields).map(([key, value]) => [key, value || null])
            ) as Partial<Candidate>),
            jobLevelId: jobLevelId ? Number(jobLevelId) : null,
        };
    };

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={personalInfoValidationSchema}
            onSubmit={handleFormikSubmit}
        >
            <Form>
                <div className="space-y-6 mt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <TextFormField name="name" label="fullName" placeholder="e.g. John Doe" />
                        <AutocompleteFormField name="gender" label="Gender" options={["Male", "Female"]} multiple={false} />
                        <TextFormField name="contactNumber" label="Phone" placeholder="e.g. 1234567890" />
                        <TextFormField name="email" type="email" label="Email" placeholder="e.g. example@example.com" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <DateField name="dateOfBirth" label="Date of birth" />
                        <AutocompleteFormField name="country" label="Country" options={["Khmer", "Kampuchea", "Cambodia"]} multiple={false} />
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
                        <TextFormField name="githubUsername" label="Github" placeholder="e.g. github/username" />
                        <TextFormField name="linkedinUsername" label="Linkedin" placeholder="e.g. linkedin/username" />
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