import { useState } from "react";
import { get, set, logout, stars, avg, RESTAURANTS, CATEGORIES } from "../utils";

export default function UserDashboard() {
  const user = get("session", null);
  const [feedback, setFeedback] = useState(get("feedback", []));
  const [form, setForm] = useState({
    restaurant: RESTAURANTS[0].name,
    category: CATEGORIES[0],
    rating: 0,
    comment: ""
  });
  const [msg, setMsg] = useState({ text: "", ok: false });

  const submit = () => {
    if (!form.rating) return setMsg({ text: "Please select a star rating.", ok: false });
    if (!form.comment.trim()) return setMsg({ text: "Please write your feedback.", ok: false });

    const item = {
      id: Date.now(),
      email: user.email,
      name: user.name,
      restaurant: form.restaurant,
      category: form.category,
      rating: form.rating,
      comment: form.comment.trim(),
      status: "Pending",
      reply: "",
      date: new Date().toLocaleDateString()
    };
    const updated = [item, ...feedback];
    set("feedback", updated);
    setFeedback(updated);
    setForm({ ...form, rating: 0, comment: "" });
    setMsg({ text: "Thank you! Your feedback was submitted.", ok: true });
  };

  const mine = feedback.filter(f => f.email === user.email);

  return (
    <>
      <nav>
        <h2>TasteRate</h2>
        <div>
          <span>Hello, {user.name}</span>
          <button className="ghost" onClick={logout}>Logout</button>
        </div>
      </nav>

      <main>
        <h3>Restaurants (click one to review it)</h3>
        <div className="grid">
          {RESTAURANTS.map(r => (
            <div
              key={r.name}
              className="card rest"
              style={{
                cursor: "pointer",
                borderColor: form.restaurant === r.name ? "var(--gold)" : undefined
              }}
              onClick={() => setForm({ ...form, restaurant: r.name })}
            >
              <div className="icon">{r.icon}</div>
              <h3>{r.name}</h3>
              <small>{r.cuisine}</small>
              <p className="rate">★ {avg(feedback.filter(f => f.restaurant === r.name))}</p>
            </div>
          ))}
        </div>

        <div className="two-col">
          <div className="card">
            <h3>Give feedback</h3>
            <p className={"msg" + (msg.ok ? " ok" : "")}>{msg.text}</p>

            <label>Restaurant</label>
            <select value={form.restaurant} onChange={e => setForm({ ...form, restaurant: e.target.value })}>
              {RESTAURANTS.map(r => <option key={r.name}>{r.name}</option>)}
            </select>

            <label>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <label>Rating</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  className={n <= form.rating ? "on" : ""}
                  onClick={() => setForm({ ...form, rating: n })}
                >★</span>
              ))}
            </div>

            <label>Your feedback</label>
            <textarea
              rows="4"
              placeholder="Tell us about your experience..."
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
            />
            <button style={{ width: "100%" }} onClick={submit}>Submit feedback</button>
          </div>

          <div>
            <h3>My feedback ({mine.length})</h3>
            {mine.length === 0 && <p style={{ color: "var(--muted)" }}>You haven't given any feedback yet.</p>}
            {mine.map(f => (
              <div key={f.id} className="card fb">
                <div className="fb-head">
                  <b>{f.restaurant} · {f.category}</b>
                  <span className={"tag " + f.status}>{f.status}</span>
                </div>
                <div className="rate">{stars(f.rating)}</div>
                <p>{f.comment}</p>
                <small style={{ color: "var(--muted)" }}>{f.date}</small>
                {f.reply && <div className="reply"><b>Restaurant reply:</b> {f.reply}</div>}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}