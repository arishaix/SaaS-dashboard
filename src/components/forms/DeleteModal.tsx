"use client";
import React, { useState } from "react";
import Loader from "../Loader";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  dataType: string;
  loading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  dataType,
  loading = false,
}: DeleteModalProps) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (loading) return; // Prevent multiple submissions
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[#16113a] rounded-2xl shadow-lg p-6 sm:p-10 md:p-14 w-full max-w-2xl relative border-2 border-white mx-2">
        <button
          className="absolute top-12 right-6 sm:top-10 sm:right-10 md:top-14 md:right-16 text-3xl text-white cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-white text-center">
          Delete{" "}
          {dataType === "revenue"
            ? "Revenue"
            : dataType === "sales"
            ? "Sale"
            : "Report"}
        </h2>
        <div className="text-white text-lg mb-8 text-center">
          Are you sure you want to delete{" "}
          <span className="font-bold">{itemName}</span>? This action cannot be
          undone.
        </div>
        <div className="flex gap-4 justify-center">
          <button
            className="bg-[#16113a] text-white border-2 border-white rounded-lg px-6 py-3 font-bold text-lg hover:bg-white hover:text-[#16113a] transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-[#16113a] text-red-400 border-2 border-red-400 rounded-lg px-6 py-3 font-bold text-lg hover:bg-red-400 hover:text-[#16113a] transition-colors"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? <Loader small /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
