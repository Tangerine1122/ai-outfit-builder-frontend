import { useState, useEffect } from "react";

const API_URL = "http://localhost:8000";

const CATEGORIES = ["top", "bottom", "shoes", "dress", "outerwear", "accessory"];

function App() {
  // Holds the list of clothing items fetched from the backend.
  const [clothes, setClothes] = useState([]);
  // Tracks whether we're still loading the initial list (so we can
  // show "Loading..." instead of a confusing empty grid for a moment).
  const [loading, setLoading] = useState(true);
  // Tracks whether an upload is currently in progress, so we can
  // disable the submit button and show feedback.
  const [uploading, setUploading] = useState(false);
  // Holds any error message from a failed upload, so we can show it.
  const [uploadError, setUploadError] = useState(null);

  // Form fields for the upload form.
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [tags, setTags] = useState("");

  // Fetches the current closet from the backend.
  // Defined as its own function (not just inline in useEffect) so we
  // can also call it again after a successful upload, to refresh the grid.
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

  // Run once when the page first loads.
  useEffect(() => {
    loadClothes();
  }, []);

  function handleUpload(event) {
    event.preventDefault(); // stop the browser's default full-page-reload form submit
    setUploadError(null);

    if (!file) {
      setUploadError("Please choose a photo first.");
      return;
    }

    // File uploads must be sent as FormData, not plain JSON --
    // this matches what our FastAPI route expects (UploadFile + Form fields).
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("color", color);
    formData.append("style", style);
    // Only send a tag if one was actually typed, avoiding the
    // "empty string in tags" quirk we noticed earlier.
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
        // Success: clear the form and refresh the grid.
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
    <div style={styles.page}>
      <h1 style={styles.header}>DEE'S WARDROBE</h1>

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
          />

          <input
            type="text"
            placeholder="Style (e.g. Casual)"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Tags (optional, e.g. summer)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
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

// Inline styles for now -- simple and fine for this stage. We can move
// to a proper stylesheet/theme system once the layout itself is settled.
const styles = {
  page: {
    backgroundColor: "#fdf2f8", // soft pink
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "900",
    letterSpacing: "0.05em",
    color: "#a855f7", // lavender/purple
    textAlign: "center",
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#7e22ce",
    marginBottom: "0.75rem",
  },
  uploadCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "1.5rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 0 #f0abfc", // chunky "3D" shadow effect
    maxWidth: "500px",
    margin: "0 auto 2rem auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  button: {
    backgroundColor: "#c084fc",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "0.75rem",
    fontWeight: "800",
    letterSpacing: "0.05em",
    cursor: "pointer",
    boxShadow: "0 4px 0 #7e22ce", // chunky beveled-button look
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
    borderRadius: "16px",
    padding: "1rem",
    textAlign: "center",
    boxShadow: "0 3px 0 #bbf7d0", // mint accent shadow
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
  },
  cardTextMuted: {
    margin: "0.1rem 0",
    fontSize: "0.85rem",
    color: "#888",
  },
};

export default App;