import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/sellbook.css";

const categories = [
  "School Books (Class 1-12)",
  "College & University Books",
  "Competitive Exam Books",
  "Fictional Books",
  "Non-Fiction Books",
  "others",
];

const subcategoriesMap = {
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

const normalizeStr = (x) =>
  typeof x === "string" ? x.trim() : x != null ? String(x).trim() : "";

const buildLocationString = ({
  address,
  landmark,
  district,
  state,
  pincode,
}) => {
  const parts = [address, landmark, district, state]
    .map(normalizeStr)
    .filter(Boolean);

  const pin = normalizeStr(pincode);
  if (pin) parts.push(pin);

  return parts.join(", ");
};

// ✅ India PIN code API (simple + reliable)
// If you already have your own backend pincode API, replace this URL with yours.
const fetchPincodeDetails = async (pincode) => {
  const pin = String(pincode || "").trim();
  if (!/^\d{6}$/.test(pin)) return null;

  const url = `https://api.postalpincode.in/pincode/${pin}`;
  const res = await axios.get(url);

  const row = Array.isArray(res.data) ? res.data[0] : null;
  const postOffice = row?.PostOffice?.[0];

  if (!postOffice) return null;

  return {
    district: postOffice.District || "",
    state: postOffice.State || "",
  };
};

export default function SellBooks() {
  const navigate = useNavigate();

  // ✅ keep location as string (your backend schema expects String)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    condition: "",
    description: "",
    location: "", // this will be auto-built from locationInputs
    selltype: "sell",
    soldstatus: "Instock",
  });

  // ✅ new detailed inputs (all will be merged into formData.location)
  const [locationInputs, setLocationInputs] = useState({
    address: "",
    landmark: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState("");

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

  // ✅ whenever locationInputs changes, rebuild location string automatically
  useEffect(() => {
    const loc = buildLocationString(locationInputs);
    setFormData((prev) => ({ ...prev, location: loc }));
  }, [locationInputs]);

  // ✅ PINCODE AUTO-DETECT (debounced)
  useEffect(() => {
    const pin = normalizeStr(locationInputs.pincode);
    setPinError("");

    if (!pin) return;
    if (!/^\d{0,6}$/.test(pin)) {
      setPinError("Pincode must contain only digits.");
      return;
    }
    if (pin.length !== 6) return;

    let alive = true;
    const t = setTimeout(async () => {
      try {
        setPinLoading(true);
        const details = await fetchPincodeDetails(pin);

        if (!alive) return;

        if (!details) {
          setPinError("Invalid pincode or no data found.");
          return;
        }

        // ✅ auto-fill district/state (but keep address/landmark untouched)
        setLocationInputs((prev) => ({
          ...prev,
          district: prev.district?.trim() ? prev.district : details.district,
          state: prev.state?.trim() ? prev.state : details.state,
        }));
      } catch (e) {
        if (!alive) return;
        setPinError(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to fetch pincode data.",
        );
      } finally {
        if (alive) setPinLoading(false);
      }
    }, 450);

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [locationInputs.pincode]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Book name is required";
    else if (formData.name.trim().length < 2)
      newErrors.name = "Book name must be at least 2 characters";

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory)
      newErrors.subcategory = "Subcategory is required";
    if (!formData.condition) newErrors.condition = "Condition is required";

    if (!formData.description.trim())
      newErrors.description = "Description is required";
    else if (formData.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";

    // ✅ validate detailed location fields
    if (!normalizeStr(locationInputs.address))
      newErrors.address = "Address is required";
    if (!normalizeStr(locationInputs.district))
      newErrors.district = "District is required";
    if (!normalizeStr(locationInputs.state))
      newErrors.state = "State is required";

    const pin = normalizeStr(locationInputs.pincode);
    if (!pin) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(pin))
      newErrors.pincode = "Pincode must be 6 digits";

    // ✅ location string should not be empty
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
  }, [formData, photo, locationInputs]);

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

  const handleLocationChange = useCallback((e) => {
    const { name, value } = e.target;

    setLocationInputs((prev) => ({
      ...prev,
      [name]:
        name === "pincode" ? value.replace(/[^\d]/g, "").slice(0, 6) : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "", location: "" }));
    if (name === "pincode") setPinError("");
  }, []);

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
        navigate("/login");
        return;
      }

      const submitData = new FormData();

      submitData.append("name", formData.name.trim());
      submitData.append(
        "price",
        formData.selltype === "donate" ? "0" : String(formData.price).trim(),
      );
      submitData.append("categeory", formData.category);
      submitData.append("subcategeory", formData.subcategory);
      submitData.append("condition", formData.condition);
      submitData.append("description", formData.description.trim());

      // send individual fields required by backend
      submitData.append("address", locationInputs.address.trim());
      submitData.append("landmark", locationInputs.landmark.trim());
      submitData.append("district", locationInputs.district.trim());
      submitData.append("state", locationInputs.state.trim());
      submitData.append("pincode", locationInputs.pincode.trim());

      // optional combined location string if you still want it in DB
      submitData.append("location", formData.location.trim());

      submitData.append("selltype", formData.selltype);
      submitData.append("soldstatus", formData.soldstatus);

      if (photo) {
        submitData.append("image", photo);
      }

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || `Request failed with ${response.status}`,
        );
      }

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

      setLocationInputs({
        address: "",
        landmark: "",
        district: "",
        state: "",
        pincode: "",
      });

      setPhoto(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setErrors({});
      setSubmitStatus("success");

      setTimeout(() => navigate("/thankyou"), 1500);
    } catch (error) {
      console.error("Submit error:", error);

      if (error.name === "AbortError") {
        alert("Request timeout. Try a smaller image.");
      } else if (
        error.message.includes("401") ||
        error.message.includes("403")
      ) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(`Submission failed: ${error.message}`);
      }

      setSubmitStatus("error");
    } finally {
      clearTimeout(timeoutId);
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
          {/* PHOTO */}
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

          {/* BASIC */}
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

          {/* CATEGORY */}
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

          {/* DESCRIPTION */}
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

          {/* ✅ LOCATION (PINCODE AUTO DETECT) */}
          <div className="form-section">
            <h3>Location</h3>

            <div className="form-group">
              <label>
                Address <span className="required">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={locationInputs.address}
                onChange={handleLocationChange}
                placeholder="House no, street, area"
                className={errors.address ? "input-error" : ""}
              />
              {errors.address && (
                <span className="error">{errors.address}</span>
              )}
            </div>

            <div className="form-group">
              <label>Landmark (optional)</label>
              <input
                type="text"
                name="landmark"
                value={locationInputs.landmark}
                onChange={handleLocationChange}
                placeholder="Near temple / bus stop etc"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Pincode <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={locationInputs.pincode}
                  onChange={handleLocationChange}
                  placeholder="6-digit pincode"
                  inputMode="numeric"
                  className={errors.pincode ? "input-error" : ""}
                />
                {pinLoading ? (
                  <span className="hint">Detecting location…</span>
                ) : pinError ? (
                  <span className="error">{pinError}</span>
                ) : null}
                {errors.pincode && (
                  <span className="error">{errors.pincode}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  District <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  value={locationInputs.district}
                  onChange={handleLocationChange}
                  placeholder="Auto from pincode"
                  className={errors.district ? "input-error" : ""}
                />
                {errors.district && (
                  <span className="error">{errors.district}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  State <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={locationInputs.state}
                  onChange={handleLocationChange}
                  placeholder="Auto from pincode"
                  className={errors.state ? "input-error" : ""}
                />
                {errors.state && <span className="error">{errors.state}</span>}
              </div>
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
