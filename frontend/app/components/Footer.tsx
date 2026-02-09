import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-200/50 backdrop-blur-md text-base-content/80 min-h-[10vh] p-6 border-t border-base-300 mt-auto">
      <aside className="space-y-2">
        <Link
          href="https://www.gnu.org/licenses/agpl-3.0.en.html"
          target="_blank"
          className="hover:text-purple-600 transition-colors duration-300"
        >
          <div className="font-semibold">
            Copyright &copy; {new Date().getFullYear()} - Career Assistant
          </div>
          <div className="text-sm text-base-content/60">
            GNU Affero General Public License v3 (GNU AGPL v3)
          </div>
        </Link>
      </aside>
    </footer>
  );
}
