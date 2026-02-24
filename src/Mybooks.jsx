import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/mylistings.css";

const API_BASE = import.meta.env.VITE_API_PATH;

const TABS = [
  { key: "active", label: "Active" },
  { key: "sold", label: "Sold" },
  { key: "pending", label: "Pending" },
];

const getTab = (b) => {
  const status = String(b?.status || "").toLowerCase();
  const sold = String(b?.soldstatus || "").toLowerCase();
  if (sold.includes("sold") || sold.includes("out")) return "sold";
  if (status.includes("pending") || status.includes("review")) return "pending";
  return "active";
};

const priceText = (b) => {
  const v = b?.updatedPrice ?? b?.price;
  const n = Number(v);
  if (Number.isNaN(n)) return "";
  return n % 1 === 0 ? String(n) : n.toFixed(2);
};

export default function MyListings() {
  const navigate = useNavigate();
  const token = useMemo(() => (localStorage.getItem("token") || "").trim(), []);

  const [tab, setTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);

  // ✅ track patch loading per book
  const [updatingId, setUpdatingId] = useState(null);

  const fetchMyBooks = async () => {
    setLoading(true);
    setError("");

    if (!API_BASE) {
      setError("VITE_API_PATH is missing. Set it in .env and restart Vite.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/user/mybooks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data?.error || data?.message || `Request failed (${res.status})`,
        );
        if (res.status === 401) navigate("/login");
        setLoading(false);
        return;
      }

      setBooks(Array.isArray(data?.books) ? data.books : []);
    } catch (e) {
      setError(
        "Network/CORS blocked the request. (Browser error: Failed to fetch)",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ PATCH soldstatus
  const patchSoldStatus = async (bookId, nextStatus) => {
    if (!bookId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setUpdatingId(bookId);

      const res = await fetch(`${API_BASE}/books/${bookId}/sold`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ soldstatus: nextStatus }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.error || data?.message || `Update failed (${res.status})`);
        return;
      }

      // ✅ refresh list
      await fetchMyBooks();
    } catch (e) {
      alert("Failed to update status (Network/CORS).");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchMyBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleBooks = useMemo(
    () => books.filter((b) => getTab(b) === tab),
    [books, tab],
  );

  return (
    <div className="ml-page">
      <div className="ml-topbar">
        <button className="ml-back" type="button" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="ml-title">My Listings</div>
        <div className="ml-right-spacer" />
      </div>

      <div className="ml-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`ml-tab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="ml-content">
        {loading ? (
          <div className="ml-state">Loading…</div>
        ) : error ? (
          <div className="ml-state error">
            {error}
            <div style={{ marginTop: 10 }}>
              <button className="ml-btn" type="button" onClick={fetchMyBooks}>
                Retry
              </button>
            </div>
          </div>
        ) : visibleBooks.length === 0 ? (
          <div className="ml-state">No listings</div>
        ) : (
          visibleBooks.map((b) => {
            const isSold = String(b?.soldstatus || "")
              .toLowerCase()
              .includes("soldout");
            const nextStatus = isSold ? "Instock" : "Soldout";
            const btnText = isSold ? "Mark Instock" : "Mark Soldout";
            const isUpdating = updatingId === b.id;

            return (
              <div className="ml-card" key={b.id}>
                <div className="ml-thumb">
                  <img
                    src={b.image}
                    alt={b.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/120x160?text=Book";
                    }}
                  />
                </div>

                <div className="ml-info">
                  <div className="ml-row">
                    <div className="ml-name" title={b.name}>
                      {b.name}
                    </div>
                    <div className={`ml-badge ${getTab(b)}`}>
                      {getTab(b).toUpperCase()}
                    </div>
                  </div>

                  <div className="ml-sub">
                    {b.categeory}
                    {b.subcategeory ? ` • ${b.subcategeory}` : ""}
                  </div>

                  <div className="ml-price">₹{priceText(b)}</div>

                  {/* ✅ Added button row */}
                  <div className="ml-actions">
                    <button
                      className="ml-btn"
                      type="button"
                      disabled={isUpdating}
                      onClick={() => patchSoldStatus(b.id, nextStatus)}
                    >
                      {isUpdating ? "Updating..." : btnText}
                    </button>
                  </div>

                  <div className="ml-footer">
                    <span>{b.condition}</span>
                    <span>{b.location}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        className="ml-fab"
        type="button"
        onClick={() => navigate("/sellbook")}
      >
        +
      </button>
    </div>
  );
}
