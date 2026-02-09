"use client";
import { useState, useEffect, useRef } from "react";
import { ModalConfig } from "@/app/helpers/modal-manager";

const iconMap = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
  warning: "⚠️",
  confirm: "❓",
};

const colorMap = {
  success: "from-green-500/10 to-emerald-500/10 border-green-500/20",
  error: "from-red-500/10 to-rose-500/10 border-red-500/20",
  info: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
  warning: "from-yellow-500/10 to-orange-500/10 border-yellow-500/20",
  confirm: "from-purple-500/10 to-blue-500/10 border-purple-500/20",
};

const buttonColorMap = {
  success:
    "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
  error: "from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700",
  info: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
  warning:
    "from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700",
  confirm:
    "from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
};

export default function UniversalModal() {
  const [config, setConfig] = useState<ModalConfig | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const handleShow = (event: Event) => {
      const customEvent = event as CustomEvent<ModalConfig>;
      setConfig(customEvent.detail);
      dialogRef.current?.showModal();
    };

    const handleClose = () => {
      dialogRef.current?.close();
    };

    window.addEventListener("universal-modal:show", handleShow);
    window.addEventListener("universal-modal:close", handleClose);

    return () => {
      window.removeEventListener("universal-modal:show", handleShow);
      window.removeEventListener("universal-modal:close", handleClose);
    };
  }, []);

  const type = config?.type || "info";
  const icon = iconMap[type];

  const handleConfirm = () => {
    if (config?.onConfirm) config.onConfirm();
    dialogRef.current?.close();
  };

  const handleCancel = () => {
    if (config?.onCancel) config.onCancel();
    dialogRef.current?.close();
  };

  return (
    <dialog
      id="universal-modal"
      ref={dialogRef}
      className="modal backdrop-blur-sm"
    >
      <div
        className={`modal-box bg-linear-to-br ${colorMap[type]} border border-base-300 rounded-3xl shadow-2xl max-w-md animate-scaleIn`}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">{icon}</div>
          {config?.title && (
            <h3 className="font-bold text-xl text-base-content mb-2">
              {config.title}
            </h3>
          )}
          <p className="text-base-content/80">{config?.message || ""}</p>
        </div>

        <div className="modal-action justify-center gap-3">
          {type === "confirm" ? (
            <>
              <button
                onClick={handleCancel}
                className="btn btn-outline btn-sm md:btn-md rounded-full border-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`btn btn-sm md:btn-md text-white border-0 rounded-full bg-linear-to-r ${buttonColorMap[type]}`}
              >
                Confirm
              </button>
            </>
          ) : (
            <button
              onClick={handleConfirm}
              className={`btn btn-sm md:btn-md text-white border-0 rounded-full bg-linear-to-r ${buttonColorMap[type]}`}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
