import { useState, useEffect } from "react";

const API_URL = "http://localhost:8000";

function StylistPage() {
  // The full closet, fetched once, so we can look up image/color/style
  // for whatever item_ids the AI recommends (the recommend route only
  // returns ids, not full item details).
  const [allClothes, setAllClothes] = useState([]);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // the raw API response
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/clothes`)
      .then((response) => response.json())
      .then((data) => setAllClothes(data))
      .catch((err) => console.error("Failed to load closet for lookup:", err));
  }, []);

  function handleAsk(event) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!prompt.trim()) {
      setError("Type something first -- e.g. \"What should I wear to a coffee date?\"");
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/stylist/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            throw new Error(errData.detail || "Something went wrong.");
          });
        }
        return response.json();
      })
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  // Turns the AI's list of {item_id: 1} entries into full item objects
  // (with image_url, category, etc.) by matching against allClothes.
  function getOutfitItems() {
    if (!result) return [];
    return result.outfit
      .map((entry) => allClothes.find((item) => item.id === entry.item_id))
      .filter(Boolean); // in case an id somehow doesn't match anything
  }

  const hasMismatch = result && result.validation_problems.length > 0;
  const outfitItems = getOutfitItems();

  return (
    <div>
      <section style={styles.askCard}>
        <h2 style={styles.sectionTitle}>What's the occasion?</h2>
        <form onSubmit={handleAsk} style={styles.form}>
          <input
            type="text"
            placeholder="e.g. What should I wear to a coffee date?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={styles.textInput}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Thinking..." : "DRESS ME!"}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </section>

      {/* The fun "MIS-MATCH" moment: shown instead of the normal result
          when our own validate_outfit() caught a problem with the AI's pick. */}
      {hasMismatch && (
        <div style={styles.mismatchBanner}>
          <p style={styles.mismatchText}>MIS-MATCH!</p>
          <p style={styles.mismatchSubtext}>
            Even our AI stylist had an off day -- try asking again!
          </p>
        </div>
      )}

      {result && !hasMismatch && (
        <section style={styles.resultSection}>
          {/* The "paper doll" -- outfit pieces stacked vertically */}
          <div style={styles.paperDoll}>
            {outfitItems.map((item) => (
              <div key={item.id} style={styles.paperDollCard}>
                <img src={item.image_url} alt={item.color} style={styles.paperDollImage} />
                <p style={styles.cardTextMuted}>{item.category}</p>
              </div>
            ))}
          </div>

          <div style={styles.reasonCard}>
            <p style={styles.reasonText}>{result.reason}</p>
          </div>
        </section>
      )}
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
  askCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "1.5rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 0 #f0abfc",
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
    border: "2px solid #f0abfc",
    fontSize: "1rem",
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
    boxShadow: "0 4px 0 #7e22ce",
  },
  error: {
    color: "#dc2626",
    fontWeight: "600",
  },
  mismatchBanner: {
    backgroundColor: "#fef08a",
    border: "3px dashed #ca8a04",
    borderRadius: "16px",
    padding: "1.5rem",
    textAlign: "center",
    maxWidth: "500px",
    margin: "0 auto",
  },
  mismatchText: {
    fontSize: "2rem",
    fontWeight: "900",
    color: "#ca8a04",
    letterSpacing: "0.05em",
    margin: 0,
  },
  mismatchSubtext: {
    color: "#854d0e",
    marginTop: "0.5rem",
  },
  resultSection: {
    maxWidth: "400px",
    margin: "0 auto",
  },
  paperDoll: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
  },
  paperDollCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "0.75rem",
    textAlign: "center",
    boxShadow: "0 3px 0 #bbf7d0",
    width: "200px",
  },
  paperDollImage: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "12px",
  },
  cardTextMuted: {
    margin: "0.4rem 0 0 0",
    fontSize: "0.85rem",
    color: "#888",
    textTransform: "capitalize",
  },
  reasonCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "1.25rem",
    marginTop: "1.5rem",
    boxShadow: "0 3px 0 #f0abfc",
  },
  reasonText: {
    margin: 0,
    fontStyle: "italic",
    color: "#555",
    lineHeight: "1.5",
  },
};

export default StylistPage;