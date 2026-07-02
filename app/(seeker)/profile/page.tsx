"use client";

import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "lucide-react";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        }
    }, [isPending, session, router]);

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => router.push("/login"),
            },
        });
    };

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (!session) return null;

    const { user, session: currentSession } = session;
    const expiresLabel = currentSession.expiresAt
        ? new Date(currentSession.expiresAt).toLocaleString()
        : "—";

    const rows = [
        { label: "User ID", value: user.id, mono: true },
        { label: "Email", value: user.email },
        { label: "Name", value: user.name },
        { label: "Session expires", value: expiresLabel },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-6">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-green-400 flex items-center justify-center overflow-hidden">
                        {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={user.image}
                                alt={user.name ?? "Profile"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-8 h-8 text-white" />
                        )}
                    </div>
                    <div>
                        <p className="text-xl font-semibold text-gray-800">{user.name}</p>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {rows.map((row) => (
                        <div
                            key={row.label}
                            className="flex justify-between py-3 border-b border-gray-100"
                        >
                            <span className="text-gray-500">{row.label}</span>
                            <span
                                className={`text-gray-800 ${row.mono ? "font-mono text-sm" : ""}`}
                            >
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-8 w-full px-5 py-2.5 btn-gradient text-center cursor-pointer rounded-xl"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}