"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import ProfileAvatarUpload from "@/src/components/seeker/ProfileAvatarUpload";
import { authClient } from "@/src/lib/auth-client";
import { PersonalInformationSection } from "@/src/features/candidate/components/PersonalInformationSection";
import { WorkExperienceSection } from "@/src/features/candidate/components/WorkExperienceSection";
import { EducationSection } from "@/src/features/candidate/components/EducationSection";

interface EducationItem {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}

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

    return (
        <div className="w-full">
            <ProfileAvatarUpload initialImageUrl={session?.user?.image} />
            <PersonalInformationSection />
            <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        {/* <WorkExperienceSection /> */}
                    </div>
                    <div>
                        {/* <EducationSection /> */}
                    </div>
                </div>
            </div>

        </div>
    );
}