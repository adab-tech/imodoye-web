// Same reasoning as app/admin/layout.tsx — session/account state must
// never be served from a stale cached fetch.
export const fetchCache = "force-no-store";

export default function AccountRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
