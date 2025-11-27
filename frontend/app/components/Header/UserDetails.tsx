import Link from "next/link";
import Links from "./Links";

export default function UserDetails() {
  return (
    <div className="dropdown dropdown-end cursor-pointer">
      <div className="avatar" tabIndex={0} role="button">
        <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2 hover:opacity-[0.8]">
          <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
        </div>
      </div>
      <Links />
    </div>
  );
}
