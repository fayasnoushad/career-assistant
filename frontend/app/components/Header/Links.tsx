import Link from "next/link";

export default function Links() {
  return (
    <ul
      tabIndex={-1}
      className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 border-(length:--border) border-white/5 shadow-2xl outline-(length:--border) outline-black/5"
    >
      <Link
        href="/careers/"
        className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
      >
        Jobs or Courses
      </Link>
      <Link
        href="/saved-jobs"
        className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
      >
        Saved Jobs
      </Link>
      <Link
        href="/saved-courses"
        className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
      >
        Saved Courses
      </Link>
      <Link
        href="/saved-roadmaps"
        className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
      >
        Saved Roadmaps
      </Link>
      <Link
        href="/settings"
        className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
      >
        Settings
      </Link>
      <Link
        href="/logout"
        className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
      >
        Logout
      </Link>
    </ul>
  );
}
