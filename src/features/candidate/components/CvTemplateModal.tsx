"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CV_TEMPLATE_OPTIONS, type CvTemplateId } from "./CvDocument";
import type { CvData } from "../generate-cv/types";
import { imageToDataUrl } from "@/src/lib/utils";

type PreviewState = { url?: string; error?: boolean };

type Props = {
    open: boolean;
    data: CvData | null;
    onClose: () => void;
    onSelect: (template: CvTemplateId) => void;
    initial?: CvTemplateId;
};

const DESCRIPTIONS: Record<CvTemplateId, string> = {
    modern: "Indigo headings with a round photo",
    classic: "Serif and black and white, no photo. Works well with ATS",
    sidebar: "Dark side column with contact, skills and languages",
    minimal: "Lots of whitespace with a small square photo",
    banner: "Navy header band with skills as chips",
};

export default function CvTemplatePickerModal({
    open,
    data,
    onClose,
    onSelect,
    initial = "modern",
}: Props) {
    const options = CV_TEMPLATE_OPTIONS;
    const count = options.length;
    const startIndex = Math.max(0, options.findIndex((o) => o.id === initial));

    const [index, setIndex] = useState(startIndex);
    const [cvData, setCvData] = useState<CvData | null>(null);
    const [previews, setPreviews] = useState<Record<string, PreviewState>>({});

    const touchX = useRef<number | null>(null);
    const urlsRef = useRef<Partial<Record<string, string>>>({});
    const inflight = useRef<Partial<Record<string, Promise<void>>>>({});
    const sessionRef = useRef(0);

    const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

    useEffect(() => {
        if (!open || !data) return;
        const session = ++sessionRef.current;
        setIndex(startIndex);
        setCvData(null);
        setPreviews({});

        (async () => {
            let profile = data.profile;
            try {
                profile = await imageToDataUrl(data.profile);
            } catch {
                profile = "";
            }
            if (sessionRef.current === session) setCvData({ ...data, profile });
        })();

        return () => {
            sessionRef.current++;
            Object.values(urlsRef.current).forEach((u) => {
                if (u) URL.revokeObjectURL(u);
            });
            urlsRef.current = {};
            inflight.current = {};
        };
    }, [open, data]);

    /* ---- render one template to a PDF blob URL (cached) ---- */
    const ensure = useCallback((id: CvTemplateId, source: CvData): Promise<void> => {
        if (urlsRef.current[id]) return Promise.resolve();
        const existing = inflight.current[id];
        if (existing) return existing;

        const session = sessionRef.current;
        const task = (async () => {
            try {
                const [{ pdf }, { default: CvDocument }] = await Promise.all([
                    import("@react-pdf/renderer"),
                    import("./CvDocument"),
                ]);
                const blob = await pdf(<CvDocument data={source} template={id} />).toBlob();
                if (sessionRef.current !== session) return;
                const url = URL.createObjectURL(blob);
                urlsRef.current[id] = url;
                setPreviews((p) => ({ ...p, [id]: { url } }));
            } catch (e) {
                console.error(`Preview failed for ${id}`, e);
                if (sessionRef.current === session) {
                    setPreviews((p) => ({ ...p, [id]: { error: true } }));
                }
            } finally {
                delete inflight.current[id];
            }
        })();

        inflight.current[id] = task;
        return task;
    }, []);

    useEffect(() => {
        if (!open || !cvData) return;
        let cancelled = false;
        (async () => {
            const order = [index, ...options.map((_, i) => i).filter((i) => i !== index)];
            for (const i of order) {
                if (cancelled) return;
                const id = options[i].id as CvTemplateId;
                if (previews[id]?.error) continue;
                await ensure(id, cvData);
            }
        })();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, cvData, index]);

    const retry = (id: CvTemplateId) => {
        if (!cvData) return;
        setPreviews((p) => {
            const next = { ...p };
            delete next[id];
            return next;
        });
        void ensure(id, cvData);
    };

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") go(index - 1);
            if (e.key === "ArrowRight") go(index + 1);
        };
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, index, go, onClose]);

    if (!open) return null;

    const current = options[index];
    const currentId = current.id as CvTemplateId;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Choose a CV template"
        >
            <div
                className="flex max-h-[96vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* header */}
                <div className="flex items-start justify-between border-b border-zinc-200 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">Choose a CV template</h2>
                        <p className="text-sm text-zinc-500">
                            Previews use your own details. Browse {count} designs with the arrows.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-md cursor-pointer p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M5 5l10 10M15 5L5 15" />
                        </svg>
                    </button>
                </div>

                {/* carousel */}
                <div
                    className="relative flex-1 overflow-hidden bg-zinc-100"
                    onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
                    onTouchEnd={(e) => {
                        if (touchX.current === null) return;
                        const dx = e.changedTouches[0].clientX - touchX.current;
                        if (Math.abs(dx) > 60) go(index + (dx < 0 ? 1 : -1));
                        touchX.current = null;
                    }}
                >
                    <div
                        className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {options.map((o) => {
                            const id = o.id as CvTemplateId;
                            const state = previews[id];
                            return (
                                <div
                                    key={id}
                                    className="flex w-full shrink-0 items-center justify-center px-14 py-5"
                                    aria-hidden={id !== currentId}
                                >
                                    <div
                                        className="relative w-full max-w-[450px] overflow-hidden bg-white shadow-lg"
                                        style={{
                                            aspectRatio: "210 / 297",
                                            width: "min(100%, 450px, calc(64vh * 210 / 297))",
                                        }}
                                    >
                                        {state?.url ? (
                                            <iframe
                                                title={`${o.label} preview`}
                                                src={`${state.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                                className="h-full w-full border-0 p-0"
                                                tabIndex={-1}
                                            />
                                        ) : state?.error ? (
                                            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-zinc-500">
                                                <p>Could not build this preview.</p>
                                                <button
                                                    type="button"
                                                    onClick={() => retry(id)}
                                                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50"
                                                >
                                                    Try again
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-zinc-500">
                                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600 motion-reduce:animate-none" />
                                                Building preview…
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {(["prev", "next"] as const).map((dir) => (
                        <button
                            key={dir}
                            type="button"
                            onClick={() => go(index + (dir === "next" ? 1 : -1))}
                            aria-label={dir === "next" ? "Next template" : "Previous template"}
                            className={`absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white p-2 text-zinc-700 shadow hover:bg-zinc-50 ${dir === "next" ? "right-3" : "left-3"
                                }`}
                        >
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={dir === "next" ? "M7 4l6 6-6 6" : "M13 4l-6 6 6 6"} />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* footer */}
                <div className="border-t border-zinc-200 px-5 py-4">
                    <div className="mb-3 flex justify-center gap-2">
                        {options.map((o, i) => (
                            <button
                                key={o.id}
                                type="button"
                                onClick={() => go(i)}
                                aria-label={`Show ${o.label}`}
                                aria-current={i === index}
                                className={`h-2 rounded-full transition-all cursor-pointer ${i === index ? "w-6 bg-indigo-600" : "w-2 bg-zinc-300 hover:bg-zinc-400"
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <div className="text-center sm:text-left">
                            <div className="font-medium text-zinc-900">{current.label}</div>
                            <div className="text-sm text-zinc-500">{DESCRIPTIONS[currentId]}</div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md cursor-pointer border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => onSelect(currentId)}
                                className="rounded-md cursor-pointer bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                {/* Use {current.label} */}
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}