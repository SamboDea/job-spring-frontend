"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { encodeUserId } from "@/src/lib/utils";

export default function AccountPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && session?.user?.id) {
            router.replace(`/account/${encodeUserId(session.user.id)}`);
        }
    }, [isPending, session, router]);

    return (
        <div className="p-6">
            <p className="text-zinc-500 text-sm">Loading account...</p>
        </div>
    );
}