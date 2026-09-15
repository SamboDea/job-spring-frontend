import {
    LayoutDashboard,
    Briefcase,
    Users,
    Building2,
    UserCheck,
    Calendar,
    MessageSquare,
    Bell,
    BarChart3,
    Bookmark,
    FolderKanban,
    Tag,
    Award,
    Clock,
    TrendingUp,
    DollarSign,
    MapPin,
    Gift,
    Layers,
    UserCog,
    ShieldCheck,
    Settings,
    CreditCard,
    History,
    Key,
    Puzzle,
    User,
    Building,
    HelpCircle,
    LogOut,
    FileText,
    PlusCircle,
    FileClock,
    FileX,
    CheckCircle2,
    CalendarCheck,
    AwardIcon,
    UserX,
    ListFilter
} from "lucide-react";
import { ComponentType } from "react";

export interface MenuItemType {
    id: string;
    label: string;
    href?: string;
    icon: ComponentType<{ className?: string; size?: number }>;
    badge?: {
        text: string;
        color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
    };
    roles?: string[];
    children?: {
        id: string;
        label: string;
        href: string;
        icon?: ComponentType<{ className?: string; size?: number }>;
        badge?: {
            text: string;
            color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
        };
        roles?: string[];
    }[];
}

export interface MenuGroupType {
    id: string;
    title: string;
    items: MenuItemType[];
}

export const menuConfig: MenuGroupType[] = [
    {
        id: "main-navigation",
        title: "Main Navigation",
        items: [
            {
                id: "dashboard",
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                id: "job-posts",
                label: "Job Posts",
                icon: Briefcase,
                children: [
                    { id: "all-jobs", label: "All Jobs", href: "/jobs/list", icon: FileText },
                    { id: "post-job", label: "Post New Job", href: "/jobs/post", icon: PlusCircle },
                    // { id: "draft-jobs", label: "Draft Jobs", href: "/jobs/drafts", icon: FileClock, badge: { text: "3", color: "warning" } },
                    // { id: "expired-jobs", label: "Expired Jobs", href: "/jobs/expired", icon: FileX },
                ],
            },
            {
                id: "applications",
                label: "Applications",
                icon: FileText,
                badge: { text: "12 New", color: "primary" },
                children: [
                    { id: "all-applications", label: "All Applications", href: "/applications", icon: ListFilter },
                    { id: "shortlisted", label: "Shortlisted", href: "/applications/shortlisted", icon: CheckCircle2 },
                    { id: "interview", label: "Interview", href: "/applications/interview", icon: CalendarCheck },
                    { id: "offered", label: "Offered", href: "/applications/offered", icon: AwardIcon },
                    { id: "hired", label: "Hired", href: "/applications/hired", icon: UserCheck },
                    { id: "rejected", label: "Rejected", href: "/applications/rejected", icon: UserX },
                ],
            },
            {
                id: "candidates",
                label: "Candidates",
                href: "/candidates",
                icon: Users,
            },
            {
                id: "companies",
                label: "Companies",
                href: "/companies",
                icon: Building2,
                roles: ["admin"],
            },
            {
                id: "recruiters",
                label: "Recruiters",
                href: "/recruiters",
                icon: UserCheck,
                roles: ["admin", "employer"],
            },
            {
                id: "interviews",
                label: "Interviews",
                href: "/interviews",
                icon: Calendar,
                badge: { text: "4 Today", color: "info" },
            },
            {
                id: "messages",
                label: "Messages",
                href: "/messages",
                icon: MessageSquare,
                badge: { text: "5", color: "error" },
            },
            {
                id: "notifications",
                label: "Notifications",
                href: "/notifications",
                icon: Bell,
                badge: { text: "8", color: "primary" },
            },
            {
                id: "reports",
                label: "Reports & Analytics",
                href: "/reports",
                icon: BarChart3,
            },
            {
                id: "calendar",
                label: "Calendar",
                href: "/calendar",
                icon: Calendar,
            },
            {
                id: "saved-candidates",
                label: "Saved Candidates",
                href: "/saved-candidates",
                icon: Bookmark,
            },
            {
                id: "talent-pool",
                label: "Talent Pool",
                href: "/talent-pool",
                icon: FolderKanban,
            },
        ],
    },
    // {
    //     id: "recruitment-management",
    //     title: "Recruitment Management",
    //     items: [
    //         {
    //             id: "job-categories",
    //             label: "Job Categories",
    //             href: "/recruitment/categories",
    //             icon: Tag,
    //         },
    //         {
    //             id: "skills-management",
    //             label: "Skills Management",
    //             href: "/recruitment/skills",
    //             icon: Award,
    //         },
    //         {
    //             id: "employment-types",
    //             label: "Employment Types",
    //             href: "/recruitment/employment-types",
    //             icon: Clock,
    //         },
    //         {
    //             id: "experience-levels",
    //             label: "Experience Levels",
    //             href: "/recruitment/experience-levels",
    //             icon: TrendingUp,
    //         },
    //         {
    //             id: "salary-ranges",
    //             label: "Salary Ranges",
    //             href: "/recruitment/salary-ranges",
    //             icon: DollarSign,
    //         },
    //         {
    //             id: "locations",
    //             label: "Locations",
    //             href: "/recruitment/locations",
    //             icon: MapPin,
    //         },
    //         {
    //             id: "benefits",
    //             label: "Benefits",
    //             href: "/recruitment/benefits",
    //             icon: Gift,
    //         },
    //         {
    //             id: "departments",
    //             label: "Departments",
    //             href: "/recruitment/departments",
    //             icon: Layers,
    //         },
    //     ],
    // },
    // {
    //     id: "system-management",
    //     title: "System Management",
    //     items: [
    //         {
    //             id: "users",
    //             label: "Users",
    //             href: "/system/users",
    //             icon: UserCog,
    //             roles: ["admin"],
    //         },
    //         {
    //             id: "roles-permissions",
    //             label: "Roles & Permissions",
    //             href: "/system/roles",
    //             icon: ShieldCheck,
    //             roles: ["admin"],
    //         },
    //         {
    //             id: "settings",
    //             label: "Settings",
    //             href: "/system/settings",
    //             icon: Settings,
    //         },
    //         {
    //             id: "billing",
    //             label: "Billing & Subscription",
    //             href: "/system/billing",
    //             icon: CreditCard,
    //             roles: ["admin", "employer"],
    //         },
    //         {
    //             id: "activity-logs",
    //             label: "Activity Logs",
    //             href: "/system/logs",
    //             icon: History,
    //             roles: ["admin"],
    //         },
    //         {
    //             id: "api-keys",
    //             label: "API Keys",
    //             href: "/system/api-keys",
    //             icon: Key,
    //             roles: ["admin"],
    //         },
    //         {
    //             id: "integrations",
    //             label: "Integrations",
    //             href: "/system/integrations",
    //             icon: Puzzle,
    //         },
    //     ],
    // },
    // {
    //     id: "account",
    //     title: "Account",
    //     items: [
    //         {
    //             id: "my-profile",
    //             label: "My Profile",
    //             href: "/account/profile",
    //             icon: User,
    //         },
    //         {
    //             id: "company-profile",
    //             label: "Company Profile",
    //             href: "/account/company",
    //             icon: Building,
    //         },
    //         {
    //             id: "help-center",
    //             label: "Help Center",
    //             href: "/account/help",
    //             icon: HelpCircle,
    //         },
    //         {
    //             id: "logout",
    //             label: "Logout",
    //             href: "/login",
    //             icon: LogOut,
    //         },
    //     ],
    // },
];
