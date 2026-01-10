import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Attendance from "./pages/Attendance";
import Admin from "./pages/Admin";
import ClassAttendance from "./pages/ClassAttendance";


function App() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <BrowserRouter>
      <Navbar dark={dark} toggleTheme={() => setDark(!dark)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/class-attendance"element={<ClassAttendance />
      }
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
