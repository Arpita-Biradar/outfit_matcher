import { useEffect, useState } from "react";
import "./Home.css";

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t1 = setTimeout(() => setMoveUp(true), 800);
    const t2 = setTimeout(() => setShowSearch(true), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    alert(`Searching outfits for: ${query}`);
  };

  return (
    <div className="home-container">
      {/* Hero / Brand Section */}
      <div className={`hero ${moveUp ? "move-up" : ""}`}>
        <h1 className="brand-title">
          StyleMate <span className="sparkle">✨</span>
        </h1>

        <p className="tagline">
          Your personal fashion assistant 👗
          <br />
          <span>Dress smart. Feel confident. Own your style.</span>
        </p>
      </div>

      {/* Search Section */}
      {showSearch && (
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Tell me what you're looking for…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button className="search-btn" onClick={handleSearch}>
            Find My Style 🔍
          </button>
        </div>
      )}
    </div>
  );
}
