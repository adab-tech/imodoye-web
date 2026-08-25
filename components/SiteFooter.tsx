import Link from "next/link";
import { subscribeToNewsletter } from "@/app/subscribe/actions";

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

      <form action={subscribeToNewsletter} className="flex flex-wrap gap-2 mb-10 max-w-sm">
        <input
          name="email"
          type="email"
          required
          placeholder="Your email"
          className="flex-1 min-w-0 px-3 py-2 rounded-sm bg-manuscript/10 border border-manuscript/25 font-ui text-sm placeholder:text-manuscript/50"
        />
        <button type="submit" className="font-ui text-sm px-4 py-2 bg-terracotta text-paper rounded-sm">
          Subscribe
        </button>
      </form>

      <p className="font-mono text-xs opacity-60">
        imodoye.ng · © {new Date().getFullYear()} Imodoye Writers Residency
      </p>
    </footer>
  );
}
