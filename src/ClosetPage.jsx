import { useState, useEffect } from "react";

const API_URL = "http://localhost:8000";

const CATEGORIES = ["top", "bottom", "shoes", "dress", "outerwear", "accessory"];

function ClosetPage() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [tags, setTags] = useState("");

  function loadClothes() {
    setLoading(true);
    fetch(`${API_URL}/clothes`)
      .then((response) => response.json())
      .then((data) => {
        setClothes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load closet:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadClothes();
  }, []);

  function handleUpload(event) {
    event.preventDefault();
    setUploadError(null);

    if (!file) {
      setUploadError("Please choose a photo first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("color", color);
    formData.append("style", style);
    if (tags.trim()) {
      formData.append("tags", tags.trim());
    }

    setUploading(true);

    fetch(`${API_URL}/clothes/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            throw new Error(errData.detail || "Upload failed");
          });
        }
        return response.json();
      })
      .then(() => {
        setFile(null);
        setColor("");
        setStyle("");
        setTags("");
        setUploading(false);
        loadClothes();
      })
      .catch((error) => {
        setUploadError(error.message);
        setUploading(false);
      });
  }

  return (
    <div>
      <section className="wardrobe-card">
        <h2 className="wardrobe-section-title">Add a New Item</h2>
        <form onSubmit={handleUpload} className="wardrobe-form">
          <div className="wardrobe-file-wrap">
            <input
              type="file"
              accept="image/*"
              id="closet-photo-upload"
              className="wardrobe-file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && <span className="wardrobe-file-name">{file.name}</span>}
          </div>

          <select
            className="wardrobe-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Color (e.g. White)"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="wardrobe-input"
          />

          <input
            type="text"
            placeholder="Style (e.g. Casual)"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="wardrobe-input"
          />

          <input
            type="text"
            placeholder="Tags (optional, e.g. summer)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="wardrobe-input"
          />

          <button type="submit" disabled={uploading} className="wardrobe-btn">
            {uploading ? "Uploading..." : "DRESS ME UP"}
          </button>

          {uploadError && <p className="wardrobe-error">{uploadError}</p>}
        </form>
      </section>

      <section>
        <h2 className="wardrobe-section-title wardrobe-section-title--left">
          Your Closet
        </h2>
        {loading ? (
          <p className="wardrobe-loading">Loading your closet</p>
        ) : clothes.length === 0 ? (
          <p className="wardrobe-empty">No items yet -- add your first one above!</p>
        ) : (
          <div className="wardrobe-grid">
            {clothes.map((item) => (
              <div key={item.id} className="wardrobe-item-card">
                <img src={item.image_url} alt={item.color} className="wardrobe-image" />
                <p className="wardrobe-card-text">
                  <strong>{item.category}</strong>
                </p>
                <p className="wardrobe-card-text">{item.color}</p>
                <p className="wardrobe-card-text wardrobe-muted">{item.style}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ClosetPage;
