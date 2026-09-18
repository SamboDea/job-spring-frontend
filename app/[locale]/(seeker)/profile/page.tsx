"use client";

import ProfileAvatarUpload from "@/src/features/candidate/components/ProfileAvatarUpload"
import { authClient } from "@/src/lib/auth-client";
import { PersonalInformationSection } from "@/src/features/candidate/components/PersonalInformationSection";
import { WorkExperienceSection } from "@/src/features/candidate/components/WorkExperienceSection";
import { LoadingOverlay } from "@/src/components/common/LoadingOverlay";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    return (
        <>
            <LoadingOverlay show={isPending} />
            <div className="w-full">
                <ProfileAvatarUpload initialImageUrl={session?.user?.image} />
                <PersonalInformationSection />
                <div className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <WorkExperienceSection />
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