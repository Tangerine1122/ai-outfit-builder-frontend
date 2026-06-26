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
      <section style={styles.uploadCard}>
        <h2 style={styles.sectionTitle}>Add a New Item</h2>
        <form onSubmit={handleUpload} style={styles.form}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
            style={styles.textInput}
          />

          <input
            type="text"
            placeholder="Style (e.g. Casual)"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            style={styles.textInput}
          />

          <input
            type="text"
            placeholder="Tags (optional, e.g. summer)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={styles.textInput}
          />

          <button type="submit" disabled={uploading} style={styles.button}>
            {uploading ? "Uploading..." : "DRESS ME UP"}
          </button>

          {uploadError && <p style={styles.error}>{uploadError}</p>}
        </form>
      </section>

      <section>
        <h2 style={styles.sectionTitle}>Your Closet</h2>
        {loading ? (
          <p>Loading your closet...</p>
        ) : clothes.length === 0 ? (
          <p>No items yet -- add your first one above!</p>
        ) : (
          <div style={styles.grid}>
            {clothes.map((item) => (
              <div key={item.id} style={styles.card}>
                <img src={item.image_url} alt={item.color} style={styles.image} />
                <p style={styles.cardText}>
                  <strong>{item.category}</strong>
                </p>
                <p style={styles.cardText}>{item.color}</p>
                <p style={styles.cardTextMuted}>{item.style}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#7e22ce",
    marginBottom: "0.75rem",
  },
  uploadCard: {
    backgroundColor: "#ffffff",
    border: "2px solid #7e22ce",
    borderRadius: "20px",
    padding: "1.5rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 0 #c084fc",
    maxWidth: "500px",
    margin: "0 auto 2rem auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  textInput: {
    padding: "0.6rem",
    borderRadius: "10px",
    border: "2px solid #7e22ce",
    fontSize: "1rem",
    fontFamily: "'Fredoka', sans-serif",
  },
  button: {
    backgroundColor: "#c084fc",
    color: "white",
    border: "2px solid #7e22ce",
    borderRadius: "12px",
    padding: "0.75rem",
    fontWeight: "800",
    fontSize: "0.95rem",
    letterSpacing: "0.05em",
    fontFamily: "'Fredoka', sans-serif",
    cursor: "pointer",
    boxShadow: "0 4px 0 #7e22ce",
  },
  error: {
    color: "#dc2626",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "1.5rem",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "2px solid #7e22ce",
    borderRadius: "16px",
    padding: "1rem",
    textAlign: "center",
    boxShadow: "0 4px 0 #c084fc",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "0.5rem",
  },
  cardText: {
    margin: "0.1rem 0",
    fontSize: "0.95rem",
    textTransform: "capitalize",
    fontFamily: "'Fredoka', sans-serif",
  },
  cardTextMuted: {
    margin: "0.1rem 0",
    fontSize: "0.85rem",
    color: "#888",
  },
};

export default ClosetPage;