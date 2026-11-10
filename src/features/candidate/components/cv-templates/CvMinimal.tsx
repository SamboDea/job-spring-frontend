import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { CvData } from "@/src/features/candidate/generate-cv/types";
import { RichText } from "../CvShared";

const INK = "#111827";
const MUTED = "#6b7280";
const ACCENT = "#0f766e";
const LABEL_W = 100;

const s = StyleSheet.create({
    page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", color: INK, lineHeight: 1.45 },
    header: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
    headerText: { flex: 1 },
    name: { fontSize: 26, fontFamily: "Helvetica-Bold", lineHeight: 1.2 },
    title: { fontSize: 12, color: ACCENT, marginTop: 3 },
    contact: { fontSize: 9, color: MUTED, marginTop: 6 },
    photo: { width: 64, height: 64, borderRadius: 4, objectFit: "cover", marginLeft: 16 },
    section: { flexDirection: "row", marginTop: 18 },
    label: {
        width: LABEL_W,
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        color: MUTED,
        paddingTop: 2,
    },
    content: { flex: 1 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    bold: { fontFamily: "Helvetica-Bold" },
    muted: { color: MUTED },
    item: { marginBottom: 9 },
    referencesRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    referenceItem: {
        flex: 1,
        paddingRight: 12,
    },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={s.section}>
            <Text style={s.label}>{title}</Text>
            <View style={s.content}>{children}</View>
        </View>
    );
}

export default function CvMinimal({ data }: { data: CvData }) {
    const contact = [data.email, data.phone, data.location].filter(Boolean).join("   /   ");

    return (
        <Document title={`${data.fullName} - CV`} author={data.fullName}>
            <Page size="A4" style={s.page}>
                <View style={s.header}>
                    <View style={s.headerText}>
                        <Text style={s.name}>{data.fullName}</Text>
                        {data.title && <Text style={s.title}>{data.title}</Text>}
                        <Text style={s.contact}>{contact}</Text>
                    </View>
                    {data.profile && <Image src={data.profile} style={s.photo} />}
                </View>

                {data.summary && (
                    <Section title="About">
                        <RichText value={data.summary} />
                    </Section>
                )}

                {data.experience.length > 0 && (
                    <Section title="Experience">
                        {data.experience.map((e, i) => (
                            <View key={i} style={s.item} wrap={false}>
                                <View style={s.row}>
                                    <Text style={s.bold}>{e.position}</Text>
                                    <Text style={s.muted}>{e.startDate} – {e.endDate || "Present"}</Text>
                                </View>
                                <Text style={s.muted}>{e.company}</Text>
                                <RichText value={e.jobResponsibility} bulletColor={ACCENT} />
                            </View>
                        ))}
                    </Section>
                )}

                {data.education.length > 0 && (
                    <Section title="Education">
                        {data.education.map((e, i) => (
                            <View key={i} style={s.item} wrap={false}>
                                <View style={s.row}>
                                    <Text style={s.muted}>{e.school}</Text>
                                    <Text style={s.muted}>{e.startDate} – {e.endDate || "Present"}</Text>
                                </View>
                                <Text style={s.muted}>{e.degree}</Text>
                                <Text style={s.muted}>{e.major}</Text>
                            </View>
                        ))}
                    </Section>
                )}

                {data.skills.length > 0 && (
                    <Section title="Skills">
                        <Text>{data.skills.filter(Boolean).join("  ·  ")}</Text>
                    </Section>
                )}

                {data.languages.length > 0 && (
                    <Section title="Languages">
                        <Text>
                            {data.languages
                                .map((l) => (l.level ? `${l.name} (${l.level})` : l.name))
                                .join("  ·  ")}
                        </Text>
                    </Section>
                )}

                {data.achievements.length > 0 && (
                    <Section title="Achievements">
                        {data.achievements.map((a, i) => (
                            <View key={i} style={s.item} wrap={false}>
                                <View style={s.row}>
                                    <Text style={s.bold}>{a.title}</Text>
                                    {a.date && <Text style={s.muted}>{a.date}</Text>}
                                </View>
                                <RichText value={a.description} bulletColor={ACCENT} />
                            </View>
                        ))}
                    </Section>
                )}

                {data.references.length > 0 && (
                    <Section title="References">
                        {Array.from({ length: Math.ceil(data.references.length / 2) }, (_, rowIndex) => {
                            const pair = data.references.slice(rowIndex * 2, rowIndex * 2 + 2);
                            return (
                                <View key={rowIndex} style={s.referencesRow} wrap={false}>
                                    {pair.map((r, i) => (
                                        <View key={i} style={s.referenceItem}>
                                            <Text style={s.bold}>{r.name}</Text>
                                            {(r.position || r.company) && (
                                                <Text style={s.muted}>
                                                    {[r.position, r.company].filter(Boolean).join("\u00A0\u00A0at ")}
                                                </Text>
                                            )}
                                            {r.email && <Text style={s.muted}>{r.email}</Text>}
                                            {r.phone && <Text style={s.muted}>{r.phone}</Text>}
                                        </View>
                                    ))}
                                    {pair.length === 1 && <View style={s.referenceItem} />}
                                </View>
                            );
                        })}
                    </Section>
                )}
            </Page>
        </Document>
    );
}