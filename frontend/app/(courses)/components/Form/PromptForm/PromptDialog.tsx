export default function PromptDialog() {
  return (
    <dialog id="write-something-modal" className="modal">
      <div className="modal-box">
        <p className="py-4 text-lg">Write something to get result!</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
