export default function Pending() {
  return (
    <div className="py-[25vh] text-2xl text-center">
      Account verification is pending. <br />
      Please verify your email by clicking the link in the email we sent.
      <br />
      <br />
      <span className="loading loading-bars loading-xl"></span>
    </div>
  );
}
