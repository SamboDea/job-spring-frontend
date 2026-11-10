import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CvData } from "@/src/features/candidate/generate-cv/types";
import { dateRange, RichText } from "../CvShared";

const s = StyleSheet.create({
    page: {
        padding: 44,
        fontSize: 10.5,
        fontFamily: "Times-Roman",
        color: "#111111",
        lineHeight: 1.35,
    },
    header: { alignItems: "center", marginBottom: 4 },
    name: {
        fontSize: 24,
        fontFamily: "Times-Bold",
        letterSpacing: 1,
        textTransform: "uppercase",
        lineHeight: 1.3,
    },
    title: { fontSize: 12, fontFamily: "Times-Italic", marginTop: 2 },
    contact: { fontSize: 9.5, color: "#444444", marginTop: 4 },
    sectionTitle: {
        fontSize: 11,
        fontFamily: "Times-Bold",
        textTransform: "uppercase",
        letterSpacing: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#111111",
        paddingBottom: 2,
        marginTop: 14,
        marginBottom: 6,
    },
    row: { flexDirection: "row", justifyContent: "space-between" },
    bold: { fontFamily: "Times-Bold" },
    italic: { fontFamily: "Times-Italic" },
    item: { marginBottom: 7 },
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
        <>
            <Text style={s.sectionTitle}>{title}</Text>
            {children}
        </>
    );
}

export default function CvClassic({ data }: { data: CvData }) {
    const contact = [data.email, data.phone, data.location].filter(Boolean).join("  |  ");

    return (
        <Document title={`${data.fullName} - CV`} author={data.fullName}>
            <Page size="A4" style={s.page}>
                <View style={s.header}>
                    <Text style={s.name}>{data.fullName}</Text>
                    {data.title && <Text style={s.title}>{data.title}</Text>}
                    <Text style={s.contact}>{contact}</Text>
                </View>

                {data.summary && (
                    <Section title="Professional Summary">
                        <RichText value={data.summary} />
                    </Section>
                )}

                {data.experience.length > 0 && (
                    <Section title="Experience">
                        {data.experience.map((e, i) => (
                            <View key={i} style={s.item} wrap={false}>
                                <View style={s.row}>
                                    <Text style={s.bold}>{e.company}</Text>
                                    <Text style={s.italic}>{e.startDate} – {e.endDate || "Present"}</Text>
                                </View>
                                <Text style={s.italic}>{e.position}</Text>
                                <RichText value={e.jobResponsibility} />
                            </View>
                        ))}
                    </Section>
                )}

                {data.education.length > 0 && (
                    <Section title="Education">
                        {data.education.map((e, i) => (
                            <View key={i} style={s.item} wrap={false}>
                                <View style={s.row}>
                                    <Text style={s.bold}>{e.school}</Text>
                                    <Text style={s.italic}>{e.startDate} – {e.endDate || "Present"}</Text>
                                </View>
                                <Text style={s.italic}>{e.degree}</Text>
                                <Text style={s.italic}>{e.major}</Text>
                            </View>
                        ))}
                    </Section>
                )}

                {data.skills.length > 0 && (
                    <Section title="Skills">
                        <Text>{data.skills.filter(Boolean).join("  •  ")}</Text>
                    </Section>
                )}

                {data.languages.length > 0 && (
                    <Section title="Languages">
                        <Text>
                            {data.languages
                                .map((l) => (l.level ? `${l.name} (${l.level})` : l.name))
                                .join("  •  ")}
                        </Text>
                    </Section>
                )}

                {data.achievements.length > 0 && (
                    <Section title="Achievements">
                        {data.achievements.map((a, i) => (
                            <View key={i} style={s.item} wrap={false}>
                                <View style={s.row}>
                                    <Text style={s.bold}>{a.title}</Text>
                                    {a.date && <Text style={s.italic}>{a.date}</Text>}
                                </View>
                                <RichText value={a.description} />
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
                                                <Text >
                                                    {[r.position, r.company].filter(Boolean).join("\u00A0\u00A0at ")}
                                                </Text>
                                            )}
                                            {r.email && <Text>{r.email}</Text>}
                                            {r.phone && <Text>{r.phone}</Text>}
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