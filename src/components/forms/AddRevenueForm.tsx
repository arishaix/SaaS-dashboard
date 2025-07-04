import React, { useState } from "react";
import Loader from "../Loader";
import { showToast } from "../ToastMessage";
import ToastMessage from "../ToastMessage";

interface AddRevenueFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddRevenueForm: React.FC<AddRevenueFormProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), source, date }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(
          <ToastMessage
            type="error"
            message={data.error || "Failed to add revenue"}
          />,
          { toastId: "add-revenue-error" }
        );
        throw new Error(data.error || "Failed to add revenue");
      }
      showToast(
        <ToastMessage type="success" message="Revenue added successfully!" />,
        { toastId: "add-revenue-success" }
      );
      setAmount("");
      setSource("");
      setDate("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[#16113a] rounded-2xl shadow-lg p-6 sm:p-10 md:p-14 w-full max-w-2xl relative border-2 border-white mx-2">
        <button
          className="absolute top-4 right-6 sm:top-8 sm:right-10 md:top-13 md:right-16 text-3xl text-white cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-white">
          Add Revenue
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-2 rounded-lg px-5 py-4 bg-white text-[#16113a] placeholder-gray-400 focus:border-[#0fd354] focus:bg-white focus:outline-none text-lg"
            required
          />
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border-2 rounded-lg px-5 py-4 bg-white text-[#16113a] placeholder-gray-400 focus:border-[#0fd354] focus:bg-white focus:outline-none text-lg"
            required
          />
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-2 rounded-lg px-5 py-4 bg-white text-[#16113a] placeholder-gray-400 focus:border-[#0fd354] focus:bg-white focus:outline-none text-lg"
            required
          />
          <button
            type="submit"
            className="bg-[#16113a] text-[#0fd354] border-2 border-[#0fd354] rounded-lg px-6 py-4 font-bold text-lg hover:bg-[#0fd354] hover:text-[#16113a] transition-colors"
            disabled={loading}
          >
            {loading ? <Loader small={true} /> : "Add Revenue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRevenueForm;
