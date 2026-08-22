export default function SiteFooter() {
  return (
    <footer className="px-6 py-12 md:px-16 bg-indigo text-manuscript">
      <h3 className="font-display text-2xl mb-6">From Ilorin to the world.</h3>
      <p className="font-mono text-xs opacity-60">
        imodoye.ng · © {new Date().getFullYear()} Imodoye Writers Residency
      </p>
    </footer>
  );
}
