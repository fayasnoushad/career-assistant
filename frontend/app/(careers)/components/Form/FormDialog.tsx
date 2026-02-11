export default function Dialog() {
  return (
    <dialog
      id="form-dialog-modal"
      className="modal modal-middle backdrop-blur-sm"
    >
      <div className="modal-box bg-base-100 border border-base-300 rounded-2xl shadow-lg">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={(e) => {
            const dialog = document.getElementById(
              "form-dialog-modal",
            ) as HTMLDialogElement;
            dialog?.close();
          }}
        >
          ✕
        </button>
        <div className="text-center py-6">
          <div className="text-6xl mb-4">✏️</div>
          <h3 className="font-bold text-xl text-base-content mb-2">
            Input Required
          </h3>
          <p className="text-base-content/70 text-sm">
            Please enter something to get started!
          </p>
        </div>
        <div className="modal-action justify-center gap-3">
          <form method="dialog" className="w-full">
            <button className="btn btn-primary btn-sm w-full rounded-lg">
              Got it
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
