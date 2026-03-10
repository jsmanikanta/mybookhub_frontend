import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { api_path } from "../data";
import "./styles/bookdetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (value) => {
    if (!value) return "https://via.placeholder.com/400x500?text=No+Image";

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    if (value.startsWith("/")) {
      return `${api_path}${value}`;
    }

    return `${api_path}/${value}`;
  };

  const fetchBook = async (token) => {
    try {
      setLoading(true);

      const res = await axios.get(`${api_path}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBook(res.data?.book || null);
    } catch (error) {
      console.error("Error fetching book:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔴 Redirect if token not found
    if (!token) {
      navigate("/login");
      return;
    }

    if (id) {
      fetchBook(token);
    } else {
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="book-details-status">Loading...</div>;
  }

  if (!book) {
    return <div className="book-details-status">Book not found</div>;
  }

  const sellerName = book?.seller?.fullname || "Seller";
  const sellerPhone = book?.seller?.mobileNumber || "";
  const sellerEmail = book?.seller?.email || "";

  const sellerAddress =
    [book?.address, book?.landmark, book?.district, book?.state, book?.pincode]
      .filter(Boolean)
      .join(", ") || "Address not available";
  return (
    <div className="book-details-page">
      <div className="book-details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>

        <h1 className="page-title">Book Details</h1>
      </div>

      <div className="book-details-container">
        <div className="book-image-card">
          <img
            src={getImageUrl(book.originalImage || book.image)}
            alt={book.name}
            className="book-main-image"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/400x500?text=No+Image";
            }}
          />
        </div>

        <div className="book-price-box">
          ₹{book.updatedPrice || book.price || 0}
        </div>

        <h2 className="book-name">{book.name || "Book Name"}</h2>

        <div className="book-meta-grid">
          <div className="meta-card">
            <div className="meta-icon">📚</div>
            <div>
              <p className="meta-label">Category</p>
              <p className="meta-value">
                {book.categeory || "N/A"}
                {book.subcategeory ? ` • ${book.subcategeory}` : ""}
              </p>
            </div>
          </div>

          <div className="meta-card">
            <div className="meta-icon">✨</div>
            <div>
              <p className="meta-label">Condition</p>
              <p className="meta-value">{book.condition || "N/A"}</p>
            </div>
          </div>

          <div className="meta-card">
            <div className="meta-icon">📍</div>
            <div>
              <p className="meta-label">Location</p>
              <p className="meta-value">
                {[book.district, book.pincode].filter(Boolean).join(" • ") ||
                  "N/A"}
              </p>
            </div>
          </div>

          <div className="meta-card">
            <div className="meta-icon">📝</div>
            <div>
              <p className="meta-label">Description</p>
              <p className="meta-value">
                {book.description || "No description available"}
              </p>
            </div>
          </div>
        </div>

        <div className="seller-card">
          <div className="section-head">
            <h3>Seller Details</h3>
          </div>

          <div className="seller-row">
            <span className="seller-label">Name</span>
            <span className="seller-value">{sellerName}</span>
          </div>

          <div className="seller-row">
            <span className="seller-label">Phone</span>
            <span className="seller-value">
              {sellerPhone || "Not available"}
            </span>
          </div>

          <div className="seller-row">
            <span className="seller-label">Email</span>
            <span className="seller-value">
              {sellerEmail || "Not available"}
            </span>
          </div>

          <div className="seller-row seller-row-address">
            <span className="seller-label">Address</span>
            <span className="seller-value">{sellerAddress}</span>
          </div>

          <div className="action-buttons">
            {sellerPhone ? (
              <a href={`tel:${sellerPhone}`} className="call-btn">
                Call Seller
              </a>
            ) : (
              <button className="call-btn disabled-btn" disabled>
                Phone Not Available
              </button>
            )}
          </div>
        </div>

        <div className="safety-card">
          <h3>Tips for a safe deal</h3>

          <ul className="safety-list">
            <li>Never pay money in advance before checking the book.</li>
            <li>Meet in a safe and public place.</li>
            <li>Verify the book condition before payment.</li>
            <li>Do not share OTP, UPI PIN, or bank details.</li>
            <li>Call the seller directly before visiting.</li>
          </ul>

          <p className="safety-note">
            MyBookHub only connects buyers and sellers. Please verify all
            details before making any payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
