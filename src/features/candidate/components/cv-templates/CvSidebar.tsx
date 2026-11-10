import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { CvData } from "@/src/features/candidate/generate-cv/types";
import { dateRange, RichText } from "../CvShared";

const SIDEBAR_W = 190;
const DARK = "#1e293b";
const ACCENT = "#38bdf8";

const s = StyleSheet.create({
    page: { paddingVertical: 24, fontSize: 10, fontFamily: "Helvetica", color: "#1f2937", lineHeight: 1.4 },
    sidebarBg: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: SIDEBAR_W,
        backgroundColor: DARK,
    },
    layout: { flexDirection: "row" },
    sidebar: { width: SIDEBAR_W, paddingHorizontal: 20, color: "#ffffff" },
    main: { flex: 1, paddingHorizontal: 28 },
    photo: { width: 90, height: 90, borderRadius: 45, objectFit: "cover", marginBottom: 14 },
    name: { fontSize: 19, fontFamily: "Helvetica-Bold", color: "#ffffff", lineHeight: 1.25 },
    title: { fontSize: 10.5, color: ACCENT, marginTop: 4 },
    sideTitle: {
        fontSize: 9.5,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        letterSpacing: 1,
        color: ACCENT,
        marginTop: 18,
        marginBottom: 6,
    },
    sideText: { fontSize: 9, color: "#cbd5e1", marginTop: 3 },
    mainTitle: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        color: DARK,
        borderBottomWidth: 2,
        borderBottomColor: ACCENT,
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

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <>
            <Text style={s.sideTitle}>{title}</Text>
            {children}
        </>
    );
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <>
            <Text style={s.mainTitle}>{title}</Text>
            {children}
        </>
    );
}

export default function CvSidebar({ data }: { data: CvData }) {
    const contacts = [data.email, data.phone, data.location].filter(Boolean) as string[];

    return (
        <Document title={`${data.fullName} - CV`} author={data.fullName}>
            <Page size="A4" style={s.page}>
                {/* fixed so the dark column repeats on every page */}
                <View style={s.sidebarBg} fixed />

                <View style={s.layout}>
                    <View style={s.sidebar}>
                        {data.profile && <Image src={data.profile} style={s.photo} />}
                        <Text style={s.name}>{data.fullName}</Text>
                        {data.title && <Text style={s.title}>{data.title}</Text>}

                        {contacts.length > 0 && (
                            <SideSection title="Contact">
                                {contacts.map((c, i) => (
                                    <Text key={i} style={s.sideText}>
                                        {c}
                                    </Text>
                                ))}
                            </SideSection>
                        )}

                        {data.skills.length > 0 && (
                            <SideSection title="Skills">
                                {data.skills.filter(Boolean).map((skill, i) => (
                                    <Text key={i} style={s.sideText}>
                                        {skill}
                                    </Text>
                                ))}
                            </SideSection>
                        )}

                        {data.languages.length > 0 && (
                            <SideSection title="Languages">
                                {data.languages.map((l, i) => (
                                    <Text key={i} style={s.sideText}>
                                        {l.name}
                                        {l.level ? `  –  ${l.level}` : ""}
                                    </Text>
                                ))}
                            </SideSection>
                        )}
                    </View>

                    <View style={s.main}>
                        {data.summary && (
                            <MainSection title="Profile">
                                <RichText value={data.summary} />
                            </MainSection>
                        )}

                        {data.experience.length > 0 && (
                            <MainSection title="Work Experience">
                                {data.experience.map((e, i) => (
                                    <View key={i} style={s.item} wrap={false}>
                                        <Text style={s.bold}>{e.position}</Text>
                                        <View style={s.row}>
                                            <Text style={s.muted}>{e.company}</Text>
                                            <Text style={s.muted}>{e.startDate} – {e.endDate || "Present"}</Text>
                                        </View>
                                        <RichText value={e.jobResponsibility} bulletColor={ACCENT} />
                                    </View>
                                ))}
                            </MainSection>
                        )}

                        {data.education.length > 0 && (
                            <MainSection title="Education">
                                {data.education.map((e, i) => (
                                    <View key={i} style={s.item} wrap={false}>
                                        <View style={s.row}>
                                            <Text style={s.bold}>{e.school}</Text>
                                            <Text style={s.muted}>{e.startDate} – {e.endDate || "Present"}</Text>
                                        </View>
                                        <Text style={s.muted}>{e.degree}</Text>
                                        <Text style={s.muted}>{e.major}</Text>
                                    </View>
                                ))}
                            </MainSection>
                        )}

                        {data.achievements.length > 0 && (
                            <MainSection title="Achievements">
                                {data.achievements.map((a, i) => (
                                    <View key={i} style={s.item} wrap={false}>
                                        <View style={s.row}>
                                            <Text style={s.bold}>{a.title}</Text>
                                            {a.date && <Text style={s.muted}>{a.date}</Text>}
                                        </View>
                                        <RichText value={a.description} bulletColor={ACCENT} />
                                    </View>
                                ))}
                            </MainSection>
                        )}

                        {data.references.length > 0 && (
                            <MainSection title="References">
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
                            </MainSection>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
}