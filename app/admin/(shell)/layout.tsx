import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/review", label: "Editorial Review" },
  { href: "/admin/issues", label: "Issues" },
  { href: "/admin/fellows", label: "Fellows" },
  { href: "/admin/cohorts", label: "Residency Archive" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/publications", label: "Publications" },
];

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen flex bg-manuscript">
      <aside className="w-56 shrink-0 border-r border-ink/10 px-5 py-6 flex flex-col">
        <Link href="/admin" className="font-display text-lg mb-8">
          IMODOYE <span className="font-mono text-xs opacity-50">ADMIN</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-ui text-sm px-3 py-2 rounded-sm opacity-75 hover:opacity-100 hover:bg-ink/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-ink/10">
          <p className="font-ui text-sm mb-1">{session?.user?.name}</p>
          <p className="font-mono text-xs opacity-50 mb-3">{session?.user?.role}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button type="submit" className="font-ui text-xs opacity-60 underline">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-8 py-8 max-w-4xl">{children}</main>
    </div>
  );
}
