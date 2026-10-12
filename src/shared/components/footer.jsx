import { Link } from "react-router-dom";
import {
  MdLanguage,
  MdLocalShipping,
  MdVerifiedUser,
  MdViewInAr,
} from "react-icons/md";

const LinkGroup = [
  {
    title: "Marketplace",
    links: [
      { label: "About Aura", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Press & Media", to: "/press" },
      { label: "The Aura Journal", to: "/journal" },
    ],
  },
  {
    title: "Customer Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Shipping & Logistics", to: "/shipping" },
      { label: "Returns & Guarantees", to: "/returns" },
      { label: "Track Order Status", to: "/track-order" },
    ],
  },
  {
    title: "Sellers",
    links: [
      { label: "Sell on Aura", to: "/auth/register" },
      { label: "Seller Dashboard", to: "/seller/dashboard" },
      { label: "Merchant Standards", to: "/merchant-standards" },
      { label: "Seller Handbook", to: "/handbook" },
    ],
  },
];

const PAYMENTS = ["Stripe", "Visa", "Mastercard", "Apple Pay"];

function Footer() {
  return (
    <footer className="bg-purple-50/60">
      <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-base text-white">
                <MdViewInAr />
              </span>
              <span className="theme-heading text-base font-bold">Aura</span>
            </Link>

            <p className="theme-muted mt-4 max-w-xs text-xs leading-relaxed">
              The definitive editorial marketplace for authentic craft, high-end
              living, and verified global sellers. Precision-engineered for
              discerning buyers.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-800 shadow-sm ring-1 ring-slate-100">
                <MdVerifiedUser className="text-sm text-indigo-600" />
                100% Escrow Protected
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-800 shadow-sm ring-1 ring-slate-100">
                <MdLocalShipping className="text-sm text-indigo-600" />
                Insured Transit
              </span>
            </div>
          </div>

          {LinkGroup.map((group) => (
            <div key={group.title}>
              <h4 className="theme-heading m-0 text-sm font-semibold">
                {group.title}
              </h4>
              <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
                {group.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-xs text-slate-600 transition-colors hover:text-indigo-700"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-100 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
            <span>
              © {new Date().getFullYear()} Aura Commerce Technologies Inc. All
              rights reserved.
            </span>
            <span className="flex items-center gap-2">
              <Link to="/privacy" className="hover:text-indigo-700">
                Privacy Policy
              </Link>
              <span>·</span>
              <Link to="/terms" className="hover:text-indigo-700">
                Terms of Service
              </Link>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-700 ring-1 ring-slate-100 hover:bg-indigo-50"
            >
              <MdLanguage className="text-sm" />
              EN / USD ($)
            </button>
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-700 ring-1 ring-slate-100"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
