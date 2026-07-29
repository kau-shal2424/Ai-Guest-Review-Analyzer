import { Link } from "react-router-dom";

const footerLinks = [
  {
    heading: "Support",
    links: [
      { label: "Help Center", to: "/user/help" },
      { label: "AirCover Protection", to: "#" },
      { label: "Anti-discrimination", to: "#" },
      { label: "Disability support", to: "#" },
    ],
  },
  {
    heading: "Hosting",
    links: [
      { label: "Airbnb your home", to: "#" },
      { label: "AirCover for Hosts", to: "#" },
      { label: "Hosting resources", to: "#" },
      { label: "Community forum", to: "#" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Analyze Reviews", to: "/user/analyze" },
      { label: "Guest Insights", to: "/user/insights" },
      { label: "Reports & BI", to: "/user/reports" },
      { label: "Dashboard", to: "/user/dashboard" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Newsroom", to: "#" },
      { label: "New features", to: "#" },
      { label: "Careers", to: "#" },
      { label: "Investors", to: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#F7F7F7] dark:bg-[#1a1a1a] text-[#222222] dark:text-white border-t border-[#EBEBEB] dark:border-[#333333]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
        {/* Link Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-[#EBEBEB] dark:border-[#333333]">
          {footerLinks.map((section) => (
            <div key={section.heading} className="flex flex-col gap-3 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] dark:text-white">
                {section.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-xs font-normal text-[#717171] hover:text-[#222222] dark:hover:text-white hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sub-footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#717171] font-normal">
          <div className="flex flex-wrap items-center gap-2">
            <span>© 2026 AI Guest Review Analyzer, Inc.</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Sitemap</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-[#222222] dark:text-white">🌐 English (IN)</span>
            <span className="font-semibold text-[#222222] dark:text-white">₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
