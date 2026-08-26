import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut, ADMIN_ROLES, OWNER_ROLES } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/review", label: "Editorial Review" },
  { href: "/admin/issues", label: "Issues" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/fellows", label: "Fellows" },
  { href: "/admin/cohorts", label: "Residency Archive" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/publications", label: "Publications" },
];

const OWNER_NAV_ITEMS = [
  { href: "/admin/team", label: "Team" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // A fellow/public account can authenticate (accounts are shared across
  // /admin and /account now), but only admin roles may actually see /admin.
  if (!session?.user || !ADMIN_ROLES.includes(session.user.role as (typeof ADMIN_ROLES)[number])) {
    redirect("/admin/login");
  }
  const isOwner = OWNER_ROLES.includes(session.user.role as (typeof OWNER_ROLES)[number]);

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
          {isOwner && (
            <>
              <div className="my-2 border-t border-ink/10" />
              {OWNER_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-ui text-sm px-3 py-2 rounded-sm opacity-75 hover:opacity-100 hover:bg-ink/5"
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
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
