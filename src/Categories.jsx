import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/buybooks.css";
import { api_path } from "../data";

const categorySubcategoryMap = {
  "School Books (Class 1-12)": [
    "NCERT Books",
    "CBSE Books",
    "ICSE Books",
    "State Board Books",
    "IGCSE / IB Books",
    "Science Stream (Class 11-12)",
    "Commerce Stream (Class 11-12)",
    "Arts / Humanities Stream (Class 11-12)",
    "Others",
  ],
  "College & University Books": [
    "B.A",
    "B.COM",
    "B.SC",
    "B.TECH",
    "BCA",
    "BBA",
    "LLB",
    "MBBS",
    "M.A",
    "M.COM",
    "M.SC",
    "M.TECH",
    "MCA",
    "MBA",
    "MD/MS",
    "LLM",
    "Certificate",
    "Diploma",
    "MPhil/PhD",
    "Others",
  ],
  "Competitive Exam Books": [
    "IIT JEE",
    "NEET",
    "UPSC",
    "SSC",
    "GATE",
    "NDA",
    "CAT",
    "CUET",
    "BITSAT",
    "CLAT",
    "State PCS",
    "IELTS/ TOEFL",
    "Others",
  ],
  "Fictional Books": [
    "Manga",
    "Children books",
    "Picture books",
    "Romance",
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Horror",
    "Thriller",
    "Action & Adventure",
    "Young adult",
    "Historical Fiction",
    "Others",
  ],
  "Non-Fiction Books": [
    "Self-Help",
    "Biographies",
    "Business & Finance",
    "Health",
    "History & Humanities",
    "Language Learning",
    "Lifestyle",
    "Cooking, Food & Wine",
    "Music",
    "Personal & Social Issues",
    "Religion",
    "Sports",
    "Transportation & Travel",
    "Dictionary",
    "Encyclopedia",
    "Others",
  ],
};

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const BuyBooks = () => {
  const navigate = useNavigate();

  const [allBooks, setAllBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [wishlistLoadingId, setWishlistLoadingId] = useState("");
  const [wishlistBusy, setWishlistBusy] = useState(false);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      setWishlistIds([]);
    }
  }, [token]);

  const fetchWishlist = async () => {
    try {
      setWishlistBusy(true);

      const res = await axios.get(`${api_path}/wishlist/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const wishlistArray = Array.isArray(res.data?.wishlist)
        ? res.data.wishlist
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      const ids = wishlistArray
        .map((item) => item?.book?._id || item?.book)
        .filter(Boolean);

      setWishlistIds(ids);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistIds([]);
    } finally {
      setWishlistBusy(false);
    }
  };

  const fetchAllBooks = async () => {
    try {
      setLoadingBooks(true);
      const res = await axios.get(`${api_path}/books/allbooks`);
      const data = Array.isArray(res.data?.books) ? res.data.books : [];
      const randomBooks = shuffleArray(data);
      setAllBooks(randomBooks);
      setBooks(randomBooks);
    } catch (error) {
      console.error("Error fetching all books:", error);
      setAllBooks([]);
      setBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const res = await axios.get(`${api_path}/images`);
      const apiData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      const onlyCategories = apiData.filter(
        (item) =>
          item?.categeory && (!item?.subcategeory || item.subcategeory === ""),
      );

      const mappedCategories = Object.keys(categorySubcategoryMap).map(
        (catName) => {
          const matched = onlyCategories.find(
            (item) => item.categeory === catName,
          );
          return {
            categeory: catName,
            image: matched?.image || "",
          };
        },
      );

      setCategories(shuffleArray(mappedCategories));
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories(
        shuffleArray(
          Object.keys(categorySubcategoryMap).map((catName) => ({
            categeory: catName,
            image: "",
          })),
        ),
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchFilteredBooks = async ({
    categeory = "",
    subcategeory = "",
    searchText = "",
  }) => {
    try {
      setLoadingBooks(true);

      if (!categeory && !subcategeory && !searchText.trim()) {
        setBooks(shuffleArray(allBooks));
        return;
      }

      const res = await axios.get(`${api_path}/books/filter`, {
        params: {
          categeory,
          subcategeory,
          search: searchText.trim(),
        },
      });

      const data = Array.isArray(res.data?.books) ? res.data.books : [];
      setBooks(shuffleArray(data));
    } catch (error) {
      console.error("Error fetching filtered books:", error);
      setBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  };

  const visibleSubcategories = useMemo(() => {
    if (activeCategory) return categorySubcategoryMap[activeCategory] || [];
    return shuffleArray(
      Object.values(categorySubcategoryMap).flat().filter(Boolean),
    );
  }, [activeCategory]);

  const handleCategoryClick = (category) => {
    const newCategory = activeCategory === category ? "" : category;
    setActiveCategory(newCategory);
    setActiveSubcategory("");

    fetchFilteredBooks({
      categeory: newCategory,
      subcategeory: "",
      searchText: search,
    });
  };

  const handleSubcategoryClick = (subcategory) => {
    const newSub = activeSubcategory === subcategory ? "" : subcategory;
    setActiveSubcategory(newSub);

    fetchFilteredBooks({
      categeory: activeCategory,
      subcategeory: newSub,
      searchText: search,
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    fetchFilteredBooks({
      categeory: activeCategory,
      subcategeory: activeSubcategory,
      searchText: value,
    });
  };

  const handleClear = () => {
    setSearch("");
    setActiveCategory("");
    setActiveSubcategory("");
    setBooks(shuffleArray(allBooks));
  };

  const getImageUrl = (value) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://"))
      return value;
    if (value.startsWith("/")) return `${api_path}${value}`;
    return `${api_path}/${value}`;
  };

  const isWishlisted = (id) => wishlistIds.includes(id);

  const toggleWishlist = async (e, bookId) => {
    e.stopPropagation();

    if (!token) {
      navigate("/login");
      return;
    }

    if (wishlistLoadingId === bookId) return;

    const alreadyWishlisted = isWishlisted(bookId);

    try {
      setWishlistLoadingId(bookId);

      // optimistic UI
      if (alreadyWishlisted) {
        setWishlistIds((prev) => prev.filter((id) => id !== bookId));
      } else {
        setWishlistIds((prev) => [...new Set([...prev, bookId])]);
      }

      const res = await axios.post(
        `${api_path}/wishlist/toggle`,
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // fallback sync from response
      if (typeof res.data?.wishlisted === "boolean") {
        if (res.data.wishlisted) {
          setWishlistIds((prev) => [...new Set([...prev, bookId])]);
        } else {
          setWishlistIds((prev) => prev.filter((id) => id !== bookId));
        }
      }

      // final sync from backend
      await fetchWishlist();
    } catch (error) {
      console.error("Error toggling wishlist:", error);

      // rollback if failed
      if (alreadyWishlisted) {
        setWishlistIds((prev) => [...new Set([...prev, bookId])]);
      } else {
        setWishlistIds((prev) => prev.filter((id) => id !== bookId));
      }

      if (error?.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setWishlistLoadingId("");
    }
  };

  return (
    <div className="buybooks-page">
      <div className="buybooks-topbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search book name..."
          value={search}
          onChange={handleSearchChange}
        />
        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

      <div className="top-categories-wrapper">
        <div className="top-categories">
          {loadingCategories
            ? [...Array(5)].map((_, i) => (
                <div className="top-category-card skeleton-card" key={i}>
                  <div className="top-category-image-box skeleton-block" />
                  <div className="top-category-text skeleton-line" />
                </div>
              ))
            : categories.map((cat) => (
                <button
                  key={cat.categeory}
                  className={`top-category-card ${
                    activeCategory === cat.categeory ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(cat.categeory)}
                >
                  <div className="top-category-image-box">
                    {cat.image ? (
                      <img
                        src={getImageUrl(cat.image)}
                        alt={cat.categeory}
                        className="top-category-image"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback =
                            e.currentTarget.parentElement.querySelector(
                              ".top-category-fallback",
                            );
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className="top-category-fallback"
                      style={{ display: cat.image ? "none" : "flex" }}
                    >
                      {cat.categeory.charAt(0)}
                    </div>
                  </div>
                  <p className="top-category-name">{cat.categeory}</p>
                </button>
              ))}
        </div>
      </div>

      <div className="buybooks-content">
        <aside className="left-subcategories">
          <h3 className="left-title">
            {activeCategory ? "Subcategories" : "All Subcategories"}
          </h3>

          <div className="subcategory-vertical-list">
            {visibleSubcategories.map((sub) => (
              <button
                key={sub}
                className={`subcategory-vertical-item ${
                  activeSubcategory === sub ? "active" : ""
                }`}
                onClick={() => handleSubcategoryClick(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        </aside>

        <main className="books-section">
          {loadingBooks ? (
            <div className="books-grid">
              {[...Array(8)].map((_, i) => (
                <div className="book-card skeleton-book" key={i}>
                  <div className="book-image-wrap skeleton-block" />
                  <div className="book-info-box">
                    <div className="skeleton-line skeleton-name" />
                    <div className="skeleton-line skeleton-price" />
                  </div>
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="books-grid">
              {books.map((book) => (
                <div
                  className="book-card"
                  key={book._id}
                  onClick={() => navigate(`/books/${book._id}`)}
                >
                  <button
                    type="button"
                    className={`wishlist-btn ${
                      isWishlisted(book._id) ? "active" : ""
                    } ${wishlistLoadingId === book._id ? "loading" : ""}`}
                    onClick={(e) => toggleWishlist(e, book._id)}
                    disabled={wishlistLoadingId === book._id || wishlistBusy}
                  >
                    {wishlistLoadingId === book._id
                      ? "..."
                      : isWishlisted(book._id)
                        ? "♥"
                        : "♡"}
                  </button>

                  <div className="book-image-shell">
                    <div className="book-image-wrap">
                      <img
                        src={
                          getImageUrl(book.originalImage || book.image) ||
                          "https://via.placeholder.com/300x400?text=No+Image"
                        }
                        alt={book.name}
                        className="book-image"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/300x400?text=No+Image";
                        }}
                      />
                    </div>
                  </div>

                  <div className="book-info-box">
                    <h4 className="book-title">{book.name || "Book Name"}</h4>
                    <p className="book-subline">
                      {book.categeory || "Category"} •{" "}
                      {book.subcategeory || "General"}
                    </p>
                    <p className="book-price">
                      ₹{book.updatedPrice || book.price || 0}
                    </p>
                    <p className="book-detail-line">
                      <span>Pincode:</span> {book.pincode || "N/A"}
                    </p>
                    <p className="book-detail-line">
                      <span>District:</span> {book.district || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-books">No books found</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BuyBooks;
