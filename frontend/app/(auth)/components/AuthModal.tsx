export default function AuthModal({ modalText }: { modalText: string }) {
  return (
    <dialog id="auth-modal" className="modal">
      <div className="modal-box md:min-w-3/5">
        <p className="m-2 mt-4 md:m-4 lg:mx-6">{modalText}</p>
        <div className="modal-action flex justify-center md:justify-end">
          <form method="dialog">
            <button className="btn btn-soft rounded-lg">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
