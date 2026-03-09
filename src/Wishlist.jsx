import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api_path } from "../data";
import "./styles/wishlist.css";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const getImageUrl = (value) => {
    if (!value) return "https://via.placeholder.com/150?text=No+Image";
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    if (value.startsWith("/")) {
      return `${api_path}${value}`;
    }
    return `${api_path}/${value}`;
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${api_path}/wishlist/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist(res.data?.wishlist || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      await axios.delete(`${api_path}/wishlist/remove/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist((prev) => prev.filter((item) => item.book?._id !== bookId));
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <button className="wishlist-back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>My Wishlist</h1>
        <div className="wishlist-header-space"></div>
      </div>

      <div className="wishlist-body">
        {loading ? (
          <div className="wishlist-loading">Loading wishlist...</div>
        ) : wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <h2>Your wishlist is empty</h2>
            <p>Save books here to view them later.</p>
          </div>
        ) : (
          <div className="wishlist-list">
            {wishlist.map((item) => {
              const book = item.book;
              if (!book) return null;

              return (
                <div className="wishlist-card" key={item._id}>
                  <div
                    className="wishlist-image-wrap"
                    onClick={() => navigate(`/books/${book._id}`)}
                  >
                    <img
                      src={getImageUrl(book.originalImage || book.image)}
                      alt={book.name}
                      className="wishlist-image"
                      onClick={() => navigate(`/books/${book._id}`)}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/150?text=No+Image";
                      }}
                    />
                  </div>

                  <div
                    className="wishlist-content"
                    onClick={() => navigate(`/books/${book._id}`)}
                  >
                    <h2 className="wishlist-book-name">
                      {book.name || "Book Name"}
                    </h2>

                    <p className="wishlist-book-category">
                      {book.categeory || "Category"} •{" "}
                      {book.subcategeory || "Subcategory"}
                    </p>

                    <p className="wishlist-book-price">
                      ₹{book.updatedPrice || book.price || 0}
                    </p>

                    <div className="wishlist-info-row">
                      <span>{book.condition || "N/A"}</span>
                    </div>

                    <div className="wishlist-location">
                      <span>Pincode: {book.pincode || "N/A"}</span>
                      <span>District: {book.district || "N/A"}</span>
                    </div>
                  </div>

                  <div className="wishlist-right">
                    <span className="wishlist-badge">WISHLIST</span>

                    <button
                      className="wishlist-remove-btn"
                      onClick={() => removeFromWishlist(book._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
