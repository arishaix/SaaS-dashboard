"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import Loader from "@/components/Loader";

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

export default function SalesLineChart({
  data,
  loading = false,
}: {
  data: any[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] w-full">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full flex items-center justify-center">
          <span>
            <Loader small />
          </span>
        </div>
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#0fd354"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
