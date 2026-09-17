import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#07c4ec]/10 to-[#71dd37]/10">
                <ShieldAlert className="h-10 w-10 text-[#07c4ec]" strokeWidth={1.5} />
            </div>

            <h1 className="font-[Sora] text-3xl font-bold text-gray-900">
                403 — Access Denied
            </h1>
            <p className="mt-2 max-w-md text-gray-500">
                You don't have permission to view this page. If you think this
                is a mistake, contact support or sign in with a different account.
            </p>

            <div className="mt-8 flex gap-3">
                <Link
                    href="/home"
                    className="rounded-lg bg-gradient-to-r from-[#07c4ec] to-[#71dd37] px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
                >
                    Back to Home
                </Link>
                <Link
                    href="/sign-in"
                    className="rounded-lg border border-gray-200 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                    Switch Account
                </Link>
            </div>
        </div>
    );
}