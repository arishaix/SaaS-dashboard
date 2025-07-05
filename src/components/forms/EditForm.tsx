"use client";
import { useState, useEffect } from "react";
import Loader from "../Loader";

type DataType = "revenue" | "sales" | "reports";

interface DataItem {
  _id: string;
  amount?: number;
  source?: string;
  date?: string;
  orderId?: string;
  name?: string;
  activity?: string;
  status?: string;
  [key: string]: any;
}

interface EditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: DataItem) => void;
  item: DataItem;
  dataType: DataType;
  loading?: boolean;
}

export default function EditForm({
  isOpen,
  onClose,
  onSave,
  item,
  dataType,
  loading = false,
}: EditFormProps) {
  const [formData, setFormData] = useState<DataItem>(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    await onSave(formData);
  };

  const getFields = () => {
    switch (dataType) {
      case "revenue":
        return [
          { key: "amount", label: "Amount", type: "number" },
          { key: "source", label: "Source", type: "text" },
          { key: "date", label: "Date", type: "text" },
        ];
      case "sales":
        return [
          { key: "orderId", label: "Order ID", type: "text" },
          { key: "amount", label: "Amount", type: "number" },
          { key: "date", label: "Date", type: "text" },
        ];
      case "reports":
        return [
          { key: "name", label: "Name", type: "text" },
          { key: "date", label: "Date", type: "text" },
          { key: "activity", label: "Activity", type: "text" },
          { key: "status", label: "Status", type: "text" },
        ];
      default:
        return [];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[#16113a] rounded-2xl shadow-lg p-6 sm:p-10 md:p-14 w-full max-w-2xl relative border-2 border-white mx-2">
        <button
          className="absolute top-12 right-6 sm:top-10 sm:right-10 md:top-14 md:right-16 text-3xl text-white cursor-pointer"
          onClick={onClose}
          disabled={loading}
        >
          &times;
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-white">
          Edit{" "}
          {dataType === "revenue"
            ? "Revenue"
            : dataType === "sales"
            ? "Sale"
            : "Report"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {getFields().map((field) => (
            <input
              key={field.key}
              type={
                field.type === "number"
                  ? "number"
                  : field.type === "date"
                  ? "date"
                  : "text"
              }
              placeholder={field.label}
              value={formData[field.key] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.key]:
                    field.type === "number"
                      ? Number(e.target.value)
                      : e.target.value,
                }))
              }
              className="border-2 rounded-lg px-5 py-4 bg-white text-[#16113a] placeholder-gray-400 focus:border-[#0fd354] focus:bg-white focus:outline-none text-lg"
              required
            />
          ))}
          <button
            type="submit"
            className="bg-[#16113a] text-[#0fd354] border-2 border-[#0fd354] rounded-lg px-6 py-4 font-bold text-lg hover:bg-[#0fd354] hover:text-[#16113a] transition-colors"
            disabled={loading}
          >
            {loading ? <Loader small /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
