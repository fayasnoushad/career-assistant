export default function SelectDialog() {
  return (
    <dialog id="select-something-modal" className="modal">
      <div className="modal-box">
        <p className="py-4 text-lg">Select something to get result!</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
