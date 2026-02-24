import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/sellbook.css";

const categories = [
  "School Books (class 1-12)",
  "College & University Books",
  "Competitive Exam Books",
  "Fictional Books",
  "Non-Fiction Books",
  "others",
];

const subcategoriesMap = {
  "School Books (class 1-12)": [
    "NCERT Books",
    "State Board Books",
    "CBSE Books",
    "Sample Papers & Workbook",
    "English Medium Textbooks",
    "Telugu Medium Textbooks",
    "Hindi Medium Textbooks",
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

const conditions = [
  "Brand New",
  "Like New",
  "Very Good",
  "Good",
  "Fair",
  "Poor",
];
export default function SellBooks() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    condition: "",
    description: "",
    location: "New Delhi, India",
    selltype: "sell",
    soldstatus: "Instock",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Book name is required";
    else if (formData.name.trim().length < 2)
      newErrors.name = "Book name must be at least 2 characters";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory)
      newErrors.subcategory = "Subcategory is required";
    if (!formData.condition) newErrors.condition = "Condition is required";
    else if (formData.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (
      formData.selltype === "sell" &&
      (!formData.price || Number(formData.price) <= 0)
    ) {
      newErrors.price = "Valid price is required";
    }
    if (!photo) newErrors.photo = "Book photo is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, photo]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleCategoryChange = useCallback((e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, category: value, subcategory: "" }));
    setErrors((prev) => ({ ...prev, category: "", subcategory: "" }));
  }, []);

  const handleSellTypeChange = useCallback((e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      selltype: value,
      price: value === "donate" ? "0" : prev.price,
    }));
    setErrors((prev) => ({ ...prev, price: "" }));
  }, []);

  const handlePhotoChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/"))
        return setErrors((prev) => ({
          ...prev,
          photo: "Only image files allowed",
        }));
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size exceeds 5MB. Please choose a smaller file.");
        return setErrors((prev) => ({
          ...prev,
          photo: "Image must be under 5MB",
        }));
      }
      if (preview) URL.revokeObjectURL(preview);
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, photo: "" }));
    },
    [preview],
  );

  const handleRemovePhoto = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(null);
    setPreview(null);
    setErrors((prev) => ({ ...prev, photo: "Book photo is required" }));
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }

    setLoading(true);
    setSubmitStatus("submitting");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to list books");
        navigate("/login");
        return;
      }

      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append(
        "price",
        formData.selltype === "donate" ? "0" : formData.price,
      );
      submitData.append("categeory", formData.category);
      submitData.append("subcategeory", formData.subcategory);
      submitData.append("condition", formData.condition);
      submitData.append("description", formData.description.trim());
      submitData.append("location", formData.location.trim());
      submitData.append("selltype", formData.selltype);
      submitData.append("soldstatus", formData.soldstatus);
      if (photo) submitData.append("image", photo);

      const response = await fetch(
        `${import.meta.env.VITE_API_PATH}/books/sellbook`,
        {
          method: "POST",
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: submitData,
        },
      );

      if (response.ok) {
        const data = await response.json();
        alert("Book listed successfully!");
        setFormData({
          name: "",
          price: "",
          category: "",
          subcategory: "",
          condition: "",
          description: "",
          location: "",
          selltype: "sell",
          soldstatus: "Instock",
        });
        setPhoto(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setErrors({});
        setSubmitStatus("success");
        setTimeout(() => navigate("/thankyou"), 1500);
      } else {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      if (error.name === "AbortError")
        alert("Request timeout. Try a smaller image.");
      else if (error.message.includes("401") || error.message.includes("403")) {
        alert("Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else alert(`Submission failed: ${error.message}`);
      setSubmitStatus("error");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setLoading(false);
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  return (
    <div className="sellbooks-container">
      <div className="sellbooks-header">
        <h1 className="sellbooks-title">List Your Book</h1>
        <p className="sellbooks-subtitle">
          Sell or Donate your books to students across India
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Listing your book... Please wait</p>
        </div>
      ) : (
        <form className="sellbooks-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>
              Book Photo <span className="required">*</span>
            </h3>
            <div className="form-group">
              <label className="upload-label">
                <div className="upload-icon">📸</div>
                <div className="upload-text">
                  Click to upload or drag & drop
                  <div className="upload-hint">PNG, JPG(Max 5MB)</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="file-input"
                />
              </label>
              {errors.photo && <span className="error">{errors.photo}</span>}
              {preview && (
                <div className="photo-preview">
                  <img src={preview} alt="Book Preview" />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="remove-preview"
                    title="Remove photo"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>
                  Book Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Introduction to Algorithms (CLRS)"
                  maxLength={100}
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Selling Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="selltype"
                      value="sell"
                      checked={formData.selltype === "sell"}
                      onChange={handleSellTypeChange}
                    />
                    <span>Sell</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="selltype"
                      value="donate"
                      checked={formData.selltype === "donate"}
                      onChange={handleSellTypeChange}
                    />
                    <span>Donate (Free)</span>
                  </label>
                </div>
              </div>
            </div>

            {formData.selltype === "sell" && (
              <div className="form-group">
                <label>
                  Expected Price (₹) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="1"
                  max="50000"
                  step="0.01"
                  placeholder="Ex: 250"
                  className={errors.price ? "input-error" : ""}
                />
                {errors.price && <span className="error">{errors.price}</span>}
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>Category & Condition</h3>
            <div className="form-row">
              <div className="form-group">
                <label>
                  Category <span className="required">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className={errors.category ? "input-error" : ""}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="error">{errors.category}</span>
                )}
              </div>
              <div className="form-group">
                <label>
                  Subcategory <span className="required">*</span>
                </label>

                {String(formData.category).toLowerCase() === "others" ? (
                  <input
                    type="text"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    placeholder="Enter Subcategory"
                    className={errors.subcategory ? "input-error" : ""}
                  />
                ) : (
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    disabled={!formData.category}
                    className={errors.subcategory ? "input-error" : ""}
                  >
                    <option value="">Select Subcategory</option>
                    {formData.category &&
                      subcategoriesMap[formData.category]?.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                )}

                {errors.subcategory && (
                  <span className="error">{errors.subcategory}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Book Condition <span className="required">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className={errors.condition ? "input-error" : ""}
                >
                  <option value="">Select Condition</option>
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
                {errors.condition && (
                  <span className="error">{errors.condition}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Description</h3>
            <div className="form-group">
              <label>
                Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mention edition, author, usage, markings, missing pages, etc."
                rows="5"
                maxLength={1000}
                className={errors.description ? "input-error" : ""}
              />
              {errors.description && (
                <span className="error">{errors.description}</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Location</h3>
            <div className="form-group">
              <label>
                Pickup Location <span className="required">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State"
                className={errors.location ? "input-error" : ""}
              />
              {errors.location && (
                <span className="error">{errors.location}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || submitStatus === "submitting"}
            >
              {submitStatus === "submitting"
                ? "Submitting..."
                : formData.selltype === "donate"
                  ? "Donate Book"
                  : "List Book for Sale"}
            </button>
            {submitStatus === "success" && (
              <p className="success-text">Book listed successfully!</p>
            )}
            {submitStatus === "error" && (
              <p className="error-text">Please fix errors and try again</p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
