import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/fellows", label: "Fellows" },
  { href: "/residency/archive", label: "Residency Archive" },
  { href: "/publications", label: "Publications" },
  { href: "/posts", label: "News & Updates" },
  { href: "/partners", label: "Partners & Supporters" },
  { href: "/contact", label: "Contact" },
];

export default function SiteFooter() {
  return (
    <footer className="px-6 py-12 md:px-16 bg-indigo text-manuscript">
      <h3 className="font-display text-2xl mb-6">From Ilorin to the world.</h3>
      <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
        {FOOTER_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="font-ui text-sm opacity-75">
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="font-mono text-xs opacity-60">
        imodoye.ng · © {new Date().getFullYear()} Imodoye Writers Residency
      </p>
    </footer>
  );
}
