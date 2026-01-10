import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import * as XLSX from "xlsx";

/* 🔹 Predefined class students */
const CLASS_STUDENTS = [
  1011, 1012, 1013, 1014, 1015,
  1016, 1017, 1018, 1019, 1020
];

/* millis → yyyy-mm-dd */
const getDateOnly = ms =>
  new Date(ms).toISOString().slice(0, 10);

function ClassAttendance() {
  const [filters, setFilters] = useState({
    subject: "",
    location: "",
    date: "",
  });

  const [summary, setSummary] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 🔍 GENERATE SUMMARY + LIST */
  const generateAttendance = async () => {
    if (!filters.subject || !filters.location || !filters.date) {
      alert("Please select subject, location and date");
      return;
    }

    setLoading(true);
    setSummary(null);
    setList([]);

    try {
      const snap = await getDocs(collection(db, "attendance_logs"));

      const presentRecords = snap.docs
        .map(d => d.data())
        .filter(r =>
          r.subject === filters.subject &&
          r.location === filters.location &&
          getDateOnly(r.entry_time) === filters.date &&
          r.status?.toLowerCase() === "present"
        );

      const presentIds = presentRecords.map(r =>
        Number(r.student_id)
      );

      const attendanceList = CLASS_STUDENTS
        .sort((a, b) => a - b)
        .map(id => ({
          student_id: id,
          subject: filters.subject,
          status: presentIds.includes(id) ? "Present" : "Absent",
          date: filters.date,
        }));

      const totalStudents = CLASS_STUDENTS.length;
      const totalPresent = presentIds.length;
      const totalAbsent = totalStudents - totalPresent;
      const percentage = (
        (totalPresent / totalStudents) * 100
      ).toFixed(2);

      setSummary({
        totalStudents,
        totalPresent,
        totalAbsent,
        percentage,
      });

      setList(attendanceList);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance");
    }

    setLoading(false);
  };

  /* 📥 DOWNLOAD EXCEL */
  const downloadExcel = () => {
    if (list.length === 0) {
      alert("No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(list);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Class Attendance"
    );

    XLSX.writeFile(
      workbook,
      `Class_Attendance_${filters.subject}_${filters.date}.xlsx`
    );
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto p-10">
        <h2 className="text-3xl font-bold mb-6">
          Class Attendance
        </h2>

        {/* 🔍 FILTERS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <select
            value={filters.subject}
            onChange={e =>
              setFilters({ ...filters, subject: e.target.value })
            }
            className="p-3 rounded-xl border bg-white dark:bg-slate-800"
          >
            <option value="">SELECT SUBJECT</option>
            <option value="Maths">Maths</option>
            <option value="Physics">Physics</option>
          </select>

          <input
            placeholder="LOCATION"
            value={filters.location}
            onChange={e =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="p-3 rounded-xl border bg-white dark:bg-slate-800"
          />

          <input
            type="date"
            value={filters.date}
            onChange={e =>
              setFilters({ ...filters, date: e.target.value })
            }
            className="p-3 rounded-xl border bg-white dark:bg-slate-800"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={generateAttendance}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Generate Attendance
          </button>

          {list.length > 0 && (
            <button
              onClick={downloadExcel}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Download Excel
            </button>
          )}
        </div>

        {loading && (
          <p className="mt-6 text-blue-600 font-medium">
            Loading attendance...
          </p>
        )}

        {/* 📊 SUMMARY */}
        {summary && (
          <>
            
            <div className="grid md:grid-cols-4 gap-6 mt-6">
              <SummaryCard label="Total Students" value={summary.totalStudents} color="text-white-600"/>
              <SummaryCard label="Present" value={summary.totalPresent} color="text-green-600" />
              <SummaryCard label="Absent" value={summary.totalAbsent} color="text-red-500" />
              <SummaryCard label="Attendance %" value={`${summary.percentage}%`} color="text-blue-600" />
            </div>
          </>
        )}

        {/* 📋 LIST */}
        {list.length > 0 && (
          <table className="w-full mt-10 border rounded-xl overflow-hidden">
            <thead className="bg-slate-200 dark:bg-slate-700">
              <tr>
                <th className="p-3 text-left">Student ID</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r.student_id} className="border-t">
                  <td className="p-3">{r.student_id}</td>
                  <td className="p-3">{r.subject}</td>
                  <td className={`p-3 font-semibold ${r.status === "Present" ? "text-green-600" : "text-red-500"}`}>
                    {r.status}
                  </td>
                  <td className="p-3">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageWrapper>
  );
}

/* 🔹 Summary Card */
function SummaryCard({ label, value, color = "text-slate-800" }) {
  return (
    <div className="bg-white dark:bg-slate-800 border rounded-xl p-6 text-center shadow">
      <p className="text-sm text-slate-500 mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default ClassAttendance;
