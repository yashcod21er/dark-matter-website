import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Sparkles, Eye, Info, X, Compass } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import CosmicWebScene from "../scenes/CosmicWebScene";
import { COSMIC_WEB_CONTENT } from "../data/scienceContent";
import { cosmicAudio } from "../utils/audioSynth";

export default function CosmicWebSection() {
  const [showFilaments, setShowFilaments] = useState(true);
  const [showGalaxies, setShowGalaxies] = useState(true);
  const [showVoids, setShowVoids] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState(null);

  const toggleFilaments = () => {
    setShowFilaments((p) => !p);
    cosmicAudio.playPulse(showFilaments ? 240 : 420);
  };

  const toggleGalaxies = () => {
    setShowGalaxies((p) => !p);
    cosmicAudio.playPulse(showGalaxies ? 300 : 520);
  };

  const toggleVoids = () => {
    setShowVoids((p) => !p);
    cosmicAudio.playPulse(showVoids ? 200 : 380);
  };

  return (
    <section id="cosmic-web" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        <SectionHeading
          tag={COSMIC_WEB_CONTENT.tag}
          title={COSMIC_WEB_CONTENT.heading}
          lead={COSMIC_WEB_CONTENT.lead}
        />

        {/* 3D Cosmic Web Interactive Canvas */}
        <div className="scene-canvas-wrapper" style={{ height: "560px", marginBottom: "2.5rem" }}>
          <CosmicWebScene
            showFilaments={showFilaments}
            showGalaxies={showGalaxies}
            showVoids={showVoids}
            selectedCluster={selectedCluster}
            setSelectedCluster={setSelectedCluster}
          />

          {/* Top Left Status / Controls Pill Group */}
          <div
            style={{
              position: "absolute",
              top: "1.25rem",
              left: "1.25rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.6rem",
              zIndex: 10,
            }}
          >
            <button
              onClick={toggleFilaments}
              className="glass-pill"
              style={{
                padding: "0.45rem 0.95rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: showFilaments ? "#c77dff" : "#94a3b8",
                border: `1px solid ${showFilaments ? "#9d4edd" : "rgba(255, 255, 255, 0.1)"}`,
                background: showFilaments ? "rgba(157, 78, 221, 0.2)" : "rgba(10, 15, 34, 0.7)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9d4edd" }} />
              Dark Matter Filaments: {showFilaments ? "ON" : "OFF"}
            </button>

            <button
              onClick={toggleGalaxies}
              className="glass-pill"
              style={{
                padding: "0.45rem 0.95rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: showGalaxies ? "#00f5d4" : "#94a3b8",
                border: `1px solid ${showGalaxies ? "#00f5d4" : "rgba(255, 255, 255, 0.1)"}`,
                background: showGalaxies ? "rgba(0, 245, 212, 0.2)" : "rgba(10, 15, 34, 0.7)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00f5d4" }} />
              Galaxy Nodes: {showGalaxies ? "ON" : "OFF"}
            </button>

            <button
              onClick={toggleVoids}
              className="glass-pill"
              style={{
                padding: "0.45rem 0.95rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: showVoids ? "#38bdf8" : "#94a3b8",
                border: `1px solid ${showVoids ? "#38bdf8" : "rgba(255, 255, 255, 0.1)"}`,
                background: showVoids ? "rgba(56, 189, 248, 0.2)" : "rgba(10, 15, 34, 0.7)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#38bdf8" }} />
              Cosmic Voids: {showVoids ? "ON" : "OFF"}
            </button>
          </div>

          {/* Selected Cluster Info Drawer */}
          <AnimatePresence>
            {selectedCluster && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-panel"
                style={{
                  position: "absolute",
                  bottom: "1.5rem",
                  right: "1.5rem",
                  maxWidth: "360px",
                  padding: "1.35rem",
                  zIndex: 20,
                  border: "1px solid #00f5d4",
                  boxShadow: "0 10px 30px rgba(0, 245, 212, 0.2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span
                    className="brand-badge"
                    style={{
                      margin: 0,
                      color: selectedCluster.radius ? "#38bdf8" : "#00f5d4",
                      borderColor: selectedCluster.radius ? "#38bdf8" : "#00f5d4",
                      fontSize: "0.7rem",
                    }}
                  >
                    {selectedCluster.type || "Cosmological Feature"}
                  </span>
                  <button
                    onClick={() => setSelectedCluster(null)}
                    style={{ color: "#94a3b8", cursor: "pointer", padding: "2px", background: "none", border: "none" }}
                  >
                    <X size={16} />
                  </button>
                </div>
                <h4 style={{ fontSize: "1.1rem", color: "#ffffff", marginBottom: "0.4rem" }}>
                  {selectedCluster.name}
                </h4>
                <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                  {selectedCluster.desc}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    paddingTop: "0.5rem",
                    fontSize: "0.74rem",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  <div>
                    <span style={{ color: "#94a3b8", display: "block" }}>MASS / DENSITY:</span>
                    <strong style={{ color: "#ffffff" }}>{selectedCluster.mass}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#94a3b8", display: "block" }}>REDSHIFT z:</span>
                    <strong style={{ color: "#c77dff" }}>{selectedCluster.z}</strong>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scientific Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {COSMIC_WEB_CONTENT.features.map((feat, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(157, 78, 221, 0.2)",
                    border: "1px solid rgba(157, 78, 221, 0.4)",
                    color: "#c77dff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                  }}
                >
                  0{idx + 1}
                </span>
                <h4 style={{ fontSize: "1.05rem", color: "#ffffff" }}>{feat.title}</h4>
              </div>
              <p style={{ fontSize: "0.86rem", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Why Dark Matter Was Crucial for Cosmic Structure */}
        {COSMIC_WEB_CONTENT.whyDarkMatterNeeded && (
          <div
            className="glass-panel"
            style={{
              marginTop: "2.5rem",
              padding: "1.75rem 2rem",
              border: "1px solid rgba(0, 245, 212, 0.3)",
              background: "linear-gradient(135deg, rgba(0, 245, 212, 0.05) 0%, rgba(18, 25, 55, 0.7) 100%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <span
                style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  background: "rgba(0, 245, 212, 0.2)",
                  color: "#00f5d4",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Key Professor Question
              </span>
              <h4 style={{ fontSize: "1.1rem", color: "#ffffff", margin: 0 }}>
                {COSMIC_WEB_CONTENT.whyDarkMatterNeeded.question}
              </h4>
            </div>
            <p style={{ fontSize: "0.88rem", color: "#e2e8f0", lineHeight: 1.65, margin: 0 }}>
              {COSMIC_WEB_CONTENT.whyDarkMatterNeeded.answer}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
