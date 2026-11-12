import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { get } from "./utils";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/userDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard";

function Guard({ role, children }) {
  const user = get("session", null);
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/user" element={<Guard role="user"><UserDashboard /></Guard>} />
        <Route path="/admin" element={<Guard role="admin"><AdminDashboard /></Guard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}