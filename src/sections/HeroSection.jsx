import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, BookOpen, Sparkles, ArrowDown, Activity, ShieldCheck } from "lucide-react";
import GalaxyScene from "../scenes/GalaxyScene";
import { HERO_CONTENT } from "../data/scienceContent";
import { cosmicAudio } from "../utils/audioSynth";

export default function HeroSection() {
  const [showHalo, setShowHalo] = useState(true);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleToggleHalo = () => {
    setShowHalo((prev) => !prev);
    cosmicAudio.playPulse(showHalo ? 280 : 440);
  };

  return (
    <section id="hero" className="hero-section">
      <div className="container" style={{ position: "relative", zIndex: 5, width: "100%" }}>
        <div className="hero-content-wrapper">
          {/* Scientific Observatory Mission Tag */}
          <motion.div
            className="hero-tag"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Activity size={14} color="#00f5d4" />
            <span style={{ fontFamily: "var(--font-mono, monospace)" }}>
              ASTROPHYSICAL RESEARCH PORTAL • NGC 2841 MODEL
            </span>
          </motion.div>

          <motion.h1
            className="hero-heading text-gradient-cosmic"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            THE INVISIBLE MASS SHAPING REALITY.
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            85% of all matter in the universe produces no light, reflects no photons, and evades direct electromagnetic detection.
          </motion.p>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            We measure its gravitational signature in the anomalous rotation of spiral galaxies, the curvature of distant starlight, and the collision of galaxy clusters. Step inside the interactive laboratory.
          </motion.p>

          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              onClick={() => {
                scrollTo("evidence");
                cosmicAudio.playPulse(440);
              }}
              className="btn-primary"
              aria-label="Explore the scientific evidence"
            >
              <Compass size={17} />
              <span>ENTER THE EVIDENCE LAB</span>
            </button>

            <button
              onClick={() => {
                scrollTo("introduction");
                cosmicAudio.playPulse(330);
              }}
              className="btn-secondary"
              aria-label="Understand Dark Matter fundamentals"
            >
              <BookOpen size={16} />
              <span>THEORETICAL FOUNDATION</span>
            </button>
          </motion.div>

          {/* Research Telemetry Metrics Grid */}
          <motion.div
            className="hero-stats-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="stat-item">
              <span className="stat-value">26.8%</span>
              <span className="stat-label">Cosmic Mass-Energy</span>
              <span className="stat-detail">Planck Collaboration 2018</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">5.4 : 1</span>
              <span className="stat-label">Dark to Baryonic Ratio</span>
              <span className="stat-detail">Outweighs visible stars 5x</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Electromagnetic Flux</span>
              <span className="stat-detail">No optical, radio, or X-ray light</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">&lt; 10⁻⁴⁷ cm²</span>
              <span className="stat-label">Cross Section Limit</span>
              <span className="stat-detail">LZ &amp; XENONnT constraints</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3D Hero Galaxy Scene */}
      <div className="hero-canvas-container">
        <div className="hero-canvas-overlay" />
        <GalaxyScene showHalo={showHalo} onToggleHalo={handleToggleHalo} />
      </div>

      {/* Bottom Scroll Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          cursor: "pointer",
          opacity: 0.75,
        }}
        onClick={() => scrollTo("introduction")}
      >
        <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8" }}>
          SCROLL TO EXPLORE
        </span>
        <ArrowDown size={14} color="#00f5d4" style={{ animation: "bounce 2s infinite" }} />
      </div>
    </section>
  );
}
