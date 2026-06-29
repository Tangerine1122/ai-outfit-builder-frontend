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
    return <p className="wardrobe-loading">Loading your closet</p>;
  }

  return (
    <div>
      <p className="wardrobe-intro">
        Build your own look -- browse each category and mix it your way!
      </p>

      <div className="wardrobe-slots-container">
        {SLOTS.map((slot) => {
          const items = itemsForSlot(slot);
          const currentIndex = selectedIndex[slot] ?? 0;
          const currentItem = items[currentIndex];

          return (
            <div key={slot} className="wardrobe-slot-card">
              <div className="wardrobe-slot-header">
                <p className="wardrobe-slot-label">{slot.toUpperCase()}</p>
              </div>

              <div className="wardrobe-slot-body">
                {items.length === 0 ? (
                  <p className="wardrobe-empty wardrobe-empty-slot">
                    No {slot} yet!
                  </p>
                ) : (
                  <div className="wardrobe-browse-row">
                    <button
                      className="wardrobe-btn-arrow"
                      onClick={() => cycle(slot, -1)}
                      aria-label={`Previous ${slot}`}
                    >
                      {"<"}
                    </button>

                    <div className="wardrobe-item-preview">
                      <img
                        src={currentItem.image_url}
                        alt={currentItem.color}
                        className="wardrobe-paper-doll-image"
                      />
                      <p className="wardrobe-item-caption">{currentItem.color}</p>
                      <p className="wardrobe-item-counter">
                        {currentIndex + 1} / {items.length}
                      </p>
                    </div>

                    <button
                      className="wardrobe-btn-arrow"
                      onClick={() => cycle(slot, 1)}
                      aria-label={`Next ${slot}`}
                    >
                      {">"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MixMatchPage;
