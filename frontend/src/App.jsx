import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MenuPage from "./components/MenuPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Halaman Login */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Halaman Dashboard */}
        <Route path="/" element={<MenuPage />} /> {/* Halaman daftar menu */}
      </Routes>
    </Router>
  );
}

export default App;
