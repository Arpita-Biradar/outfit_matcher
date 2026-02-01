import { useState } from "react";
import "./App.css";
import Home from "./fashion/home";
import Sidebar from "./fashion/Sidebar";
import About from  "./fashion/About";

export default function App() {
  const [active, setActive] = useState("home");

  return (
    <div style={{ display: "flex" }}>
      <Sidebar active={active} setActive={setActive} />

      <div style={{ flex: 1 }}>
        {active === "home" && <Home />}
        {active === "about" && <About />}
      </div>
    </div>
  );
}
