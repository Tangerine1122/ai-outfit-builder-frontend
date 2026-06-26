import { useState, useEffect } from "react";

const API_URL = "http://localhost:8000";

// The slots she can manually build an outfit from, in display order.
const SLOTS = ["top", "bottom", "shoes", "outerwear", "accessory"];

function MixMatchPage() {
  const [allClothes, setAllClothes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tracks which INDEX (within that category's items) is currently shown
  // for each slot. e.g. { top: 0, bottom: 2, shoes: 1 }
  const [selectedIndex, setSelectedIndex] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/clothes`)
      .then((response) => response.json())
      .then((data) => {
        setAllClothes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load closet:", err);
        setLoading(false);
      });
  }, []);

  function itemsForSlot(slot) {
    return allClothes.filter((item) => item.category === slot);
  }

  function cycle(slot, direction) {
    const items = itemsForSlot(slot);
    if (items.length === 0) return;

    const currentIndex = selectedIndex[slot] ?? 0;
    const nextIndex = (currentIndex + direction + items.length) % items.length;

    setSelectedIndex({ ...selectedIndex, [slot]: nextIndex });
  }

  if (loading) {
    return <p>Loading your closet...</p>;
  }

  return (
    <div>
      <p style={styles.intro}>
        Build your own look -- browse each category and mix it your way!
      </p>

      <div style={styles.slotsContainer}>
        {SLOTS.map((slot) => {
          const items = itemsForSlot(slot);
          const currentIndex = selectedIndex[slot] ?? 0;
          const currentItem = items[currentIndex];

          return (
            <div key={slot} style={styles.slotCard}>
              <p style={styles.slotLabel}>{slot.toUpperCase()}</p>

              {items.length === 0 ? (
                <p style={styles.emptySlot}>No {slot} yet!</p>
              ) : (
                <div style={styles.browseRow}>
                  <button style={styles.arrowButton} onClick={() => cycle(slot, -1)}>
                    {"<"}
                  </button>

                  <div style={styles.itemPreview}>
                    <img
                      src={currentItem.image_url}
                      alt={currentItem.color}
                      style={styles.itemImage}
                    />
                    <p style={styles.itemCaption}>{currentItem.color}</p>
                    <p style={styles.itemCounter}>
                      {currentIndex + 1} / {items.length}
                    </p>
                  </div>

                  <button style={styles.arrowButton} onClick={() => cycle(slot, 1)}>
                    {">"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  intro: {
    textAlign: "center",
    color: "#7e22ce",
    fontWeight: "600",
    marginBottom: "1.5rem",
  },
  slotsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    maxWidth: "420px",
    margin: "0 auto",
  },
  slotCard: {
    backgroundColor: "#ffffff",
    border: "2px solid #7e22ce",
    borderRadius: "16px",
    padding: "1rem",
    boxShadow: "0 4px 0 #c084fc",
  },
  slotLabel: {
    margin: "0 0 0.5rem 0",
    fontWeight: "700",
    fontSize: "0.85rem",
    letterSpacing: "0.1em",
    color: "#7e22ce",
    fontFamily: "'Fredoka', sans-serif",
  },
  emptySlot: {
    color: "#aaa",
    fontStyle: "italic",
    margin: 0,
  },
  browseRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
  },
  arrowButton: {
    backgroundColor: "#c084fc",
    color: "white",
    border: "2px solid #7e22ce",
    borderRadius: "10px",
    width: "40px",
    height: "40px",
    fontSize: "1.2rem",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "0 3px 0 #7e22ce",
    flexShrink: 0,
    fontFamily: "'Fredoka', sans-serif",
  },
  itemPreview: {
    flex: 1,
    textAlign: "center",
  },
  itemImage: {
    width: "100%",
    maxWidth: "200px",
    height: "160px",
    objectFit: "cover",
    borderRadius: "12px",
  },
  itemCaption: {
    margin: "0.4rem 0 0 0",
    fontSize: "0.9rem",
    textTransform: "capitalize",
    fontFamily: "'Fredoka', sans-serif",
  },
  itemCounter: {
    margin: "0.1rem 0 0 0",
    fontSize: "0.75rem",
    color: "#aaa",
  },
};

export default MixMatchPage;