import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

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
      <section className="wardrobe-card">
        <h2 className="wardrobe-section-title">What's the occasion?</h2>
        <form onSubmit={handleAsk} className="wardrobe-form">
          <input
            type="text"
            placeholder="e.g. What should I wear to a coffee date?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="wardrobe-input"
          />
          <button type="submit" disabled={loading} className="wardrobe-btn">
            {loading ? "Thinking..." : "DRESS ME!"}
          </button>
          {error && <p className="wardrobe-error">{error}</p>}
        </form>
      </section>

      {/* The fun "MIS-MATCH" moment: shown instead of the normal result
          when our own validate_outfit() caught a problem with the AI's pick. */}
      {hasMismatch && (
        <div className="wardrobe-mismatch-banner">
          <p className="wardrobe-mismatch-text">MIS-MATCH!</p>
          <p className="wardrobe-mismatch-subtext">
            Even our AI stylist had an off day -- try asking again!
          </p>
        </div>
      )}

      {result && !hasMismatch && (
        <section className="wardrobe-result-section">
          {/* The "paper doll" -- outfit pieces stacked vertically */}
          <div className="wardrobe-paper-doll">
            {outfitItems.map((item) => (
              <div key={item.id} className="wardrobe-paper-doll-card">
                <img
                  src={item.image_url}
                  alt={item.color}
                  className="wardrobe-paper-doll-image"
                />
                <p className="wardrobe-card-text wardrobe-muted">{item.category}</p>
              </div>
            ))}
          </div>

          <div className="wardrobe-reason-card">
            <p className="wardrobe-reason-text">{result.reason}</p>
          </div>
        </section>
      )}
    </div>
  );
}

export default StylistPage;
