import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useState } from "react";
import PageWrapper from "../components/PageWrapper";

/* 🔹 millis → readable date */
function formatDateTime(ms) {
  if (!ms) return "N/A";
  return new Date(ms).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const inputClass = `
  w-full p-3 rounded-xl border
  bg-white dark:bg-slate-800
  text-slate-800 dark:text-slate-100
  border-slate-300 dark:border-slate-600
  placeholder-slate-400 dark:placeholder-slate-400
  focus:outline-none focus:ring-2 focus:ring-blue-500
  transition
`;

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [filters, setFilters] = useState({
    student_id: "",
    location: "",
    date: "",
  });

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (
      email === import.meta.env.VITE_ADMIN_EMAIL &&
      password === import.meta.env.VITE_ADMIN_PASSWORD
    ) {
      setIsAdmin(true);
      setPassword("");
    } else {
      alert("Invalid credentials");
    }
  };

  const searchLiveLocations = async () => {
    setLoading(true);
    setLocations([]);

    try {
      const snap = await getDocs(collection(db, "live_locations"));

      const data = snap.docs
        .map(doc => {
          const d = doc.data();
          return {
            ...d,
            rawDate: new Date(d.last_seen),
          };
        })
        .filter(r =>
          (!filters.student_id || r.student_id?.includes(filters.student_id)) &&
          (!filters.location || r.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
          (!filters.date || r.rawDate.toISOString().slice(0, 10) === filters.date)
        );

      setLocations(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching live locations");
    }

    setLoading(false);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto p-10">
        {!isAdmin ? (
          /* 🔐 ADMIN LOGIN */
          <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Admin Login
            </h2>

            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} mt-4`}
            />

            <button
              onClick={login}
              className="
                w-full mt-6 bg-blue-600 text-white
                py-3 rounded-xl font-semibold
                hover:bg-blue-500 transition
              "
            >
              Login
            </button>
          </div>
        ) : (
          /* 📍 LIVE LOCATION SEARCH */
          <>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Live Location Search
            </h2>

            {/* 🔍 Filters */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <input
                placeholder="Student ID"
                value={filters.student_id}
                onChange={(e) =>
                  setFilters({ ...filters, student_id: e.target.value })
                }
                className={inputClass}
              />

              <input
                placeholder="Location"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className={inputClass}
              />

              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <button
              onClick={searchLiveLocations}
              className="
                bg-blue-600 text-white px-6 py-3 rounded-xl
                font-semibold hover:bg-blue-500 transition mb-6
              "
            >
              Search
            </button>

            {loading && (
              <p className="text-blue-600 font-medium">
                Loading live locations...
              </p>
            )}

            {/* 📍 RESULT CARDS */}
            <div className="grid md:grid-cols-3 gap-6">
              {locations.map((loc, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800
                             text-slate-800 dark:text-slate-100
                             p-6 rounded-2xl shadow-xl"
                >
                  <p><b>Student ID:</b> {loc.student_id}</p>
                  <p><b>Location:</b> {loc.location}</p>
                  <p><b>Last Seen:</b> {formatDateTime(loc.last_seen)}</p>
                </div>
              ))}
            </div>

            {!loading && locations.length === 0 && (
              <p className="text-slate-600 dark:text-slate-400 mt-10">
                No live location records found.
              </p>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}

export default Admin;
