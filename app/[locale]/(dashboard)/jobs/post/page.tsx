import JobPostForm from "@/src/features/jobs/components/JobPostForm";

export const metadata = {
    title: "Post a Job | JobSpring",
    description: "Create and publish a new job listing on JobSpring.",
};

export default function PostJobPage() {
    return (
        <div className="mx-auto p-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Post a New Job
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-6">
                Fill in the details below to publish a job listing.
            </p>

            <JobPostForm />
        </div>
    );
}