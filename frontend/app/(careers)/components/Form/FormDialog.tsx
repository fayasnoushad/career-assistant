export default function Dialog() {
  return (
    <dialog id="form-dialog-modal" className="modal backdrop-blur-sm">
      <div className="modal-box bg-linear-to-br from-base-100 to-base-200 border border-base-300 rounded-3xl shadow-2xl">
        <div className="text-center mb-4">
          <div className="text-5xl mb-4">✏️</div>
          <p className="py-4 text-lg font-medium text-base-content/80">
            Please enter something to get started!
          </p>
        </div>
        <div className="modal-action justify-center">
          <form method="dialog">
            <button className="btn bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-full px-8">
              Got it
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
