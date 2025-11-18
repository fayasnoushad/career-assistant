import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-base-300 min-h-[10vh] flex flex-col justify-center items-center text-center text-sm">
      <Link href="https://www.gnu.org/licenses/gpl-3.0.html" target="_block">
        Copyright &copy; Career Assistant
        <br />
        GNU General Public License v3 (GNU GPL v3)
      </Link>
    </footer>
  );
}
