import { useNavigate } from "react-router-dom";

function DashboardCard({ title, description, route }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      className="
        cursor-pointer
        bg-white dark:bg-slate-800
        p-6 rounded-2xl shadow
        hover:shadow-lg transition
        border border-slate-200 dark:border-slate-700
      "
    >
      <h3 className="text-xl font-bold mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default DashboardCard;
