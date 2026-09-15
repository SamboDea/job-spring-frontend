"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { GraduationCap } from "lucide-react";
import { AutocompleteFormField, DateField, TextFormField } from "@/src/components/common/AppFormField";
import ProfileAvatarUpload from "@/src/components/seeker/ProfileAvatarUpload";
import { authClient } from "@/src/lib/auth-client";
import { WorkExperienceSection } from "@/src/features/candidate/components/WorkExperienceSection";

interface EducationItem {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}

const emptyEducation: EducationItem = {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
};

const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    gender: Yup.string().required("Gender is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    dateOfBirth: Yup.string().required("Date of birth is required"),
    education: Yup.array().of(
        Yup.object({
            institution: Yup.string().required("Institution is required"),
            degree: Yup.string().required("Degree is required"),
            fieldOfStudy: Yup.string().required("Field of study is required"),
            startDate: Yup.string().required("Start date is required"),
            endDate: Yup.string(),
        })
    ),
});

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <div className="h-64 animate-pulse bg-gray-50 rounded-xl" />;
    }

    const initialValues = {
        name: session?.user?.name ?? "",
        gender: "",
        email: session?.user?.email ?? "",
        phone: "",
        dateOfBirth: "",
        nationality: "",
        position: "",
        maritalStatus: "",
        city: "",
        district: "",
        commune: "",
        village: "",
        education: [] as EducationItem[],
    };

    return (
        <div className="w-full">
            <ProfileAvatarUpload initialImageUrl={session?.user?.image} />

            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                <Form>
                    <div className="space-y-6 mt-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <TextFormField name="name" label="Full name" placeholder="e.g. John Doe" />
                            <AutocompleteFormField name="gender" label="Gender" options={["Male", "Female"]} multiple={false} />
                            <TextFormField name="phone" label="Phone" placeholder="e.g. 1234567890" />
                            <TextFormField name="email" type="email" label="Email" placeholder="e.g. example@example.com" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <DateField name="dateOfBirth" label="Date of birth" />
                            <AutocompleteFormField name="nationality" label="Nationality" options={["Khmer", "Kampuchea"]} multiple={false} />
                            <TextFormField name="position" label="Position" placeholder="e.g. Developer" />
                            <AutocompleteFormField name="maritalStatus" label="Marital Status" options={["Single", "Married", "Divorced", "Widowed"]} multiple={false} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <AutocompleteFormField name="city" label="City" options={["Phnom Penh", "Siem Reap", "Sihanoukville", "Battambang"]} multiple={false} />
                            <AutocompleteFormField name="district" label="District/Khan" options={["Phnom Penh", "Siem Reap", "Sihanoukville", "Battambang"]} multiple={false} />
                            <AutocompleteFormField name="commune" label="Commune/Sangkat" options={["Phnom Penh", "Siem Reap", "Sihanoukville", "Battambang"]} multiple={false} />
                            <TextFormField name="village" label="Village" placeholder="e.g. Village Name" />
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <WorkExperienceSection />
                            </div>
                            {/* <div>
                                <WorkExperienceSection />
                            </div> */}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-8 px-6 py-2.5 bg-[#07c4ec] text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-[#06b0d4] transition-colors"
                    >
                        Save Changes
                    </button>
                </Form>
            </Formik>
        </div>
    );
}