function PageWrapper({ children }) {
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-indigo-100 via-blue-100 to-cyan-100
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        text-slate-900 dark:text-slate-100
        transition-colors duration-300
      "
    >
      {children}
    </div>
  );
}

export default PageWrapper;
