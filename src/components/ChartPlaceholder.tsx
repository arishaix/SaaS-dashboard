import { ChartBarIcon } from "@heroicons/react/24/outline";

interface ChartPlaceholderProps {
  title?: string;
  description?: string;
}

export default function ChartPlaceholder({
  title = "Chart Placeholder",
  description = "No chart data available.",
}: ChartPlaceholderProps) {
  return (
    <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
      <div className="text-center p-4">
        <ChartBarIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <h4 className="text-gray-700 font-semibold mb-1">{title}</h4>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
}
