import React, { useState } from "react";
import axios from "axios";
import { api_path } from "../data";
import "./styles/adminprints.css";
import { useNavigate } from "react-router-dom";
import Loader from "./Loading";

const STATUS_OPTIONS = ["Pending", "Accepted", "Rejected"];
const STOCK_OPTIONS = ["Instock", "Soldout", "Orderd"];

export default function AdminBooks() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [books, setBooks] = useState([]);
  const [viewingBooks, setViewingBooks] = useState(false);
  const [editStates, setEditStates] = useState({});

  const navigate = useNavigate();

  const ADMIN_USERNAME = "admin@mybookhub.com";
  const ADMIN_PASSWORD = "Ayush@5121";

  const fetchBooks = async () => {
    const response = await axios.get(`${api_path}/admin/books`);
    setBooks(Array.isArray(response.data.books) ? response.data.books : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      setErrorMsg("Invalid username or password");
      return;
    }

    try {
      setLoading(true);
      await fetchBooks();
      setViewingBooks(true);
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (bookId, field, value) => {
    setEditStates((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (bookId, book) => {
    const edits = editStates[bookId] || {};
    const selectedStatus = edits.status ?? book.status ?? "Pending";
    const selectedSellingPrice =
      edits.sellingPrice ?? book.updatedPrice ?? book.price ?? "";
    const selectedStockStatus =
      edits.soldstatus ?? book.soldstatus ?? "Instock";

    if (!STATUS_OPTIONS.includes(selectedStatus)) {
      alert("Status must be Pending, Accepted or Rejected.");
      return;
    }

    if (!STOCK_OPTIONS.includes(selectedStockStatus)) {
      alert("Stock status must be Instock, Soldout or Orderd.");
      return;
    }

    if (
      selectedSellingPrice !== "" &&
      selectedSellingPrice !== undefined &&
      Number(selectedSellingPrice) < 0
    ) {
      alert("Selling price cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      await axios.patch(`${api_path}/admin/book/${bookId}/status`, {
        status: selectedStatus,
        sellingPrice:
          selectedSellingPrice !== "" && selectedSellingPrice !== undefined
            ? Number(selectedSellingPrice)
            : undefined,
        stockStatus: selectedStockStatus,
      });

      await fetchBooks();

      setEditStates((prev) => {
        const next = { ...prev };
        delete next[bookId];
        return next;
      });
    } catch (error) {
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update book.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setViewingBooks(false);
    setUserName("");
    setPassword("");
    setBooks([]);
    setErrorMsg("");
    setEditStates({});
  };

  const goToPrintOrders = () => {
    navigate("/adminprints");
  };

  if (!viewingBooks) {
    return (
      <div className="admin-container">
        <h2>Admin Login - Sold Books</h2>

        {errorMsg && <div className="error-msg">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            placeholder="Enter user name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="admin-input"
          />

          <input
            type="password"
            placeholder="Enter the password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="admin-input"
            autoComplete="current-password"
          />

          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? <Loader /> : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Sold Book Listings</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <button
          className="admin-btn"
          onClick={goToPrintOrders}
          disabled={loading}
        >
          Go to Print Orders
        </button>

        <button className="admin-btn" onClick={fetchBooks} disabled={loading}>
          Refresh Books
        </button>

        <button className="admin-btn" onClick={handleLogout} disabled={loading}>
          Logout
        </button>
      </div>

      {loading && <Loader />}
      {errorMsg && <div className="error-msg">{errorMsg}</div>}

      <table className="orders-table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Status</th>
            <th>Original Price</th>
            <th>Selling Price</th>
            <th>Stock Status</th>
            <th>Condition</th>
            <th>Description</th>
            <th>State</th>
            <th>District</th>
            <th>Pincode</th>
            <th>Address</th>
            <th>Landmark</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Sell Type</th>
            <th>Sold Count</th>
            <th>Date Added</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>User Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.length === 0 && (
            <tr>
              <td colSpan="23">No books available</td>
            </tr>
          )}

          {books.map((book) => {
            const edits = editStates[book._id] || {};

            return (
              <tr key={book._id}>
                <td>{book._id}</td>
                <td>{book.name || "-"}</td>

                <td>
                  {book.image ? (
                    <a
                      href={book.image}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Image
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  <select
                    value={edits.status ?? book.status ?? "Pending"}
                    onChange={(e) =>
                      handleInputChange(book._id, "status", e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                <td>{book.price ?? "-"}</td>

                <td>
                  <input
                    type="number"
                    value={
                      edits.sellingPrice !== undefined
                        ? edits.sellingPrice
                        : book.updatedPrice !== undefined &&
                            book.updatedPrice !== null
                          ? book.updatedPrice
                          : ""
                    }
                    placeholder="Selling Price"
                    onChange={(e) =>
                      handleInputChange(
                        book._id,
                        "sellingPrice",
                        e.target.value,
                      )
                    }
                    style={{ width: 110 }}
                  />
                </td>

                <td>
                  <select
                    value={edits.soldstatus ?? book.soldstatus ?? "Instock"}
                    onChange={(e) =>
                      handleInputChange(book._id, "soldstatus", e.target.value)
                    }
                  >
                    {STOCK_OPTIONS.map((stock) => (
                      <option key={stock} value={stock}>
                        {stock}
                      </option>
                    ))}
                  </select>
                </td>

                <td>{book.condition || "-"}</td>
                <td>{book.description || "-"}</td>
                <td>{book.state || "-"}</td>
                <td>{book.district || "-"}</td>
                <td>{book.pincode || "-"}</td>
                <td>{book.address || "-"}</td>
                <td>{book.landmark || "-"}</td>
                <td>{book.category || book.categeory || "-"}</td>
                <td>{book.subcategory || book.subcategeory || "-"}</td>
                <td>{book.selltype || "-"}</td>
                <td>{book.soldcount ?? 0}</td>
                <td>
                  {book.date_added
                    ? new Date(book.date_added).toLocaleString()
                    : "-"}
                </td>
                <td>{book.userFullName || "-"}</td>
                <td>{book.userEmail || "-"}</td>
                <td>{book.userMobile || "-"}</td>

                <td>
                  <button
                    className="admin-btn"
                    onClick={() => handleSave(book._id, book)}
                    disabled={loading}
                  >
                    Save
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
