"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";

interface LanguageOption {
  code: "en" | "km";
  label: string;
  countryCode: string; // ISO 3166-1 alpha-2, used by flagcdn
}

const languages: LanguageOption[] = [
  { code: "en", label: "English", countryCode: "us" },
  { code: "km", label: "ភាសាខ្មែរ", countryCode: "kh" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const current = languages.find((l) => l.code === locale) ?? languages[0];
  const next = languages.find((l) => l.code !== locale) ?? languages[1];

  const handleToggle = () => {
    startTransition(() => {
      router.replace(pathname, { locale: next.code });
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleToggle}
      title={`Switch to ${next.label}`}
      className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-gray-200/80 bg-gray-100/80 hover:bg-gray-100 shadow-xs transition-all ${isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
    >
      <span className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-black/5 shrink-0">
        <img
          src={`https://flagcdn.com/w40/${current.countryCode}.png`}
          srcSet={`https://flagcdn.com/w80/${current.countryCode}.png 2x`}
          alt={current.label}
          className="w-full h-full object-cover"
        />
      </span>
      <span className="text-xs sm:text-sm font-medium text-gray-700">
        {current.label}
      </span>
    </button>
  );
}