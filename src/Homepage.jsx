import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/HomePage.css";
import { api_path } from "../data";

import heroImage from "/images/banner.jpeg";
import printkartBanner from "/images/printkart_banner.jpeg";

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

function HomePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const HOME_IMAGES_API = `${api_path}/images`;

  const normalizeText = (value) =>
    String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  const getImageUrl = (value) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://"))
      return value;
    if (value.startsWith("/")) return `${api_path}${value}`;
    return `${api_path}/${value}`;
  };

  const shuffleArray = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);

        const res = await axios.get(HOME_IMAGES_API);

        const rawData = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
            ? res.data
            : [];

        const cleaned = rawData
          .filter((item) => item?.image)
          .map((item, index) => ({
            id: item._id || `img-${index}`,
            categeory: item.categeory || "",
            subcategeory: item.subcategeory || "",
            folderType: String(item.folderType || "").toLowerCase(),
            image: getImageUrl(item.image || ""),
          }));

        setItems(cleaned);
      } catch (error) {
        console.error("Error fetching homepage images:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [HOME_IMAGES_API]);

  const categoryRecords = useMemo(() => {
    const dbCategories = items.filter(
      (item) => item.folderType === "category" && item.categeory,
    );

    const mapped = Object.keys(categorySubcategoryMap).map((categoryName) => {
      const found = dbCategories.find(
        (item) => normalizeText(item.categeory) === normalizeText(categoryName),
      );

      return {
        id: found?.id || categoryName,
        categeory: categoryName,
        image: found?.image || "",
      };
    });

    return shuffleArray(mapped);
  }, [items]);

  const subcategoryRecords = useMemo(() => {
    return items.filter(
      (item) => item.folderType === "subcategory" && item.subcategeory,
    );
  }, [items]);

  const groupedSubcategories = useMemo(() => {
    return Object.entries(categorySubcategoryMap)
      .map(([categoryName, subNames]) => {
        const subitems = subNames
          .map((subName) => {
            const found = subcategoryRecords.find(
              (item) =>
                normalizeText(item.subcategeory) === normalizeText(subName),
            );

            if (!found) return null;

            return {
              ...found,
              categeory: categoryName,
              subcategeory: subName,
            };
          })
          .filter(Boolean);

        return {
          categoryName,
          subitems,
        };
      })
      .filter((group) => group.subitems.length > 0);
  }, [subcategoryRecords]);

  const handleCategoryClick = (categeory) => {
    navigate("/categories", {
      state: {
        categeory,
        subcategeory: "",
      },
    });
  };

  const handleSubcategoryClick = (categeory, subcategeory) => {
    navigate("/categories", {
      state: {
        categeory,
        subcategeory,
      },
    });
  };

  return (
    <div className="home-page">
      <div className="home-wrapper">
        <section
          className="hero-banner"
          onClick={() => navigate("/categories")}
        >
          <img src={heroImage} alt="MyBookHub Banner" />
        </section>

        <section className="quick-nav-section" >
          {loading ? (
            <div className="state-box">Loading categories...</div>
          ) : categoryRecords.length === 0 ? (
            <div className="state-box">No categories found</div>
          ) : (
            <div className="quick-nav-grid">
              {categoryRecords.map((item) => (
                <button
                  key={item.id}
                  className="quick-card"
                  type="button"
                  onClick={() => handleCategoryClick(item.categeory)}
                >
                  <div className="quick-image-wrap">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.categeory}
                        className="quick-image"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                  </div>
                  <span className="quick-text">{item.categeory}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="printkart-section">
          <div
            className="printkart-banner"
            onClick={() =>
              (window.location.href = "https://printkart.mybookhub.store/")
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.location.href = "https://printkart.mybookhub.store/";
              }
            }}
          >
            <img src={printkartBanner} alt="PrintKart Banner" />
          </div>
        </section><br />

        <section className="categories-section">
          <div className="section-top">
            <h2>Explore Subcategories</h2>
            <button
              className="view-all-btn"
              onClick={() => navigate("/categories")}
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="state-box">Loading subcategories...</div>
          ) : groupedSubcategories.length === 0 ? (
            <div className="state-box">No subcategories found</div>
          ) : (
            <div className="subcategory-groups">
              {groupedSubcategories.map((group) => (
                <div className="subcategory-group" key={group.categoryName}>
                  <button
                    className="subcategory-group-title"
                    type="button"
                    onClick={() => handleCategoryClick(group.categoryName)}
                  >
                    {group.categoryName}
                  </button>

                  <div className="subcategory-scroll">
                    {group.subitems.map((item) => (
                      <button
                        key={`${group.categoryName}-${item.subcategeory}`}
                        className="subcategory-card"
                        type="button"
                        onClick={() =>
                          handleSubcategoryClick(
                            group.categoryName,
                            item.subcategeory,
                          )
                        }
                      >
                        <div className="subcategory-card-image-wrap">
                          <img
                            src={item.image}
                            alt={item.subcategeory}
                            className="subcategory-card-image"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default HomePage;
