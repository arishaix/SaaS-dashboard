"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

const CustomTooltip = (props: TooltipProps<any, any>) => {
  const anyProps = props as any;
  if (!anyProps.active || !anyProps.payload || !anyProps.payload.length)
    return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", padding: 12 }}>
      <div style={{ color: "#000", fontWeight: 600 }}>
        {anyProps.label ?? ""}
      </div>
      {anyProps.payload.map((entry: any, i: number) => (
        <div key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  );
};

export default function UserGrowthBarChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="users" fill="#16113a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
