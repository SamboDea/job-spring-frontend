"use client";

import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export type ChartSeries = {
    key: string;                    // field name in your data
    label: string;                  // shown in legend + tooltip
    type: "bar" | "line";
    axis?: "left" | "right";        // default "left"
    color: string;
    unit?: string;                  // e.g. "%" shown in tooltip
};

type Props = {
    title: string;
    subtitle?: string;
    data: object[];                 // any array of objects
    xKey: string;                   // field used for the X axis, e.g. "month"
    series: ChartSeries[];
    leftLabel?: string;             // title of the left Y axis
    rightLabel?: string;            // title of the right Y axis
    height?: number;
};

export default function MultiAxisChart({
    title,
    subtitle,
    data,
    xKey,
    series,
    leftLabel,
    rightLabel,
    height = 320,
}: Props) {
    const hasRightAxis = series.some((s) => s.axis === "right");

    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="mb-4 text-sm text-gray-600">{subtitle}</p>}

            <div style={{ height }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data as Record<string, unknown>[]} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef1" />
                        <XAxis dataKey={xKey} tickLine={false} axisLine={false} fontSize={12} />

                        {/* Left axis */}
                        <YAxis
                            yAxisId="left"
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                            width={44}
                            label={
                                leftLabel
                                    ? { value: leftLabel, angle: -90, position: "insideLeft", fontSize: 12, fill: "#6b7280" }
                                    : undefined
                            }
                        />

                        {/* Right axis (only when a series uses it) */}
                        {hasRightAxis && (
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                width={44}
                                label={
                                    rightLabel
                                        ? { value: rightLabel, angle: 90, position: "insideRight", fontSize: 12, fill: "#6b7280" }
                                        : undefined
                                }
                            />
                        )}

                        <Tooltip
                            cursor={{ fill: "rgba(105,108,255,0.06)" }}
                            contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }}
                            formatter={(value, name) => {
                                const s = series.find((x) => x.label === name);
                                return [`${value}${s?.unit ?? ""}`, name];
                            }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />

                        {series.map((s) => {
                            const yAxisId = s.axis ?? "left";
                            return s.type === "bar" ? (
                                <Bar
                                    key={s.key}
                                    dataKey={s.key}
                                    name={s.label}
                                    yAxisId={yAxisId}
                                    fill={s.color}
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={36}
                                />
                            ) : (
                                <Line
                                    key={s.key}
                                    dataKey={s.key}
                                    name={s.label}
                                    yAxisId={yAxisId}
                                    stroke={s.color}
                                    strokeWidth={2.5}
                                    type="monotone"
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            );
                        })}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}