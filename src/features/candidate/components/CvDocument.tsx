// import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
// import type { CvData } from "../generate-cv/types";

// function stripHtml(html?: string | null | string[]): string {
//     if (!html) return "";
//     if (Array.isArray(html)) {
//         return html
//             .map((item) => stripHtml(item))
//             .filter((item) => item.length > 0)
//             .join("\n");
//     }

//     return html
//         .replace(/<br\s*\/?>/gi, "\n")
//         .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
//         .replace(/<li[^>]*>/gi, "• ")
//         .replace(/<[^>]+>/g, "")
//         .replace(/&nbsp;/g, " ")
//         .replace(/&amp;/g, "&")
//         .replace(/&lt;/g, "<")
//         .replace(/&gt;/g, ">")
//         .replace(/&quot;/g, '"')
//         .replace(/&#39;/g, "'")
//         .split("\n")
//         .map((line) => line.replace(/\s{2,}/g, " ").trim())
//         .filter(Boolean)
//         .join("\n");
// }

// const styles = StyleSheet.create({
//     header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
//     headerText: { flex: 1 },
//     photo: { width: 72, height: 72, borderRadius: 36, objectFit: "cover", marginLeft: 16 },
//     page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1f2937", lineHeight: 1.4 },
//     name: {
//         fontSize: 22,
//         lineHeight: 1.3,
//         fontFamily: "Helvetica-Bold",
//         color: "#696CFF",
//         marginBottom: 4,
//     },
//     title: {
//         fontSize: 12,
//         lineHeight: 1.3,
//         color: "#6b7280",
//         marginBottom: 2,
//     },
//     contact: {
//         fontSize: 9,
//         lineHeight: 1.3,
//         color: "#6b7280",
//         marginTop: 4,
//     },
//     sectionTitle: {
//         fontSize: 11,
//         fontFamily: "Helvetica-Bold",
//         textTransform: "uppercase",
//         color: "#696CFF",
//         borderBottomWidth: 1,
//         borderBottomColor: "#e5e7eb",
//         paddingBottom: 3,
//         marginTop: 16,
//         marginBottom: 8,
//     },
//     row: { flexDirection: "row", justifyContent: "space-between" },
//     bold: { fontFamily: "Helvetica-Bold" },
//     muted: { color: "#6b7280" },
//     item: { marginBottom: 8 },
//     lineRow: { flexDirection: "row", marginTop: 2 },
//     bulletMark: { width: 10 },
//     lineText: { flex: 1 },
// });

// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//     return (
//         <>
//             <Text style={styles.sectionTitle}>{title}</Text>
//             {children}
//         </>
//     );
// }

// function RichText({ value }: { value?: string | null | string[] }) {
//     const text = stripHtml(value);
//     if (!text) return null;

//     return (
//         <>
//             {text.split("\n").map((line, i) => {
//                 const isBullet = line.startsWith("• ");
//                 return (
//                     <View key={i} style={styles.lineRow}>
//                         {isBullet && <Text style={styles.bulletMark}>•</Text>}
//                         <Text style={styles.lineText}>{isBullet ? line.slice(2) : line}</Text>
//                     </View>
//                 );
//             })}
//         </>
//     );
// }

// export default function CvDocument({ data }: { data: CvData }) {
//     const contact = [data.email, data.phone, data.location].filter(Boolean).join("  •  ");
//     console.log(data.profile)

//     return (
//         <Document title={`${data.fullName} - CV`} author={data.fullName}>
//             <Page size="A4" style={styles.page}>
//                 <View style={styles.header}>
//                     <View style={styles.headerText}>
//                         <View>
//                             <Text style={styles.name}>{data.fullName}</Text>
//                         </View>
//                         {data.title && (
//                             <View>
//                                 <Text style={styles.title}>{data.title}</Text>
//                             </View>
//                         )}
//                         <Text style={styles.contact}>{contact}</Text>
//                     </View>
//                     {data.profile && <Image src={data.profile} style={styles.photo} />}
//                 </View>

//                 {data.summary && (
//                     <Section title="Summary">
//                         <RichText value={data.summary} />
//                     </Section>
//                 )}

