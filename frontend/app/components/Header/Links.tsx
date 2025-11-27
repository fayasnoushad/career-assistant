import Link from "next/link";

export default function Links() {
  return (
    <ul
      tabIndex={-1}
      className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 border-(length:--border) border-white/5 shadow-2xl outline-(length:--border) outline-black/5 "
    >
      <Link href="/careers/" className="btn btn-ghost rounded-lg">
        Jobs or Courses
      </Link>
      <Link href="/saved-jobs" className="btn btn-ghost rounded-lg">
        Saved Jobs
      </Link>
      <Link href="/saved-courses" className="btn btn-ghost rounded-lg">
        Saved Courses
      </Link>
      <Link href="/saved-roadmaps" className="btn btn-ghost rounded-lg">
        Saved Roadmaps
      </Link>
      <Link href="/settings" className="btn btn-ghost rounded-lg">
        Settings
      </Link>
      <Link href="/logout" className="btn btn-ghost rounded-lg">
        Logout
      </Link>
    </ul>
  );
}
