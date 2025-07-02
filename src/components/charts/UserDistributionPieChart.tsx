"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";

const COLORS = ["#0fd354", "#16113a", "#2d2856"];

const CustomTooltip = (props: TooltipProps<any, any>) => {
  const anyProps = props as any;
  if (!anyProps.active || !anyProps.payload || !anyProps.payload.length)
    return null;
  const labelText = anyProps.label || anyProps.payload[0]?.name || "";
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", padding: 12 }}>
      <div style={{ color: "#16113a", fontWeight: 600 }}>{labelText}</div>
      {anyProps.payload.map((entry: any, i: number) =>
        entry.name === labelText ? null : (
          <div key={i} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </div>
        )
      )}
    </div>
  );
};

export default function UserDistributionPieChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
