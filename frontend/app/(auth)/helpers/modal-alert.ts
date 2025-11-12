export default function modalAlert(text: string, setText: any) {
  setText(text);
  const modal = document.getElementById("auth-modal");
  if (modal) (modal as HTMLDialogElement).showModal();
}
