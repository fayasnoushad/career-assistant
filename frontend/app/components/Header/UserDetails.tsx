import Link from "next/link";

export default function UserDetails() {
  return (
    <div className="dropdown dropdown-end cursor-pointer">
      <div className="avatar" tabIndex={0} role="button">
        <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2 hover:opacity-[0.8]">
          <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
        </div>
      </div>
      <ul
        tabIndex={-1}
        className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 border-(length:--border) border-white/5 shadow-2xl outline-(length:--border) outline-black/5 "
      >
        <Link href="/careers/" className="btn btn-ghost rounded-lg">
          Jobs or Courses
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
    </div>
  );
}
