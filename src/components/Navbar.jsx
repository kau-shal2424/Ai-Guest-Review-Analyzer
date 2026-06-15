import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        AI Guest Review Analyzer
      </h1>

      <div className="flex gap-6">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/analyze">Analyze</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>

      <div className="text-xl">
        👤
      </div>
    </nav>
  );
}