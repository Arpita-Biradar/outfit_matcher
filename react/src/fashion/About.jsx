import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">
        About <span>StyleMate</span>
      </h1>

      <p className="about-intro">
        StyleMate is your personal fashion companion, helping you feel
        confident, expressive, and effortlessly stylish every day.
      </p>

      <div className="about-sections">
        <div className="about-card">
          <div className="icon">M</div>
          <h3>Our Mission</h3>
          <p>
            To simplify fashion choices and empower everyone to dress with
            confidence.
          </p>
        </div>

        <div className="about-card">
          <div className="icon">W</div>
          <h3>What We Do</h3>
          <p>
            We recommend outfits based on your taste, trends, and occasions all
            in one place.
          </p>
        </div>

        <div className="about-card">
          <div className="icon">S</div>
          <h3>Why StyleMate</h3>
          <p>
            Because great style should feel natural, fun, and uniquely you.
          </p>
        </div>
      </div>
    </div>
  );
}
