import { fetchPublicJobPostsAction } from "@/src/actions/jobPost";
import JobsPageClient from "@/src/features/jobs/components/JobsPageClient";
import { JobCardSkeleton } from "@/src/components/jobs/JobCard";
import { Suspense } from "react";

export const metadata = {
    title: "Browse Jobs | JobSpring",
    description: "Find your next opportunity. Browse and filter hundreds of verified job listings on JobSpring.",
};

export const dynamic = "force-dynamic";

async function JobsContent() {
    const { data: jobs, error } = await fetchPublicJobPostsAction();

    if (error) {
        return (
            <div className="flex items-center justify-center py-24 text-sm text-slate-400">
                {error}
            </div>
        );
    }

    return <JobsPageClient jobs={jobs} totalCount={jobs.length} />;
}

export default function JobsPage() {
    return (
        <Suspense
            fallback={
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="h-8 w-48 rounded-xl bg-slate-100 animate-pulse mb-8" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <JobCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            }
        >
            <JobsContent />
        </Suspense>
    );
}
