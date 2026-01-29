import { showModal } from "@/app/helpers/modal-manager";

export default function modalAlert(text: string, setText?: any) {
  if (setText) {
    setText(text);
  }
  showModal({
    message: text,
    type: "info",
    onConfirm: () => {},
  });
}
