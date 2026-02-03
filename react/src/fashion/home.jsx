import { useEffect, useState } from "react";
import "./Home.css";

const parseResult = (text) => {
  const lines = text.split("\n");
  const intro = [];
  const sections = [];
  let current = null;

  const pushCurrent = () => {
    if (current) {
      sections.push(current);
      current = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("###")) {
      pushCurrent();
      current = {
        title: line.replace(/^#+\s*/, ""),
        rows: [],
        paragraphs: [],
      };
      continue;
    }

    const match = line.match(/^\*\*(.+?)\*\*:\s*(.+)$/);
    if (match) {
      if (!current) {
        current = { title: "", rows: [], paragraphs: [] };
      }
      current.rows.push({
        label: match[1].trim(),
        text: match[2].trim(),
      });
      continue;
    }

    const clean = line.replace(/\*\*/g, "");
    if (current) {
      current.paragraphs.push(clean);
    } else {
      intro.push(clean);
    }
  }

  if (current) {
    sections.push(current);
  }

  return { intro, sections };
};

export default function Home({
  gender,
  sizeRange,
  budget,
  favoriteColors,
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

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
    setImageLoading(true);
    setImages([]);

    try {
      const colorList = favoriteColors
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean);

      const profileLines = [];
      if (gender) profileLines.push(`Gender: ${gender}`);
      if (sizeRange) profileLines.push(`Size range: ${sizeRange}`);
      if (budget) profileLines.push(`Budget: ${budget}`);
      if (colorList.length) {
        profileLines.push(`Favorite colors: ${colorList.join(", ")}`);
      }

      const enrichedQuery = profileLines.length
        ? `${query}\n\nProfile preferences:\n${profileLines.join("\n")}`
        : query;

      const styleRequest = fetch("http://localhost:5000/api/style", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: enrichedQuery }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("Style request failed");
        }
        return response.json();
      });

      const imageRequest = fetch(
        `http://localhost:5000/api/image?query=${encodeURIComponent(query)}&count=3`
      ).then(async (response) => {
        if (!response.ok) {
          throw new Error("Image request failed");
        }
        return response.json();
      });

      const [styleOutcome, imageOutcome] = await Promise.allSettled([
        styleRequest,
        imageRequest,
      ]);

      if (styleOutcome.status === "fulfilled") {
        setResult(styleOutcome.value?.result || "No suggestion found");
      } else {
        setResult("Server error. Try again.");
      }

      if (imageOutcome.status === "fulfilled") {
        const gallery = imageOutcome.value?.images || [];
        setImages(gallery);
      }
    } catch (err) {
      console.error("Frontend error:", err);
      setResult("Server error. Try again.");
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    const { intro, sections } = parseResult(result);

    if (!intro.length && !sections.length) {
      return <p className="result-intro">{result}</p>;
    }

    return (
      <div className="result-content">
        {intro.map((line, index) => (
          <p className="result-intro" key={`intro-${index}`}>
            {line}
          </p>
        ))}

        {sections.map((section, index) => (
          <div className="result-section" key={`section-${index}`}>
            {section.title && (
              <h3 className="result-title">{section.title}</h3>
            )}
            {section.paragraphs.map((paragraph, pIndex) => (
              <p className="result-paragraph" key={`p-${index}-${pIndex}`}>
                {paragraph}
              </p>
            ))}
            {section.rows.map((row, rowIndex) => (
              <div className="result-row" key={`row-${index}-${rowIndex}`}>
                <span className="result-label">{row.label}</span>
                <span className="result-text">{row.text}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="home-container">
      <div className={`hero ${moveUp ? "move-up" : ""}`}>
        <h1 className="brand-title">
          StyleMate <span className="sparkle">*</span>
        </h1>
        <p className="tagline">
          Your personal fashion assistant
          <br />
          <span>Dress smart. Feel confident. Own your style.</span>
        </p>
      </div>

      {showSearch && (
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Tell me what you're looking for..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            Find My Style
          </button>
        </div>
      )}

      {(loading || result || imageLoading || images.length > 0) && (
        <div className="result-box">
          {(imageLoading || images.length > 0) && (
            <div className="result-gallery">
              {imageLoading && images.length === 0
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div className="image-skeleton" key={`sk-${index}`} />
                  ))
                : images.map((image, index) => (
                    <figure className="gallery-card" key={`img-${index}`}>
                      <img
                        src={image.imageUrl}
                        alt={image.imageAlt || "Style suggestion"}
                      />
                      {(image.creditName || image.imageLink) && (
                        <figcaption className="image-credit">
                          Photo{" "}
                          {image.creditLink ? (
                            <a
                              href={image.creditLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {image.creditName || "Unsplash"}
                            </a>
                          ) : (
                            image.creditName || "Unsplash"
                          )}{" "}
                          {image.imageLink ? (
                            <>
                              on{" "}
                              <a
                                href={image.imageLink}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Unsplash
                              </a>
                            </>
                          ) : (
                            "on Unsplash"
                          )}
                        </figcaption>
                      )}
                    </figure>
                  ))}
            </div>
          )}

          <div className="result-text-panel">
            {loading ? (
              <p className="result-loading">
                Finding the perfect style for you...
              </p>
            ) : (
              renderResult()
            )}
          </div>
        </div>
      )}
    </div>
  );
}
