import { useEffect, useState } from "react";
import "./Home.css";

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setMoveUp(true), 800);
    const t2 = setTimeout(() => setShowSearch(true), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/api/style", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResult(data.result || "No suggestion found");
    } catch (err) {
      console.error("Frontend error:", err);
      setResult("❌ Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="home-container">
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

      {(loading || result) && (
        <div className="result-box">
          {loading ? (
            <p>Finding the perfect style for you… ✨</p>
          ) : (
            <pre>{result}</pre>
          )}
        </div>
      )}
    </div>
  );
}
