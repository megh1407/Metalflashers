const badge = (status) => {
  if (status === "Present") return "bg-green-100 text-green-700";
  if (status === "Absent") return "bg-red-100 text-red-700";
  if (status === "Late") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-600";
};

function AttendanceTable({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-700">
          <tr>
            <th className="px-5 py-3 text-left">Student ID</th>
            <th className="px-5 py-3 text-left">Subject</th>
            <th className="px-5 py-3 text-left">Location</th>
            <th className="px-5 py-3 text-left">Date</th>
            <th className="px-5 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr
              key={i}
              className="border-t hover:bg-blue-50 dark:hover:bg-slate-700"
            >
              <td className="px-5 py-3">{r.student_id}</td>
              <td className="px-5 py-3">{r.subject}</td>
              <td className="px-5 py-3">{r.location}</td>
              <td className="px-5 py-3">{r.date}</td>
              <td className="px-5 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(r.status)}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;
