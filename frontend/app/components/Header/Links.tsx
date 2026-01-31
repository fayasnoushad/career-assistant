import Link from "next/link";

export default function Links() {
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/careers/", label: "Jobs or Courses", icon: "🎯" },
    { href: "/resume", label: "Resume Analysis", icon: "📄" },
    { href: "/saved-jobs", label: "Saved Jobs", icon: "💼" },
    { href: "/saved-courses", label: "Saved Courses", icon: "📚" },
    { href: "/saved-roadmaps", label: "Saved Roadmaps", icon: "🗺️" },
    { href: "/saved-resumes", label: "Saved Resumes", icon: "📋" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
    { href: "/logout", label: "Logout", icon: "🚪" },
  ];

  return (
    <ul
      tabIndex={-1}
      className="menu dropdown-content bg-base-100/95 backdrop-blur-lg rounded-2xl z-50 mt-4 w-56 p-3 border border-base-300 shadow-2xl animate-scaleIn"
    >
      {links.map((link, index) => (
        <li key={index} className="mb-1">
          <Link
            href={link.href}
            className="font-semibold p-3 rounded-xl hover:bg-linear-to-r hover:from-purple-500/10 hover:to-blue-500/10 hover:text-purple-600 transition-all duration-300 flex items-center gap-3"
          >
            <span className="text-xl">{link.icon}</span>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
