import { Link, useLocation } from "react-router-dom";

function Navbar({ dark, toggleTheme }) {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-3 py-1 rounded transition
     ${
       pathname === path
         ? "text-blue-600 dark:text-blue-400 font-semibold"
         : "text-slate-700 dark:text-slate-300 hover:text-blue-500"
     }`;

  return (
    <header
      className="
        sticky top-0 z-50
        bg-white/80 dark:bg-slate-900/80
        backdrop-blur
        border-b border-slate-200 dark:border-slate-700
      "
    >
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg text-slate-800 dark:text-white">
          Metal  <span className="text-#8e8aba-600">Flashers</span>
        </h1>

        <nav className="space-x-4">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/attendance" className={linkClass("/attendance")}>Attendance</Link>
          <Link to="/admin" className={linkClass("/admin")}>Admin</Link>
        <Link to="/class-attendance" className={linkClass("/class-attendance")}>Attendance Summary</Link>

        </nav>

        <button
          onClick={toggleTheme}
          className="
            px-3 py-1 rounded
            bg-slate-200 dark:bg-slate-700
            text-slate-800 dark:text-slate-100
            hover:bg-slate-300 dark:hover:bg-slate-600
            transition
          "
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
