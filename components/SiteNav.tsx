import Link from "next/link";

const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/residency", label: "Residency" },
  { href: "/fellows", label: "Fellows" },
  { href: "/review", label: "Imodoye Review" },
];

export default function SiteNav() {
  return (
    <header className="flex items-center justify-between px-6 py-5 border-b border-ink/10 bg-manuscript">
      <Link href="/" className="flex items-center gap-3">
        <svg width="26" height="26" viewBox="0 0 28 28" aria-hidden="true">
          <circle cx="14" cy="14" r="10" fill="none" stroke="#263B73" strokeWidth="2" />
          <path d="M14 5 A9 9 0 0 1 23 14" fill="none" stroke="#C99A3D" strokeWidth="2" strokeLinecap="round" />
          <rect x="12.5" y="9" width="3" height="10" rx="1" fill="#B85C38" />
        </svg>
        <span className="font-display text-lg text-ink">IMODOYE</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="text-sm text-ink/75 font-ui">
            {item.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/account"
        className="text-sm px-4 py-2 border border-indigo text-indigo rounded-sm font-ui"
      >
        Sign in
      </Link>
    </header>
  );
}
