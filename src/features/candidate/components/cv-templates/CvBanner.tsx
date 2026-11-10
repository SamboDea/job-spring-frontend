import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { CvData } from "@/src/features/candidate/generate-cv/types";
import { RichText } from "../CvShared";

const styles = StyleSheet.create({
    header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    headerText: { flex: 1 },
    photo: { width: 72, height: 72, borderRadius: 36, objectFit: "cover", marginLeft: 16 },
    page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1f2937", lineHeight: 1.4 },
    name: {
        fontSize: 22,
        lineHeight: 1.3,
        fontFamily: "Helvetica-Bold",
        color: "#696CFF",
        marginBottom: 4,
    },
    title: { fontSize: 12, lineHeight: 1.3, color: "#6b7280", marginBottom: 2 },
    contact: { fontSize: 9, lineHeight: 1.3, color: "#6b7280", marginTop: 4 },
    sectionTitle: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        color: "#696CFF",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        paddingBottom: 3,
        marginTop: 16,
        marginBottom: 8,
    },
    row: { flexDirection: "row", justifyContent: "space-between" },
    bold: { fontFamily: "Helvetica-Bold" },
    muted: { color: "#6b7280" },
    item: { marginBottom: 8 },
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
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </>
    );
}

export default function CvModern({ data }: { data: CvData }) {
    const contact = [data.email, data.phone, data.location].filter(Boolean).join("  •  ");

    return (
        <Document title={`${data.fullName} - CV`} author={data.fullName}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.name}>{data.fullName}</Text>
                        {data.title && <Text style={styles.title}>{data.title}</Text>}
                        <Text style={styles.contact}>{contact}</Text>
                    </View>
                    {data.profile && <Image src={data.profile} style={styles.photo} />}
                </View>

                {data.summary && (
                    <Section title="Summary">
                        <RichText value={data.summary} />
                    </Section>
                )}

                {data.experience.length > 0 && (
                    <Section title="Work Experience">
                        {data.experience.map((e, i) => (
                            <View key={i} style={styles.item} wrap={false}>
                                <View style={styles.row}>
                                    <Text style={styles.bold}>{e.position}</Text>
                                    <Text style={styles.muted}>
                                        {e.startDate} – {e.endDate || "Present"}
                                    </Text>
                                </View>
                                <Text style={styles.muted}>{e.company}</Text>
                                <RichText value={e.jobResponsibility} />
                            </View>
                        ))}
                    </Section>
                )}
                {data.education.length > 0 && (
                    <Section title="Education">
                        {data.education.map((e, i) => (
                            <View key={i} style={styles.item} wrap={false}>
                                <View style={styles.row}>
                                    <Text style={styles.bold}>{e.school}</Text>
                                    <Text style={styles.muted}>
                                        {e.startDate} – {e.endDate || "Present"}
                                    </Text>
                                </View>
                                <Text style={styles.muted}>{e.degree}</Text>
                                <Text style={styles.muted}>{e.major}</Text>
                            </View>
                        ))}
                    </Section>
                )}

                {data.skills.length > 0 && (
                    <Section title="Skills">
                        <Text>{data.skills.filter(Boolean).join(", ")}</Text>
                    </Section>
                )}

                {data.languages.length > 0 && (
                    <Section title="Languages">
                        {data.languages.map((l, i) => (
                            <View key={i} style={styles.row}>
                                <Text>{l.name}</Text>
                                {l.level && <Text style={styles.muted}>{l.level}</Text>}
                            </View>
                        ))}
                    </Section>
                )}

                {data.achievements.length > 0 && (
                    <Section title="Achievements">
                        {data.achievements.map((a, i) => (
                            <View key={i} style={styles.item} wrap={false}>
                                <View style={styles.row}>
                                    <Text style={styles.bold}>{a.title}</Text>
                                    {a.date && <Text style={styles.muted}>{a.date}</Text>}
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
                                <View key={rowIndex} style={styles.referencesRow} wrap={false}>
                                    {pair.map((r, i) => (
                                        <View key={i} style={styles.referenceItem}>
                                            <Text style={styles.bold}>{r.name}</Text>
                                            {(r.position || r.company) && (
                                                <Text style={styles.muted}>
                                                    {[r.position, r.company].filter(Boolean).join("\u00A0\u00A0at ")}
                                                </Text>
                                            )}
                                            {r.email && <Text style={styles.muted}>{r.email}</Text>}
                                            {r.phone && <Text style={styles.muted}>{r.phone}</Text>}
                                        </View>
                                    ))}
                                    {pair.length === 1 && <View style={styles.referenceItem} />}
                                </View>
                            );
                        })}
                    </Section>
                )}
            </Page>
        </Document>
    );
}