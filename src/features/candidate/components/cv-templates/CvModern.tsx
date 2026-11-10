import type { ReactNode } from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { CvData } from "@/src/features/candidate/generate-cv/types";
import { RichText, dateRange } from "../CvShared";

const ACCENT = "#3d3256";
const ACCENT_SOFT = "#eef0ff";
const TEXT = "#1f2937";
const MUTED = "#6b7280";
const LINE = "#d1d5db";
const SIDEBAR_BG = "#b09b97";
const WHITE = "#ffffff";

const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        fontSize: 9.5,
        fontFamily: "Helvetica",
        color: TEXT,
        lineHeight: 1.4,
        backgroundColor: WHITE,
    },

    /* Left Main Content (White Background) */
    main: {
        width: "62%",
        paddingTop: 36,
        paddingBottom: 36,
        paddingHorizontal: 28,
    },

    /* Right Sidebar (Colored Background) */
    sidebar: {
        width: "38%",
        backgroundColor: SIDEBAR_BG,
        paddingTop: 36,
        paddingBottom: 36,
        paddingHorizontal: 22,
    },

    /* Profile Photo at top of Sidebar */
    photoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        objectFit: "cover",
    },

    /* Header in Main */
    headerMain: {
        marginBottom: 16,
        borderBottomWidth: 1.5,
        borderBottomColor: LINE,
        paddingBottom: 12,
    },
    name: {
        fontSize: 22,
        lineHeight: 1.2,
        fontFamily: "Helvetica-Bold",
        color: ACCENT,
        marginBottom: 2,
        textTransform: "uppercase",
    },
    title: {
        fontSize: 11,
        lineHeight: 1.3,
        color: MUTED,
    },

    /* Sections for Main */
    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
        marginBottom: 6,
    },
    sectionBar: { width: 2.5, height: 10, backgroundColor: ACCENT, marginRight: 5 },
    sectionTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        color: ACCENT,
        letterSpacing: 0.6,
    },
    sectionRule: { flex: 1, height: 1, backgroundColor: LINE, marginLeft: 6 },

    /* Sections for Sidebar */
    sidebarSectionTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        color: WHITE,
        letterSpacing: 0.6,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.4)",
        paddingBottom: 4,
        marginTop: 14,
    },

    /* Items */
    item: { marginBottom: 9 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    bold: { fontFamily: "Helvetica-Bold" },
    muted: { color: MUTED },
    date: { color: MUTED, fontSize: 8.5 },
    sidebarText: { fontSize: 9, color: WHITE, marginBottom: 4 },
    sidebarMuted: { fontSize: 8.5, color: "rgba(255, 255, 255, 0.8)", marginBottom: 2 },
    chips: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
    chip: {
        fontSize: 8.5,
        color: ACCENT,
        backgroundColor: WHITE,
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 6,
        marginRight: 4,
        marginBottom: 4,
    },
});

function MainSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <View>
            <View style={styles.sectionTitleRow}>
                <View style={styles.sectionBar} />
                <Text style={styles.sectionTitle}>{title}</Text>
                <View style={styles.sectionRule} />
            </View>
            {children}
        </View>
    );
}

export default function CvModern({ data }: { data: CvData }) {
    const skills = data.skills.filter(Boolean);

    return (
        <Document title={`${data.fullName} - CV`} author={data.fullName}>
            <Page size="A4" style={styles.page}>
                <View style={styles.main}>
                    <View style={styles.headerMain}>
                        <Text style={styles.name}>{data.fullName}</Text>
                        {data.title && <Text style={styles.title}>{data.title}</Text>}
                    </View>

                    {data.summary && (
                        <MainSection title="About Me">
                            <RichText value={data.summary} bulletColor={ACCENT} />
                        </MainSection>
                    )}

                    {data.experience.length > 0 && (
                        <MainSection title="Work Experience">
                            {data.experience.map((e, i) => (
                                <View key={i} style={styles.item} wrap={false}>
                                    <View style={styles.row}>
                                        <Text style={styles.bold}>{e.position}</Text>
                                        <Text style={styles.date}>{dateRange(e.startDate, e.endDate)}</Text>
                                    </View>
                                    <Text style={[styles.muted, { marginBottom: 2 }]}>{e.company}</Text>
                                    <RichText value={e.jobResponsibility} bulletColor={ACCENT} />
                                </View>
                            ))}
                        </MainSection>
                    )}

                    {skills.length > 0 && (
                        <MainSection title="Skills">
                            <View style={styles.chips}>
                                {skills.map((s, i) => (
                                    <Text key={i} style={styles.chip}>
                                        {s}
                                    </Text>
                                ))}
                            </View>
                        </MainSection>
                    )}
                </View>

                <View style={styles.sidebar}>
                    {data.profile && (
                        <View style={styles.photoContainer}>
                            <Image src={data.profile} style={styles.photo} />
                        </View>
                    )}

                    <Text style={styles.sidebarSectionTitle}>Contacts</Text>
                    <View style={{ marginBottom: 10 }}>
                        {data.phone && <Text style={styles.sidebarText}>{data.phone}</Text>}
                        {data.email && <Text style={styles.sidebarText}>{data.email}</Text>}
                        {data.location && <Text style={styles.sidebarText}>{data.location}</Text>}
                    </View>

                    {data.education.length > 0 && (
                        <>
                            <Text style={styles.sidebarSectionTitle}>Education</Text>
                            {data.education.map((e, i) => (
                                <View key={i} style={{ marginBottom: 8 }}>
                                    <Text style={[styles.sidebarText, styles.bold]}>{e.school}</Text>
                                    <Text style={[styles.sidebarText, styles.bold]}>{e.degree}</Text>
                                    <Text style={styles.sidebarText}>{e.major}</Text>
                                    <Text style={styles.sidebarMuted}>{dateRange(e.startDate, e.endDate)}</Text>
                                </View>
                            ))}
                        </>
                    )}

                    {data.languages.length > 0 && (
                        <>
                            <Text style={styles.sidebarSectionTitle}>Languages</Text>
                            {data.languages.map((l, i) => (
                                <View key={i} style={[styles.row, { marginBottom: 4 }]}>
                                    <Text style={styles.sidebarText}>{l.name}</Text>
                                    {l.level && <Text style={styles.sidebarMuted}>{l.level}</Text>}
                                </View>
                            ))}
                        </>
                    )}

                    {data.references.length > 0 && (
                        <>
                            <Text style={styles.sidebarSectionTitle}>References</Text>
                            {data.references.map((r, i) => (
                                <View key={i} style={{ marginBottom: 6 }}>
                                    <Text style={[styles.sidebarText, styles.bold]}>{r.name}</Text>
                                    {(r.position || r.company) && (
                                        <Text style={styles.sidebarMuted}>
                                            {[r.position, r.company].filter(Boolean).join("\u00A0\u00A0at ")}
                                        </Text>
                                    )}
                                    {r.email && <Text style={styles.sidebarMuted}>{r.email}</Text>}
                                    {r.phone && <Text style={styles.sidebarMuted}>{r.phone}</Text>}
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </Page>
        </Document>
    );
}