//                 {data.experience.length > 0 && (
//                     <Section title="Work Experience">
//                         {data.experience.map((e, i) => (
//                             <View key={i} style={styles.item} wrap={false}>
//                                 <View style={styles.row}>
//                                     <Text style={styles.bold}>{e.position}</Text>
//                                     <Text style={styles.muted}>
//                                         {e.startDate} – {e.endDate || "Present"}
//                                     </Text>
//                                 </View>
//                                 <Text style={styles.muted}>{e.company}</Text>
//                                 <RichText value={e.jobResponsibility} />
//                             </View>
//                         ))}
//                     </Section>
//                 )}

//                 {data.education.length > 0 && (
//                     <Section title="Education">
//                         {data.education.map((e, i) => (
//                             <View key={i} style={styles.item} wrap={false}>
//                                 <View style={styles.row}>
//                                     <Text style={styles.bold}>{e.degree}</Text>
//                                     <Text style={styles.muted}>
//                                         {e.startDate} – {e.endDate || "Present"}
//                                     </Text>
//                                 </View>
//                                 <Text style={styles.muted}>{e.school}</Text>
//                             </View>
//                         ))}
//                     </Section>
//                 )}

//                 {data.skills.length > 0 && (
//                     <Section title="Skills">
//                         <Text>{data.skills.filter(Boolean).join(", ")}</Text>
//                     </Section>
//                 )}

//                 {data.languages.length > 0 && (
//                     <Section title="Languages">
//                         {data.languages.map((l, i) => (
//                             <View key={i} style={styles.row}>
//                                 <Text>{l.name}</Text>
//                                 {l.level && <Text style={styles.muted}>{l.level}</Text>}
//                             </View>
//                         ))}
//                     </Section>
//                 )}

//                 {data.achievements.length > 0 && (
//                     <Section title="Achievements">
//                         {data.achievements.map((a, i) => (
//                             <View key={i} style={styles.item} wrap={false}>
//                                 <View style={styles.row}>
//                                     <Text style={styles.bold}>{a.title}</Text>
//                                     {a.date && <Text style={styles.muted}>{a.date}</Text>}
//                                 </View>
//                                 <RichText value={a.description} />
//                             </View>
//                         ))}
//                     </Section>
//                 )}

//                 {data.references.length > 0 && (
//                     <Section title="References">
//                         {data.references.map((r, i) => (
//                             <View key={i} style={styles.item} wrap={false}>
//                                 <Text style={styles.bold}>{r.name}</Text>
//                                 {(r.position || r.company) && (
//                                     <Text style={styles.muted}>
//                                         {[r.position, r.company].filter(Boolean).join(", ")}
//                                     </Text>
//                                 )}
//                                 {(r.email || r.phone) && (
//                                     <Text style={styles.muted}>
//                                         {[r.email, r.phone].filter(Boolean).join("  •  ")}
//                                     </Text>
//                                 )}
//                             </View>
//                         ))}
//                     </Section>
//                 )}
//             </Page>
//         </Document>
//     );
// }

import type { CvData } from "../generate-cv/types";
import CvModern from "./cv-templates/CvModern";
import CvClassic from "./cv-templates/CvClassic";
import CvSidebar from "./cv-templates/CvSidebar";
import CvMinimal from "./cv-templates/CvMinimal";
import CvBanner from "./cv-templates/CvBanner";

export const CV_TEMPLATES = {
    modern: { label: "Modern", component: CvModern },
    classic: { label: "Classic", component: CvClassic },
    sidebar: { label: "Sidebar", component: CvSidebar },
    minimal: { label: "Minimal", component: CvMinimal },
    banner: { label: "Banner", component: CvBanner },
} as const;

export type CvTemplateId = keyof typeof CV_TEMPLATES;

export const CV_TEMPLATE_OPTIONS = (
    Object.entries(CV_TEMPLATES) as [CvTemplateId, (typeof CV_TEMPLATES)[CvTemplateId]][]
).map(([id, t]) => ({ id, label: t.label }));

export default function CvDocument({
    data,
    template = "modern",
}: {
    data: CvData;
    template?: CvTemplateId;
}) {
    const Template = (CV_TEMPLATES[template] ?? CV_TEMPLATES.modern).component;
    return <Template data={data} />;
}