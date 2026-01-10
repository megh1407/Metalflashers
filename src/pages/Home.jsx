import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Attendance Search",
      desc: "Search individual student attendance records",
      route: "/attendance",
      stat: "Advanced filters",
      count: "Search",
      icon: "🔍",
    },
    {
      title: "Class Attendance",
      desc: "View present and absent students for a class",
      route: "/class-attendance",
      stat: "Auto detection",
      count: "Class",
      icon: "🧑‍🎓",
    },
    {
      title: "Admin Panel",
      desc: "Manage lectures and attendance records",
      route: "/admin",
      stat: "Full control",
      count: "Admin",
      icon: "⚙️",
    },
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto p-10">

        {/* 🌟 WELCOME BANNER */}
        <div className="
          mb-10 rounded-2xl p-6
          bg-gradient-to-r from-blue-600 to-indigo-600
          text-white shadow-lg
        ">
          <h1 className="text-3xl font-bold mb-1">
            Welcome to Attendance System
          </h1>
          <p className="text-white/90">
            Manage attendance efficiently with real-time insights
          </p>
        </div>

        {/* 📊 DASHBOARD CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map(card => (
            <div
              key={card.title}
              role="button"
              tabIndex={0}
              onClick={() => navigate(card.route)}
              onKeyDown={e => e.key === "Enter" && navigate(card.route)}
              className="
                group cursor-pointer
                h-full flex flex-col justify-between
                rounded-2xl p-6
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-2xl

                /* Light mode */
                bg-gradient-to-br from-white via-slate-50 to-slate-100
                border border-slate-200

                /* Dark mode */
                dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-800 dark:to-slate-700
                dark:border-slate-700
              "
            >
              {/* ICON + COUNT */}
              <div className="flex items-center justify-between mb-4">
                <div className="
                  text-3xl w-12 h-12 flex items-center justify-center
                  rounded-xl
                  bg-blue-100 text-blue-600
                  dark:bg-blue-900 dark:text-blue-300
                  group-hover:scale-110 transition
                ">
                  {card.icon}
                </div>

                <span className="
                  text-xs font-semibold px-3 py-1 rounded-full
                  bg-slate-200 text-slate-700
                  dark:bg-slate-700 dark:text-slate-200
                ">
                  {card.count}
                </span>
              </div>

              {/* TITLE */}
              <h3 className="
                text-xl font-semibold mb-2
                text-slate-800 dark:text-slate-100
                group-hover:text-blue-600 dark:group-hover:text-blue-400
                transition
              ">
                {card.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-slate-600 dark:text-slate-400 text-sm flex-grow">
                {card.desc}
              </p>

              {/* STAT */}
              <p className="
                mt-4 text-sm
                text-slate-500 dark:text-slate-400
              ">
                • {card.stat}
              </p>

              {/* ACTION */}
              <div className="
                mt-6 text-sm font-medium
                text-blue-600 dark:text-blue-400
                group-hover:translate-x-1 transition
              ">
                Open →
              </div>

              {/* 🌈 HOVER GLOW EFFECT */}
              <div className="
                absolute inset-0 rounded-2xl opacity-0
                group-hover:opacity-100 transition
                bg-gradient-to-r from-blue-500/10 to-indigo-500/10
                pointer-events-none
              " />
            </div>
          ))}
        </div>

      </div>
    </PageWrapper>
  );
}

export default Home;
