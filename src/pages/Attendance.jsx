import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useState } from "react";
import AttendanceTable from "../components/AttendanceTable";
import PageWrapper from "../components/PageWrapper";

/* 🔹 millis → readable date */
function formatDateTime(ms) {
  if (!ms) return "N/A";
  return new Date(ms).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Attendance() {
  const [filters, setFilters] = useState({
    student_id: "",
    subject: "",
    location: "",
    status: "",
    date: "",
  });

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 🔍 SEARCH ATTENDANCE */
  const searchAttendance = async () => {
    setLoading(true);
    setRecords([]);

    try {
      const snap = await getDocs(collection(db, "attendance_logs"));

      const data = snap.docs
        .map(doc => {
          const d = doc.data();
          return {
            ...d,
            formattedDate: formatDateTime(d.entry_time),
            rawDate: new Date(d.entry_time),
          };
        })
        .filter(r =>
          (!filters.student_id || r.student_id?.includes(filters.student_id)) &&
          (!filters.subject || r.subject?.toLowerCase().includes(filters.subject.toLowerCase())) &&
          (!filters.location || r.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
          (!filters.status || r.status?.toLowerCase() === filters.status.toLowerCase()) &&
          (!filters.date || r.rawDate.toISOString().slice(0, 10) === filters.date)
        );

      setRecords(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching attendance");
    }

    setLoading(false);
  };

  /* 📤 EXPORT CSV */
  const exportCSV = () => {
    if (records.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Student ID", "Subject", "Location", "Date", "Status"];

    const rows = records.map(r => [
      r.student_id,
      r.subject,
      r.location,
      r.formattedDate,
      r.status,
    ]);

    const csv =
      [headers, ...rows].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance_report.csv";
    link.click();
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto p-10">
        <h2 className="text-3xl font-bold mb-6">Attendance Search</h2>

        {/* 🔍 FILTERS */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          {Object.keys(filters).map(key => (
            <input
              key={key}
              type={key === "date" ? "date" : "text"}
              placeholder={key.toUpperCase()}
              value={filters[key]}
              onChange={e =>
                setFilters({ ...filters, [key]: e.target.value })
              }
              className="
                p-3 rounded-xl border
                bg-white dark:bg-slate-800
                text-slate-800 dark:text-slate-100
                border-slate-300 dark:border-slate-600
                placeholder-slate-400
              "
            />
          ))}
        </div>

        {/* 🔘 ACTION BUTTONS */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={searchAttendance}
            className="
              bg-blue-600 text-white px-6 py-3 rounded-xl
              font-semibold hover:bg-blue-500 transition
            "
          >
            Search
          </button>

          <button
            onClick={exportCSV}
            className="
              bg-emerald-600 text-white px-6 py-3 rounded-xl
              font-semibold hover:bg-emerald-500 transition
            "
          >
            Export CSV
          </button>
        </div>

        {loading && (
          <p className="text-blue-600 font-medium">Loading...</p>
        )}

        {!loading && records.length === 0 && (
          <p className="text-slate-600 dark:text-slate-400 mt-6">
            No attendance records found.
          </p>
        )}

        {records.length > 0 && (
          <AttendanceTable
            data={records.map(r => ({
              ...r,
              date: r.formattedDate,
            }))}
          />
        )}
      </div>
    </PageWrapper>
  );
}

export default Attendance;
