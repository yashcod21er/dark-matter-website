import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Menu, X, Radio, Compass } from "lucide-react";
import { cosmicAudio } from "../utils/audioSynth";

export default function Navbar({ activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioActive, setAudioActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const state = cosmicAudio.toggleSound();
    setAudioActive(state);
  };

  const navItems = [
    { label: "Overview", href: "#hero" },
    { label: "What Is It?", href: "#introduction" },
    { label: "Composition", href: "#composition" },
    { label: "Evidence Lab", href: "#evidence" },
    { label: "Cosmic Web", href: "#cosmic-web" },
    { label: "Candidates", href: "#candidates" },
    { label: "Mysteries", href: "#mysteries" },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      {/* Brand & Observatory Callout */}
      <a href="#hero" className="navbar-brand" onClick={(e) => scrollToSection(e, "#hero")}>
        <div className="brand-icon">
          <svg width="26" height="26" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#9d4edd" strokeWidth="4" strokeDasharray="6 6" />
            <circle cx="50" cy="50" r="26" fill="rgba(157, 78, 221, 0.4)" />
            <circle cx="50" cy="50" r="12" fill="#00f5d4" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontWeight: 800, letterSpacing: "0.08em" }}>DARK MATTER</span>
            <span className="brand-badge">ASTROPHYSICS</span>
          </div>
          <span style={{ fontSize: "0.62rem", fontFamily: "var(--font-mono, monospace)", color: "#64748b", letterSpacing: "0.04em" }}>
            OBSERVATORY 3D LAB
          </span>
        </div>
      </a>

      {/* Primary Navigation Links */}
      <nav>
        <ul className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          {navItems.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  onClick={(e) => scrollToSection(e, item.href)}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Right Actions: Interactive Synthesizer Audio + Mobile Menu */}
      <div className="nav-actions">
        <button
          onClick={handleAudioToggle}
          className={`audio-toggle-btn ${audioActive ? "active" : ""}`}
          title="Toggle Procedural Cosmic Audio"
          aria-label="Toggle Cosmic Audio"
        >
          {audioActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <div className="eq-bar-group">
            <span className={`eq-bar ${audioActive ? "active" : ""}`} style={{ height: audioActive ? "8px" : "3px" }} />
            <span className={`eq-bar ${audioActive ? "active" : ""}`} style={{ height: audioActive ? "12px" : "3px" }} />
            <span className={`eq-bar ${audioActive ? "active" : ""}`} style={{ height: audioActive ? "6px" : "3px" }} />
          </div>
          <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)" }}>
            {audioActive ? "AUDIO ON" : "AUDIO OFF"}
          </span>
        </button>

        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
