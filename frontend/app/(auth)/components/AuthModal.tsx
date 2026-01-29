export default function AuthModal({ modalText }: { modalText: string }) {
  return (
    <dialog id="auth-modal" className="modal backdrop-blur-sm">
      <div className="modal-box md:min-w-3/5 bg-linear-to-br from-base-100 to-base-200 border border-base-300 rounded-3xl shadow-2xl">
        <div className="text-center mb-4">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="m-2 mt-4 md:m-4 lg:mx-6 text-base-content/80">
            {modalText}
          </p>
        </div>
        <div className="modal-action flex justify-center">
          <form method="dialog">
            <button className="btn bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-full px-8">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
