"use client";

import ProfileAvatarUpload from "@/src/features/candidate/components/ProfileAvatarUpload";
import { authClient } from "@/src/lib/auth-client";
import { PersonalInformationSection } from "@/src/features/candidate/components/PersonalInformationSection";
import WorkExperienceSection from "@/src/features/candidate/components/WorkExperienceSection";
import EducationSection from "@/src/features/candidate/components/EducationSection";
import SkillSection from "@/src/features/candidate/components/SkillSection";
import AchievementSection from "@/src/features/candidate/components/AchievementSection";
import useCandidate from "@/src/features/candidate/useCandidate";
import LanguageSection from "@/src/features/candidate/components/LanguageSection";
import ReferenceSection from "@/src/features/candidate/components/ReferenceSection";

export default function ProfilePage() {
    const { data: session } = authClient.useSession();
    const { current } = useCandidate();
    const candidateId = current?.candidateId;

    const userId = typeof session?.user?.id === "string"
        ? session.user.id
        : undefined;

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="bg-white rounded-2xl border border-white overflow-hidden">
                    <div className="h-32 bg-[#2BCDEF]" />
                    <div className="pt-0 relative">
                        <div className="px-6 flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-8 gap-4">
                            <div className="ring-4 ring-white rounded-full bg-white">
                                <ProfileAvatarUpload />
                            </div>
                        </div>
                        <PersonalInformationSection userId={userId} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-6 space-y-6">
                        <section>
                            <SkillSection />
                        </section>
                    </div>
                    <div className="lg:col-span-6 space-y-6">
                        <section>
                            <ReferenceSection />
                        </section>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-6 space-y-6">
                        <section>
                            <LanguageSection />
                        </section>
                    </div>
                    <div className="lg:col-span-6 space-y-6">
                        <section>
                            <AchievementSection />
                        </section>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-6 space-y-6">
                        <section>
                            <WorkExperienceSection candidateId={candidateId} />
                        </section>
                    </div>
                    <div className="lg:col-span-6 space-y-6">
                        <section>
                            <EducationSection />
                        </section>
                    </div>
                </div>
            </div>
        </div >
    );
}