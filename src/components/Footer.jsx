export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

        <div>
          <h2 className="font-bold text-lg">
            AI Guest Review Analyzer
          </h2>
          <p className="text-sm text-gray-400">
            AI-powered hospitality review insights.
          </p>
        </div>

        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">GitHub</a>
        </div>

        <div className="mt-4 md:mt-0">
          <span>🌐</span>
          <span className="ml-3">💼</span>
          <span className="ml-3">📧</span>
        </div>
      </div>

      <p className="text-center text-gray-400 text-sm mt-4">
        © 2026 AI Guest Review Analyzer. All Rights Reserved.
      </p>
    </footer>
  );
}