import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/catalogue", label: "Catalogue" },
  { to: "/studio", label: "AI Studio" },
  { to: "/craft-explorer", label: "Craft Explorer" },
  { to: "/customiser", label: "Customiser" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/orders", label: "Orders" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-maroon-100">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display text-maroon-600">Kraft</span>
          <span className="text-2xl font-display text-gold-500">Wear</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full text-sm font-medium transition ${
                  isActive
                    ? "bg-maroon-600 text-white"
                    : "text-maroon-700 hover:bg-maroon-50"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <Link to="/studio" className="md:hidden kw-btn-primary text-sm py-1.5 px-4">
          Studio
        </Link>
      </nav>
    </header>
  );
}
