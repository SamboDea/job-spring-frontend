// app/(dashboard)/layout.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import Sidebar from "@/src/components/dashboard/layout/Sidebar";
import DashboardHeader from "@/src/components/dashboard/layout/DashboardHeader";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) redirect("/login");

    const { role } = session.user;

    if (role !== "admin" && role !== "employer") redirect("/");

    return (
        <div className="flex h-dvh overflow-hidden bg-[#f5f5f9]">
            <aside className="hidden w-72 shrink-0 overflow-y-auto bg-white lg:block">
                <Sidebar role={role} />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-0 md:p-5">
                <DashboardHeader user={session.user} role={role} />

                <main className="flex-1 p-4 md:mt-5 md:p-0">{children}</main>
            </div>
        </div>
    );
}