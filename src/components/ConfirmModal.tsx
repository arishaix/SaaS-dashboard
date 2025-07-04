import React from "react";
import Loader from "./Loader";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: React.ReactNode;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  loading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[#16113a] rounded-2xl shadow-lg p-6 sm:p-10 md:p-14 w-full max-w-md relative border-2 border-white mx-2">
        <button
          className="absolute top-4 right-6 sm:top-8 sm:right-10 md:top-13 md:right-16 text-3xl text-white cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-white text-center">
          {title}
        </h2>
        <div className="text-white text-lg mb-8 text-center">{message}</div>
        <div className="flex gap-4 justify-center">
          <button
            className="bg-[#16113a] text-[#0fd354] border-2 border-[#0fd354] rounded-lg px-6 py-3 font-bold text-lg hover:bg-[#0fd354] hover:text-[#16113a] transition-colors"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader small /> : confirmText}
          </button>
          <button
            className="bg-white text-[#16113a] border-2 border-[#16113a] rounded-lg px-6 py-3 font-bold text-lg hover:bg-[#16113a] hover:text-white transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
