import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ active, setActive }) {
  const [showLogout, setShowLogout] = useState(false);

  return ( 
    <>
      <div className="sidebar">
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

        <div className="profile-section">
          <div
            className="profile-icon"
            onClick={() => setShowLogout(true)}
          >
            👤
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
