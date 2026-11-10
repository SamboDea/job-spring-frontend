import {
    LayoutDashboard,
    Briefcase,
    Users,
    UserSearch,
    CalendarDays,
    FileCheck2,
    BarChart3,
    Settings,
    Building2,
    type LucideIcon,
} from "lucide-react";

export type MenuChild = {
    label: string;
    href: string;
};

export type MenuItem = {
    label: string;
    icon: LucideIcon;
    href?: string;
    children?: MenuChild[];
};

export type Role = "admin" | "employer";

export const companyMenu: MenuItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
        label: "Job Vacancies",
        icon: Briefcase,
        children: [
            { label: "All Jobs", href: "/jobs" },
            { label: "Create Job", href: "/jobs/create" },
            { label: "Drafts", href: "/jobs/drafts" },
            { label: "Closed Jobs", href: "/jobs/closed" },
        ],
    },
    {
        label: "Candidates",
        icon: Users,
        children: [
            { label: "All Candidates", href: "/candidates" },
            { label: "Saved Candidates", href: "/candidates/saved" },
        ],
    },
    { label: "Recruitment Pipeline", href: "/pipeline", icon: UserSearch },
    {
        label: "Interviews & Assessments",
        icon: CalendarDays,
        children: [
            { label: "Schedule", href: "/interviews" },
            { label: "Assessments", href: "/interviews/assessments" },
        ],
    },
    {
        label: "Offers & Onboarding",
        icon: FileCheck2,
        children: [
            { label: "Offers", href: "/offers" },
            { label: "Onboarding", href: "/offers/onboarding" },
        ],
    },
    { label: "Reports & Analytics", href: "/reports", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
];

export const adminMenu: MenuItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
        label: "Users",
        icon: Users,
        children: [
            { label: "All Users", href: "/users" },
            { label: "Job Seekers", href: "/users/job-seekers" },
            { label: "Admins", href: "/users/admins" },
        ],
    },
    {
        label: "Companies",
        icon: Building2,
        children: [
            { label: "All Companies", href: "/companies" },
            { label: "Pending Approval", href: "/companies/pending" },
        ],
    },
    { label: "Job Posts", href: "/jobs", icon: Briefcase },
    { label: "Reports & Analytics", href: "/reports", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
];

export const menuByRole: Record<Role, MenuItem[]> = {
    admin: adminMenu,
    employer: companyMenu,
};