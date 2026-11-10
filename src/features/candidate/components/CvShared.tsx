import { Text, View } from "@react-pdf/renderer";
import type { Styles } from "@react-pdf/renderer";

export type PdfStyle = Styles | Styles[];

export function stripHtml(html?: string | null | string[]): string {
    if (!html) return "";
    if (Array.isArray(html)) {
        return html
            .map((item) => stripHtml(item))
            .filter((item) => item.length > 0)
            .join("\n");
    }

    return html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
        .replace(/<li[^>]*>/gi, "• ")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .split("\n")
        .map((line) => line.replace(/\s{2,}/g, " ").trim())
        .filter(Boolean)
        .join("\n");
}

export function RichText({
    value,
    textStyle,
    bulletColor,
}: {
    value?: string | null | string[];
    textStyle?: PdfStyle;
    bulletColor?: string;
}) {
    const text = stripHtml(value);
    if (!text) return null;

    return (
        <>
            {text.split("\n").map((line, i) => {
                const isBullet = line.startsWith("• ");
                return (
                    <View key={i} style={{ flexDirection: "row", marginTop: 2 }}>
                        {isBullet && (
                            <Text style={{ width: 10, color: bulletColor }}>•</Text>
                        )}
                        <Text style={[{ flex: 1 }, ...(Array.isArray(textStyle) ? textStyle : textStyle ? [textStyle] : [])]}>
                            {isBullet ? line.slice(2) : line}
                        </Text>
                    </View>
                );
            })}
        </>
    );
}

export function dateRange(start?: string | null, end?: string | null): string {
    return `${start ?? ""} – ${end || "Present"}`;
}