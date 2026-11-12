import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, set } from "../utils";

export default function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [msg, setMsg] = useState("");
  const [login, setLogin] = useState({ email: "", pass: "" });
  const [signup, setSignup] = useState({ name: "", email: "", pass: "" });

  const go = user => {
    set("session", user);
    navigate(user.role === "admin" ? "/admin" : "/user");
  };

  const handleLogin = () => {
    const user = get("users", []).find(
      u => u.email === login.email.trim().toLowerCase() && u.password === login.pass
    );
    if (!user) return setMsg("Wrong email or password.");
    go(user);
  };

  const handleSignup = () => {
    const email = signup.email.trim().toLowerCase();
    if (!signup.name.trim() || !email) return setMsg("Please fill in all fields.");
    if (signup.pass.length < 6) return setMsg("Password must be at least 6 characters.");
    const users = get("users", []);
    if (users.some(u => u.email === email)) return setMsg("This email is already registered.");
    const user = { name: signup.name.trim(), email, password: signup.pass, role: "user" };
    set("users", [...users, user]);
    go(user);
  };

  return (
    <>
      <header className="topbar">
        <div className="site-title">🍽️ Feedback Management System</div>
        <small>Restaurant &amp; Food Reviews</small>
      </header>

      <div className="auth">
        <div className="hero">
          <h1>Rate every bite. Shape every menu.</h1>
          <p>Share ratings and suggestions for your favourite restaurants. Restaurant admins read, reply and improve.</p>
        </div>

        <div className="card box">
          <div className="tabs">
            <button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setMsg(""); }}>Login</button>
            <button className={tab === "signup" ? "active" : ""} onClick={() => { setTab("signup"); setMsg(""); }}>Sign up</button>
          </div>
          <p className="msg">{msg}</p>

          {tab === "login" ? (
            <div>
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={login.email}
                onChange={e => setLogin({ ...login, email: e.target.value })} />
              <label>Password</label>
              <input type="password" placeholder="Password" value={login.pass}
                onChange={e => setLogin({ ...login, pass: e.target.value })} />
              <button style={{ width: "100%" }} onClick={handleLogin}>Login</button>
            </div>
          ) : (
            <div>
              <label>Full name</label>
              <input placeholder="Your name" value={signup.name}
                onChange={e => setSignup({ ...signup, name: e.target.value })} />
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={signup.email}
                onChange={e => setSignup({ ...signup, email: e.target.value })} />
              <label>Password (min 6 characters)</label>
              <input type="password" placeholder="Password" value={signup.pass}
                onChange={e => setSignup({ ...signup, pass: e.target.value })} />
              <button style={{ width: "100%" }} onClick={handleSignup}>Create account</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}