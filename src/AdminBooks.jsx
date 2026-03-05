import React, { useState } from "react";
import axios from "axios";
import { api_path } from "../data";
import "./styles/adminprints.css";
import { useNavigate } from "react-router-dom";
import Loader from "./Loading";

export default function AdminBooks({ onGoToPrintOrders }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [books, setBooks] = useState([]);
  const [viewingBooks, setViewingBooks] = useState(false);
  const [editStates, setEditStates] = useState({});

  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (username === "admin@mybookhub.com" && password === "Ayush@5121") {
      try {
        const response = await axios.get(`${api_path}/admin/books`);
        setBooks(Array.isArray(response.data.books) ? response.data.books : []);
        setViewingBooks(true);
      } catch (error) {
        setErrorMsg(error.response?.data?.error || "Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsg("Invalid username or password");
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

  // Save update for a single book
  const handleSave = async (bookId) => {
    const edits = editStates[bookId];
    if (!edits || !edits.status) {
      alert("Status is required.");
      return;
    }
    if (!["Accepted", "Rejected"].includes(edits.status)) {
      alert("Status must be 'Accepted' or 'Rejected'.");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(`${api_path}/admin/book/${bookId}/status`, {
        status: edits.status,
        sellingPrice:
          edits.sellingPrice !== undefined
            ? Number(edits.sellingPrice)
            : undefined,
      });

      const response = await axios.get(`${api_path}/admin/books`);
      setBooks(Array.isArray(response.data.books) ? response.data.books : []);
      setEditStates((prev) => {
        const newEdits = { ...prev };
        delete newEdits[bookId];
        return newEdits;
      });
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update book.");
    } finally {
      setLoading(false);
    }
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
      <button
        className="admin-btn"
        onClick={Prints}
        style={{ marginBottom: 20 }}
      >
        Go to Print Orders
      </button>
      {loading && <Loader />}
      {errorMsg && <div className="error-msg">{errorMsg}</div>}

      <table className="orders-table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Name</th>
            <th>Image</th>
            <th style={{ width: "140px" }}>Status</th>
            <th>Price</th>
            <th>Selling Price</th>
            <th>Condition</th>
            <th>Description</th>
            <th>Location</th>
            <th>Category</th>
            <th>Sell Type</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>User Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 && (
            <tr>
              <td colSpan="15">No books available</td>
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
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>{book.price !== "-" ? book.price : "-"}</td>
                <td>
                  <input
                    type="number"
                    value={
                      edits.sellingPrice !== undefined
                        ? edits.sellingPrice
                        : book.updatedPrice !== "-" &&
                          book.updatedPrice !== undefined
                        ? book.updatedPrice
                        : ""
                    }
                    placeholder="Selling Price"
                    onChange={(e) =>
                      handleInputChange(
                        book._id,
                        "sellingPrice",
                        e.target.value
                      )
                    }
                    style={{ width: 100 }}
                  />
                </td>
                <td>{book.condition || "-"}</td>
                <td>{book.description || "-"}</td>
                <td>{book.location || "-"}</td>
                <td>{book.category || "-"}</td>
                <td>{book.selltype || "-"}</td>
                <td>{book.userFullName || "-"}</td>
                <td>{book.userEmail || "-"}</td>
                <td>{book.userMobile || "-"}</td>
                <td>
                  <button
                    className="admin-btn"
                    onClick={() => handleSave(book._id)}
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

      <button
        className="admin-btn"
        style={{ marginTop: 20 }}
        onClick={() => {
          setViewingBooks(false);
          setUserName("");
          setPassword("");
          setBooks([]);
          setErrorMsg("");
          setEditStates({});
        }}
      >
        Logout
      </button>
    </div>
  );
}
