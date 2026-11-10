"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { menuByRole, type MenuChild, type Role } from "@/src/constants/menu";
import Logo from "@/public/logo/logo.png";

const LOCALES = ["en", "km"];

type Props = {
    role: Role;
    onNavigate?: () => void;
};

const COLORS = {
    idle: "bg-[#e7e7ff] text-[#696CFF] hover:bg-[#dcdcff]",
    active: "bg-[#696CFF] text-white shadow-sm",
    parentActive: "bg-[#bebeeb] text-[#696CFF]",
    childIdle: "text-[#696CFF] hover:bg-[#e7e7ff]",
    childLine: "border-[#e7e7ff]",
};

const matches = (pathname: string, href: string) =>
    href === "/dashboard"
        ? pathname === href
        : pathname === href || pathname.startsWith(`${href}/`);

const activeChildHref = (pathname: string, children: MenuChild[]) =>
    children
        .filter((c) => matches(pathname, c.href))
        .sort((a, b) => b.href.length - a.href.length)[0]?.href;

export default function Sidebar({ role, onNavigate }: Props) {
    const rawPathname = usePathname();

    const firstSegment = rawPathname.split("/")[1];
    const locale = LOCALES.includes(firstSegment) ? firstSegment : "";
    const pathname = locale
        ? rawPathname.slice(locale.length + 1) || "/"
        : rawPathname;

    const withLocale = (path: string) => (locale ? `/${locale}${path}` : path);

    const items = menuByRole[role];

    const activeParent =
        items.find((i) => i.children && activeChildHref(pathname, i.children))
            ?.label ?? null;

    const [openKey, setOpenKey] = useState<string | null>(activeParent);

    const onTopLevelPage = items.some((i) => i.href && matches(pathname, i.href));

    useEffect(() => {
        if (activeParent) setOpenKey(activeParent);
        else if (onTopLevelPage) setOpenKey(null);
    }, [pathname, activeParent, onTopLevelPage]);

    const toggle = (label: string) =>
        setOpenKey((prev) => (prev === label ? null : label));

    return (
        <nav className="flex h-full flex-col gap-3 p-4" aria-label="Dashboard">
            <Link href={withLocale("/dashboard")} onClick={onNavigate} className="mb-4 block px-2">
                <Image src={Logo} alt="JobSpring" width={200} height={60} priority />
            </Link>

            <ul className="space-y-3">
                {items.map(({ label, href, icon: Icon, children }) => {
                    if (children) {
                        const open = openKey === label;
                        const childActive = activeChildHref(pathname, children);
                        const panelId = `submenu-${label.replace(/\W+/g, "-")}`;

                        return (
                            <li key={label}>
                                <button
                                    type="button"
                                    onClick={() => toggle(label)}
                                    aria-expanded={open}
                                    aria-controls={panelId}
                                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${childActive ? COLORS.parentActive : COLORS.idle
                                        }`}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="flex-1 truncate text-left">{label}</span>
                                    <ChevronDown
                                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    id={panelId}
                                    className={`grid transition-all duration-200 ease-out ${open
                                        ? "grid-rows-[1fr] opacity-100"
                                        : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <ul
                                        className={`ml-5 min-h-0 space-y-1 overflow-hidden border-l-2 pl-3 ${COLORS.childLine}`}
                                    >
                                        {children.map((child) => {
                                            const active = child.href === childActive;
                                            return (
                                                <li key={child.href} className="first:mt-2">
                                                    <Link
                                                        href={withLocale(child.href)}
                                                        onClick={() => {
                                                            setOpenKey(label);
                                                            onNavigate?.();
                                                        }}
                                                        tabIndex={open ? 0 : -1}
                                                        aria-current={active ? "page" : undefined}
                                                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${active
                                                            ? `${COLORS.active} font-semibold`
                                                            : COLORS.childIdle
                                                            }`}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </li>
                        );
                    }

                    const active = href ? matches(pathname, href) : false;
                    return (
                        <li key={label}>
                            <Link
                                href={withLocale(href!)}
                                onClick={() => {
                                    setOpenKey(null);
                                    onNavigate?.();
                                }}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${active ? COLORS.active : COLORS.idle
                                    }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="truncate">{label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}