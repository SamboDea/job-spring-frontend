// app/(dashboard)/jobs/list/page.tsx
import { fetchJobPostsAction } from "@/src/actions/jobPost";
import JobListTable from "@/src/features/jobs/components/JobListTable";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export const metadata = {
    title: "Job Listings | JobSpring",
    description: "View, manage, edit and delete all your job postings.",
};

export const dynamic = "force-dynamic";

export default async function JobListPage() {
    const { data: posts, error } = await fetchJobPostsAction();

    return (
        <div className="space-y-5">
            {error && (
                <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Table */}
            <JobListTable initialPosts={posts} />
        </div>
    );
}