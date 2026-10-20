"use client";

import {
    AutocompleteFormField,
    DateField,
    RichTextField,
    TextFormField,
} from "@/src/components/common/AppFormField";

import { useTranslations } from "next-intl";
import { Formik, Form } from "formik";
import { useEffect, useMemo, useState } from "react";
import useCandidate from "@/src/features/candidate/useCandidate";
import { personalInfoValidationSchema } from "@/src/features/candidate/personal-information/validation";
import { SubmitButton } from "./SubmitButton";
import { authClient } from "@/src/lib/auth-client";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";
import Swal from "sweetalert2";

interface PersonalInformationSectionProps {
    userId: string | undefined;
}

export function PersonalInformationSection({
    userId,
}: PersonalInformationSectionProps) {
    const t = useTranslations("PersonalInfo");
    const { data: session, isPending } = authClient.useSession();

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const {
        current,
        getCandidateByUserId,
        createCandidate,
        updateCandidate,
    } = useCandidate();

    useEffect(() => {
        if (userId) {
            getCandidateByUserId(userId).catch(() => { });
        }
    }, [userId]);

    const sessionReady = mounted && !isPending;

    const initialValues = useMemo(
        () => ({
            name: sessionReady ? session?.user?.name ?? "" : "",
            gender: current?.gender ?? "",
            contactNumber: current?.contactNumber ?? "",
            email: sessionReady ? session?.user?.email ?? "" : "",
            dateOfBirth: current?.dateOfBirth ?? "",
            country: current?.country ?? "",
            jobTitle: current?.jobTitle ?? "",
            city: current?.city ?? "",
            address: current?.address ?? "",
            industry: current?.industry ?? "",
            githubUsername: current?.githubUsername ?? "",
            linkedinUsername: current?.linkedinUsername ?? "",
            portfolio: current?.portfolio ?? "",
            description: current?.description ?? "",
        }),
        [current, sessionReady, session?.user?.name, session?.user?.email]
    );

    return (
        <>
            <LoadingOverlay show={isPending} />
            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={personalInfoValidationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        if (current?.candidateId) {
                            await updateCandidate(current.candidateId, values);
                        } else {
                            await createCandidate({ ...values, userId });
                        }
                        Swal.fire({
                            title: "Success",
                            text: current?.candidateId
                                ? "Personal information updated successfully"
                                : "Personal information created successfully",
                            icon: "success",
                            timer: 2500,
                        });
                    } catch (err) {
                        console.error("Failed to save personal information", err);
                        Swal.fire({
                            title: "Error",
                            text: "Failed to save personal information",
                            icon: "error",
                        });
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                <Form>
                    <div className="space-y-6 mt-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <TextFormField
                                name="name"
                                label={t("fullName")}
                                placeholder="e.g. John Doe"
                            />

                            <AutocompleteFormField
                                name="gender"
                                label="Gender"
                                options={["Male", "Female"]}
                                multiple={false}
                            />

                            <TextFormField
                                name="contactNumber"
                                label="Phone"
                                placeholder="e.g. 1234567890"
                            />

                            <TextFormField
                                name="email"
                                type="email"
                                label="Email"
                                placeholder="e.g. example@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <DateField name="dateOfBirth" label="Date of birth" />

                            <AutocompleteFormField
                                name="country"
                                label="Country"
                                options={["Cambodia", "Thailand", "Vietnam"]}
                                multiple={false}
                            />
                            <AutocompleteFormField
                                name="city"
                                label="City"
                                options={[
                                    "Phnom Penh",
                                    "Siem Reap",
                                    "Sihanoukville",
                                    "Battambang",
                                ]}
                                multiple={false}
                            />

                            <AutocompleteFormField
                                name="industry"
                                label="Industry"
                                options={[
                                    "Information Technology",
                                    "Finance",
                                    "Banking",
                                    "Health",
                                ]}
                                multiple={false}
                            />

                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <TextFormField
                                name="address"
                                label="Address"
                                placeholder="e.g. 123 Main St"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <TextFormField
                                name="githubUsername"
                                label="Github"
                                placeholder="e.g. github/username"
                            />

                            <TextFormField
                                name="linkedinUsername"
                                label="Linkedin"
                                placeholder="e.g. linkedin/username"
                            />

                            <TextFormField
                                name="portfolio"
                                label="Portfolio"
                                placeholder="e.g. portfolio.com"
                            />
                        </div>

                        <div className="flex flex-col lg:flex-row items-end gap-4">
                            <div className="flex-1 w-full">
                                <RichTextField
                                    name="description"
                                    label="Description"
                                    placeholder="Describe yourself"
                                />
                            </div>

                            <div className="w-full lg:w-auto">
                                <SubmitButton />
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    );
}

export default PersonalInformationSection;