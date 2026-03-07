import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_PATH;

export default function UploadBookCategoryImage() {
  const [categeory, setCategeory] = useState("");
  const [subcategeory, setSubcategeory] = useState("");
  const [folderType, setFolderType] = useState("category");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!categeory && !subcategeory) {
      setError("Either categeory or subcategeory is required");
      return;
    }

    if (!image) {
      setError("Image is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("categeory", categeory);
      formData.append("subcategeory", subcategeory);
      formData.append("folderType", folderType);
      formData.append("image", image);

      await axios.post(`${API_BASE}/admin/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Image uploaded successfully");

      setCategeory("");
      setSubcategeory("");
      setImage(null);
      setPreview("");
    } catch (err) {
      setError(
        err?.response?.data?.error || "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Upload Book Category Image</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Category</label>
          <input
            type="text"
            value={categeory}
            onChange={(e) => setCategeory(e.target.value)}
          />
        </div>

        <div>
          <label>Subcategory</label>
          <input
            type="text"
            value={subcategeory}
            onChange={(e) => setSubcategeory(e.target.value)}
          />
        </div>

        <div>
          <label>Folder Type</label>
          <select
            value={folderType}
            onChange={(e) => setFolderType(e.target.value)}
          >
            <option value="category">Category</option>
            <option value="subcategory">Subcategory</option>
          </select>
        </div>

        <div>
          <label>Image</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        {preview && (
          <div>
            <img src={preview} alt="preview" width="150" />
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>

      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "20px",
  },
  wrapper: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "600",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
  },
  fileInput: {
    padding: "8px 0",
  },
  previewBox: {
    textAlign: "center",
  },
  previewImage: {
    width: "180px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#222",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  success: {
    color: "green",
    marginTop: "8px",
  },
  error: {
    color: "red",
    marginTop: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
  },
  imageCard: {
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    padding: "10px",
    textAlign: "center",
    background: "#fafafa",
  },
  gridImage: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  imageText: {
    fontSize: "14px",
    fontWeight: "500",
    wordBreak: "break-word",
  },
};