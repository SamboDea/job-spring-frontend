import { Home, Building, Users, FileText, Calendar, TrendingUp, Settings } from "lucide-react";

export const sidebar = [
    {
        title: "Dashboard",
        icon: Home,
        href: "/dashboard",
        roles: ["admin", "employer"],
    },
    {
        title: "Manage Companies",
        icon: Building,
        href: "/dashboard/companies",
        roles: ["admin"],
    },
    {
        title: "Job Posts",
        icon: FileText,
        href: "/dashboard/jobs",
        roles: ["admin", "employer"],
        children: [
            { title: "All Jobs", href: "/dashboard/jobs" },
            { title: "Post New Job", href: "/dashboard/jobs/new" },
        ],
    },
    {
        title: "Applications",
        icon: Users,
        href: "/dashboard/applications",
        roles: ["admin", "employer"],
    },
    {
        title: "Interviews",
        icon: Calendar,
        href: "/dashboard/interviews",
        roles: ["admin", "employer"],
    },
    {
        title: "Statistics",
        icon: TrendingUp,
        href: "/dashboard/statistics",
        roles: ["admin", "employer"],
    },
    {
        title: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
        roles: ["admin", "employer"],
    },
];