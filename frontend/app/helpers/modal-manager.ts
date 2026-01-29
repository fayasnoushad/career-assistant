export interface ModalConfig {
  title?: string;
  message: string;
  type?: "success" | "error" | "info" | "warning" | "confirm";
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const showModal = (config: ModalConfig) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("universal-modal:show", { detail: config }),
  );
};

export const closeModal = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("universal-modal:close"));
};
