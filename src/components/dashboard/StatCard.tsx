import type { LucideIcon } from "lucide-react";

const VARIANTS = {
    cyan: { iconBg: "bg-[#07c4ec]/15", icon: "text-[#07c4ec]", value: "text-[#07c4ec]" },
    green: { iconBg: "bg-[#71dd37]/20", icon: "text-[#71dd37]", value: "text-[#71dd37]" },
    red: { iconBg: "bg-red-100", icon: "text-red-400", value: "text-red-400" },
    yellow: { iconBg: "bg-amber-100", icon: "text-amber-500", value: "text-amber-500" },
    purple: { iconBg: "bg-[#696CFF]/15", icon: "text-[#696CFF]", value: "text-[#696CFF]" },
} as const;

export type StatVariant = keyof typeof VARIANTS;

type Props = {
    icon: LucideIcon;
    label: string;
    value: number | string;
    caption: string;
    variant?: StatVariant;
};

export default function StatCard({
    icon: Icon,
    label,
    value,
    caption,
    variant = "cyan",
}: Props) {
    const c = VARIANTS[variant];

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.iconBg}`}>
                <Icon className={`h-6 w-6 ${c.icon}`} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-gray-900">{label}</h3>

            <p className={`mt-3 text-5xl font-extrabold leading-none ${c.value}`}>
                {typeof value === "number" ? value.toLocaleString() : value}
            </p>

            <p className="mt-5 text-sm text-gray-700">{caption}</p>
        </div>
    );
}