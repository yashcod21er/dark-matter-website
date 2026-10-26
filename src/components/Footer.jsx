import React from "react";
import { ArrowUp, ExternalLink, Globe, BookOpen, ShieldCheck } from "lucide-react";
import { RESEARCH_SOURCES } from "../data/researchSources";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="navbar-brand" style={{ marginBottom: "1rem" }}>
              <div className="brand-icon">
                <svg width="24" height="24" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#9d4edd" strokeWidth="4" strokeDasharray="6 6" />
                  <circle cx="50" cy="50" r="26" fill="rgba(157, 78, 221, 0.4)" />
                  <circle cx="50" cy="50" r="12" fill="#00f5d4" />
                </svg>
              </div>
              <span>DARK MATTER</span>
            </div>
            <p style={{ fontSize: "0.85rem", maxWidth: "340px", marginBottom: "1.25rem" }}>
              An interactive 3D astrophysics platform dedicated to exploring the greatest gravitational puzzle in modern science.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span className="brand-badge" style={{ margin: 0 }}>
                NON-PROFIT EDUCATIONAL
              </span>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><a href="#hero" className="footer-link">Hero Galaxy</a></li>
              <li><a href="#introduction" className="footer-link">What is Dark Matter?</a></li>
              <li><a href="#composition" className="footer-link">Cosmic Composition</a></li>
              <li><a href="#evidence" className="footer-link">Scientific Evidence</a></li>
              <li><a href="#cosmic-web" className="footer-link">Cosmic Web Scaffold</a></li>
              <li><a href="#candidates" className="footer-link">Candidate Particles</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Primary Sources</h4>
            <ul className="footer-links">
              {RESEARCH_SOURCES.map((source, i) => (
                <li key={i}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                  >
                    <span>{source.name.split("—")[0]}</span>
                    <ExternalLink size={12} color="#00f5d4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Scientific Disclaimer</h4>
            <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.6 }}>
              Visualizations, glowing halos, and particle animations presented on this platform are pedagogical 3D simulations representing scientific models, not literal astronomical photographs. Dark matter produces no direct electromagnetic radiation.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} DARK MATTER — The Invisible Universe. Built with React & Three.js.
          </div>
          <button
            onClick={scrollToTop}
            className="btn-secondary"
            style={{ padding: "0.45rem 1rem", fontSize: "0.78rem" }}
            aria-label="Back to top of page"
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
