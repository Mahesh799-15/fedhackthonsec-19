import { useState } from "react";
import { get, set, logout, stars, avg, RESTAURANTS, CATEGORIES } from "../utils";

function RatingBar({ restaurant, list }) {
  const value = Number(avg(list)) || 0;
  return (
    <div className="bar">
      <span style={{ width: 130 }}>{restaurant.icon} {restaurant.name}</span>
      <div style={{ flex: 1 }}>
        <i style={{ width: (value / 5) * 100 + "%" }}></i>
      </div>
      <span>{avg(list)} ({list.length})</span>
    </div>
  );
}

function FeedbackItem({ f, reply, onReplyChange, onSend, onReopen }) {
  return (
    <div className="card fb">
      <div className="fb-head">
        <b>{f.restaurant} · {f.category}</b>
        <span className={"tag " + f.status}>{f.status}</span>
      </div>
      <div className="rate">{stars(f.rating)}</div>
      <p>{f.comment}</p>
      <small style={{ color: "var(--muted)" }}>by {f.name} · {f.date}</small>

      {f.reply && <div className="reply"><b>Your reply:</b> {f.reply}</div>}

      {f.status === "Pending" ? (
        <div style={{ marginTop: 10 }}>
          <textarea
            rows="2"
            placeholder="Write a reply..."
            value={reply}
            onChange={e => onReplyChange(e.target.value)}
          ></textarea>
          <button className="gold" onClick={onSend}>Reply &amp; mark resolved</button>
        </div>
      ) : (
        <button className="ghost" style={{ marginTop: 10 }} onClick={onReopen}>Reopen</button>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [feedback, setFeedback] = useState(get("feedback", []));
  const [filters, setFilters] = useState({ restaurant: "", category: "", status: "" });
  const [replies, setReplies] = useState({});

  const save = list => {
    set("feedback", list);
    setFeedback(list);
  };

  const sendReply = id => {
    const text = (replies[id] || "").trim();
    if (!text) return;
    save(feedback.map(f => (f.id === id ? { ...f, reply: text, status: "Resolved" } : f)));
    setReplies({ ...replies, [id]: "" });
  };

  const reopen = id => {
    save(feedback.map(f => (f.id === id ? { ...f, status: "Pending" } : f)));
  };

  const shown = feedback.filter(f =>
    (!filters.restaurant || f.restaurant === filters.restaurant) &&
    (!filters.category || f.category === filters.category) &&
    (!filters.status || f.status === filters.status)
  );

  const pending = feedback.filter(f => f.status === "Pending").length;
  const resolved = feedback.filter(f => f.status === "Resolved").length;

  return (
    <>
      <nav>
        <h2>TasteRate Admin</h2>
        <div>
          <span>Admin dashboard</span>
          <button className="ghost" onClick={logout}>Logout</button>
        </div>
      </nav>

      <main>
        <div className="stats">
          <div className="card stat"><b>{feedback.length}</b>Total feedback</div>
          <div className="card stat"><b>{avg(feedback)}</b>Average rating</div>
          <div className="card stat"><b>{pending}</b>Pending</div>
          <div className="card stat"><b>{resolved}</b>Resolved</div>
        </div>

        <div className="two-col">
          <div className="card">
            <h3>Rating by restaurant</h3>
            {RESTAURANTS.map(r => (
              <RatingBar
                key={r.name}
                restaurant={r}
                list={feedback.filter(f => f.restaurant === r.name)}
              />
            ))}
          </div>

          <div>
            <h3>All feedback ({shown.length})</h3>

            <div className="filters">
              <select value={filters.restaurant} onChange={e => setFilters({ ...filters, restaurant: e.target.value })}>
                <option value="">All restaurants</option>
                {RESTAURANTS.map(r => <option key={r.name}>{r.name}</option>)}
              </select>
              <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
                <option value="">All categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All status</option>
                <option>Pending</option>
                <option>Resolved</option>
              </select>
            </div>

            {shown.length === 0 && <p style={{ color: "var(--muted)" }}>No feedback to show.</p>}

            {shown.map(f => (
              <FeedbackItem
                key={f.id}
                f={f}
                reply={replies[f.id] || ""}
                onReplyChange={text => setReplies({ ...replies, [f.id]: text })}
                onSend={() => sendReply(f.id)}
                onReopen={() => reopen(f.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}