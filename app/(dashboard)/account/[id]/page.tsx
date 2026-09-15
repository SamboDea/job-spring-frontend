"use client";

import { use, } from "react";
import { decodeUserId } from "@/src/lib/utils";
import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AccountDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const decryptedId = decodeUserId(id);
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const user = session?.user;

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => router.push("/sign-in"),
            },
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Account</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Manage your account profile and credentials
                </p>

                <div className="mt-6 space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-zinc-100 dark:border-zinc-800/50">
                        <span className="text-sm text-zinc-500 font-medium">Encrypted URL ID</span>
                        <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                            {id}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-zinc-100 dark:border-zinc-800/50">
                        <span className="text-sm text-zinc-500 font-medium">User ID</span>
                        <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                            {decryptedId || user?.id || "—"}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-zinc-100 dark:border-zinc-800/50">
                        <span className="text-sm text-zinc-500 font-medium">Name</span>
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                            {user?.name || "—"}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-zinc-100 dark:border-zinc-800/50">
                        <span className="text-sm text-zinc-500 font-medium">Email</span>
                        <span className="text-sm text-zinc-800 dark:text-zinc-200">
                            {user?.email || "—"}
                        </span>
                    </div>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push("/change-password")}
                        className="flex-1 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-sm text-center cursor-pointer rounded-xl transition-colors"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 px-5 py-2.5 btn-gradient text-center cursor-pointer rounded-xl font-medium text-sm text-white"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
