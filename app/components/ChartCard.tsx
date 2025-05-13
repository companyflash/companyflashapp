/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type FlexComp = ComponentType<any>;

const LineChart = dynamic(
  () =>
    import("recharts").then((m) => ({ default: m.LineChart as unknown as FlexComp })),
  { ssr: false }
);

const Line = dynamic(
  () =>
    import("recharts").then((m) => ({ default: m.Line as unknown as FlexComp })),
  { ssr: false }
);

const XAxis = dynamic(
  () =>
    import("recharts").then((m) => ({ default: m.XAxis as unknown as FlexComp })),
  { ssr: false }
);

const YAxis = dynamic(
  () =>
    import("recharts").then((m) => ({ default: m.YAxis as unknown as FlexComp })),
  { ssr: false }
);

const Tooltip = dynamic(
  () =>
    import("recharts").then((m) => ({ default: m.Tooltip as unknown as FlexComp })),
  { ssr: false }
);

const ResponsiveContainer = dynamic(
  () =>
    import("recharts").then((m) => ({
      default: m.ResponsiveContainer as unknown as FlexComp,
    })),
  { ssr: false }
);

/* ----------------------------------------------------------------- */

interface DataPoint {
  name: string;
  value: number;
}

interface ChartCardProps {
  title: string;
  data: DataPoint[];
  dataKey?: string;
}

export default function ChartCard({
  title,
  data,
  dataKey = "value",
}: ChartCardProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-medium mb-2">{title}</h3>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
