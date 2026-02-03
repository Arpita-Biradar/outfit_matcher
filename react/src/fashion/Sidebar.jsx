import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({
  active,
  setActive,
  gender,
  setGender,
  sizeRange,
  setSizeRange,
  budget,
  setBudget,
  favoriteColors,
  setFavoriteColors,
}) {
  const [showLogout, setShowLogout] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="nav-items">
            <div className="sidebar-logo">
              <img src="/src/assets/stylemate.png" alt="StyleMate Logo" />
            </div>

            <button
              className={`nav-btn ${active === "home" ? "active" : ""}`}
              onClick={() => setActive("home")}
            >
              Home
            </button>

            <button
              className={`nav-btn ${active === "about" ? "active" : ""}`}
              onClick={() => setActive("about")}
            >
              About Us
            </button>
          </div>

          <div className={`filters-panel ${filtersOpen ? "open" : ""}`}>
            <button
              type="button"
              className="filters-toggle"
              onClick={() => setFiltersOpen((prev) => !prev)}
              aria-expanded={filtersOpen}
            >
              <span>Filters</span>
              <span className="filters-chevron">
                {filtersOpen ? "-" : "+"}
              </span>
            </button>

            <div className="filters-body">
              <label className="filter-field">
                <span>Gender</span>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </label>

              <label className="filter-field">
                <span>Size Range</span>
                <select
                  value={sizeRange}
                  onChange={(e) => setSizeRange(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="XS - S">XS - S</option>
                  <option value="M - L">M - L</option>
                  <option value="XL - XXL">XL - XXL</option>
                  <option value="Plus size">Plus size</option>
                </select>
              </label>

              <label className="filter-field">
                <span>Budget</span>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>

              <label className="filter-field">
                <span>Favorite Colors</span>
                <input
                  type="text"
                  value={favoriteColors}
                  onChange={(e) => setFavoriteColors(e.target.value)}
                  placeholder="blush, black, emerald"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div
            className="profile-icon"
            onClick={() => setShowLogout(true)}
          >
            U
          </div>
        </div>
      </div>

      {showLogout && (
        <div className="overlay">
          <div className="logout-popup">
            <p>Are you sure you want to logout?</p>
            <div className="popup-actions">
              <button className="logout-btn">Logout</button>
              <button
                className="cancel-btn"
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
