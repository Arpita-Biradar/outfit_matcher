import { useState } from "react";
import "./App.css";
import Home from "./fashion/home";
import Sidebar from "./fashion/Sidebar";
import About from "./fashion/About";

export default function App() {
  const [active, setActive] = useState("home");
  const [gender, setGender] = useState("");
  const [sizeRange, setSizeRange] = useState("");
  const [budget, setBudget] = useState("");
  const [favoriteColors, setFavoriteColors] = useState("");

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        active={active}
        setActive={setActive}
        gender={gender}
        setGender={setGender}
        sizeRange={sizeRange}
        setSizeRange={setSizeRange}
        budget={budget}
        setBudget={setBudget}
        favoriteColors={favoriteColors}
        setFavoriteColors={setFavoriteColors}
      />

      <div style={{ flex: 1 }}>
        {active === "home" && (
          <Home
            gender={gender}
            sizeRange={sizeRange}
            budget={budget}
            favoriteColors={favoriteColors}
          />
        )}
        {active === "about" && <About />}
      </div>
    </div>
  );
}
