import MultiAxisChart, { type ChartSeries } from "./MultiAxisChart";

const data = [
    { month: "May", applications: 120, interviews: 40, hireRate: 8 },
    { month: "Jun", applications: 150, interviews: 55, hireRate: 10 },
    { month: "Jul", applications: 135, interviews: 48, hireRate: 9 },
    { month: "Aug", applications: 190, interviews: 70, hireRate: 14 },
    { month: "Sep", applications: 170, interviews: 62, hireRate: 12 },
    { month: "Oct", applications: 210, interviews: 80, hireRate: 16 },
];

const series: ChartSeries[] = [
    { key: "applications", label: "Applications", type: "bar", axis: "left", color: "#69dcf4" },
    { key: "interviews", label: "Interviews", type: "bar", axis: "left", color: "#696CFF" },
    { key: "hireRate", label: "Hire rate", type: "line", axis: "right", color: "#71dd37", unit: "%" },
];

export default function HiringTrendChart() {
    return (
        <MultiAxisChart
            title="Hiring trend"
            subtitle="Applications and interviews (left) vs hire rate (right)."
            data={data}
            xKey="month"
            series={series}
            leftLabel="Candidates"
            rightLabel="Hire rate (%)"
        />
    );
}