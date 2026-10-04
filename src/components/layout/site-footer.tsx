import Link from "next/link";

const cols = [
  { h: "Explore Services", links: [["All Services", "/services"], ["Search", "/search"], ["How It Works", "/how-it-works"], ["Become a Provider", "/become-a-provider"]] },
  { h: "Popular Categories", links: [["Home Repair", "/categories/home-repair"], ["Cleaning", "/categories/cleaning"], ["AC Repair", "/categories/ac-repair"], ["IT & Technology", "/categories/it"]] },
  { h: "For Professionals", links: [["Join as Provider", "/become-a-provider"], ["Provider Login", "/login"], ["Success Stories", "/how-it-works"]] },
  { h: "About & Help", links: [["Help Center", "/how-it-works"], ["Contact", "/how-it-works"], ["Terms of Service", "/how-it-works"], ["Privacy Policy", "/how-it-works"]] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#2563EB] text-lg font-bold text-white">F</span>
            <span className="text-lg font-bold">Fixora</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-[#64748B]">
            Find Trusted Professionals. Get Things Done. Home repairs, cleaning, and everyday services across Bangladesh.
          </p>
          <p className="mt-3 text-xs text-[#94A3B8]">Demo prototype — all listings, prices & reviews are sample data.</p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <h4 className="text-sm font-semibold text-[#0F172A]">{c.h}</h4>
            <ul className="mt-3 space-y-2">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-[#64748B] hover:text-[#2563EB]">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[#E2E8F0]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-[#64748B] sm:flex-row sm:px-6">
          <span>© 2026 Fixora. Frontend prototype for demonstration.</span>
          <span>Payments: bKash · Nagad · Rocket · Card · Cash (simulated)</span>
        </div>
      </div>
    </footer>
  );
}
