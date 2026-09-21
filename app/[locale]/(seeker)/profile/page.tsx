"use client";

import ProfileAvatarUpload from "@/src/features/candidate/components/ProfileAvatarUpload"
import { authClient } from "@/src/lib/auth-client";
import { PersonalInformationSection } from "@/src/features/candidate/components/PersonalInformationSection";
import { WorkExperienceSection } from "@/src/features/candidate/components/WorkExperienceSection";
import { LoadingOverlay } from "@/src/components/common/LoadingOverlay";
import useCandidate from "@/src/features/candidate/useCandidate";
import { useEffect } from "react";
import { useAppSelector } from "@/src/redux/hooks";
import Personal from "@/src/features/candidate/components/Personal";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();

    // const candidate = useAppSelector((state: any) => state.candidate.list);
    // console.log(candidate);

    // // const { getCandidate, } = useCandidate();
    // // useEffect(() => {
    // //     getCandidate();
    // // }, []);
    return (
        <>
            <LoadingOverlay show={isPending} />
            <div className="w-full">
                <ProfileAvatarUpload initialImageUrl={session?.user?.image} />
                {/* <PersonalInformationSection /> */}
                <Personal />
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
        </>

    );
}