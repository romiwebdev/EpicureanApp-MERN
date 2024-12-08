import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MenuPage from "./components/MenuPage";
import MenuDetailPage from "./components/MenuDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<MenuPage />} /> {/* Halaman daftar menu */}
        <Route path="/menu/:id" element={<MenuDetailPage />} /> {/* Halaman detail menu */}
      </Routes>
    </Router>
  );
}

export default App;
