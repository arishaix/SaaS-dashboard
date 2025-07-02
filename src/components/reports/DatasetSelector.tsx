import React from "react";

interface DatasetSelectorProps {
  selectedDataset: string;
  setSelectedDataset: (dataset: string) => void;
  children?: React.ReactNode;
}

const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  selectedDataset,
  setSelectedDataset,
  children,
}) => (
  <div className="mb-4 flex flex-wrap gap-4 items-center">
    <label className="font-medium" style={{ color: "#16113a" }}>
      Select dataset:
    </label>
    <select
      value={selectedDataset}
      onChange={(e) => setSelectedDataset(e.target.value)}
      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#16113a]"
      style={{ color: "#23205a" }}
    >
      <option value="users">Users</option>
      <option value="sales">Sales</option>
      <option value="reports">Reports</option>
      <option value="signups">New Signups</option>
    </select>
    {children}
  </div>
);

export default DatasetSelector;
