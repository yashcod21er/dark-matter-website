import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, ChevronRight, Layers, Eye, Compass } from "lucide-react";
import IntroComparisonScene from "../scenes/IntroComparisonScene";
import SectionHeading from "../components/SectionHeading";
import { INTRODUCTION_CONTENT } from "../data/scienceContent";
import { cosmicAudio } from "../utils/audioSynth";

export default function IntroductionSection() {
  const [activeRegionId, setActiveRegionId] = useState("visible");

  const activeRegion = INTRODUCTION_CONTENT.regions.find((r) => r.id === activeRegionId) || INTRODUCTION_CONTENT.regions[0];

  const handleSelectRegion = (id) => {
    setActiveRegionId(id);
    cosmicAudio.playPulse(id === "visible" ? 330 : id === "halo" ? 440 : 550);
  };

  return (
    <section id="introduction" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        <SectionHeading
          tag={INTRODUCTION_CONTENT.tag}
          title={INTRODUCTION_CONTENT.heading}
          lead={INTRODUCTION_CONTENT.lead}
        />

        {/* Quick Pitch Banner for Oral Presentation */}
        {INTRODUCTION_CONTENT.quickPitch && (
          <div
            className="glass-panel"
            style={{
              maxWidth: "960px",
              margin: "0 auto 2rem auto",
              padding: "1.25rem 1.75rem",
              borderLeft: "4px solid #00f5d4",
              background: "linear-gradient(90deg, rgba(0, 245, 212, 0.08) 0%, rgba(10, 15, 34, 0.5) 100%)",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#00f5d4",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              🎓 30-Second Elevator Pitch for Your Professor
            </span>
            <p style={{ fontSize: "0.95rem", color: "#f8fafc", margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
              "{INTRODUCTION_CONTENT.quickPitch}"
            </p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "2.5rem",
            alignItems: "center",
            marginTop: "1.5rem",
          }}
          className="intro-grid-container"
        >
          {/* Interactive 3D Canvas Box */}
          <div className="scene-canvas-wrapper" style={{ height: "480px" }}>
            <IntroComparisonScene activeRegion={activeRegionId} />
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                right: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <div
                className="glass-pill"
                style={{
                  padding: "0.35rem 0.85rem",
                  fontSize: "0.72rem",
                  color: "#cbd5e1",
                  border: `1px solid ${activeRegion.color}`,
                }}
              >
                Focus: <strong style={{ color: activeRegion.color }}>{activeRegion.name}</strong>
              </div>
              <span style={{ fontSize: "0.7rem", color: "#64748b" }}>3D Realtime Comparison</span>
            </div>
          </div>

          {/* Interactive Scientific Control Cards */}
          <div>
            {/* Region Selector Pills */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.75rem" }}>
              {INTRODUCTION_CONTENT.regions.map((region, idx) => {
                const isSelected = region.id === activeRegionId;
                return (
                  <button
                    key={region.id}
                    onClick={() => handleSelectRegion(region.id)}
                    className="glass-panel"
                    style={{
                      padding: "1rem 1.25rem",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: `1px solid ${isSelected ? region.color : "rgba(255, 255, 255, 0.08)"}`,
                      background: isSelected ? "rgba(18, 25, 55, 0.85)" : "rgba(10, 15, 34, 0.55)",
                      transform: isSelected ? "translateX(6px)" : "none",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: isSelected ? region.color : "rgba(255, 255, 255, 0.05)",
                          color: isSelected ? "#03050c" : "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          flexShrink: 0,
                        }}
                      >
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 style={{ fontSize: "0.95rem", color: isSelected ? "#ffffff" : "#cbd5e1" }}>
                          {region.name}
                        </h4>
                        <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0 }}>
                          {region.short}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} color={isSelected ? region.color : "#475569"} />
                  </button>
                );
              })}
            </div>

            {/* Active Region Detailed Educational Brief */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRegion.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="glass-panel"
                style={{
                  padding: "1.5rem",
                  borderLeft: `4px solid ${activeRegion.color}`,
                }}
              >
                <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  <span
                    className="brand-badge"
                    style={{ margin: 0, background: "rgba(255, 255, 255, 0.05)", borderColor: activeRegion.color, color: activeRegion.color }}
                  >
                    Extent: {activeRegion.radiusScale}
                  </span>
                  <span className="brand-badge" style={{ margin: 0 }}>
                    Mass Share: {activeRegion.massShare}
                  </span>
                </div>
                <p style={{ fontSize: "0.9rem", color: "#e2e8f0", lineHeight: 1.65, margin: 0 }}>
                  {activeRegion.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* The 3 Presentation Pillars */}
        <div style={{ marginTop: "3.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#c77dff",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Academic Presentation Architecture
            </span>
            <h3 style={{ fontSize: "1.4rem", color: "#ffffff", marginTop: "0.3rem" }}>
              The Three Core Pillars to Explain to Your Professor
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {(INTRODUCTION_CONTENT.presentationPillars || []).map((pillar, i) => (
              <div
                key={i}
                className="glass-panel"
                style={{
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  borderTop: `3px solid ${i === 0 ? "#00f5d4" : i === 1 ? "#9d4edd" : "#38bdf8"}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color={i === 0 ? "#00f5d4" : i === 1 ? "#c77dff" : "#38bdf8"} />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    {pillar.title}
                  </span>
                </div>
                <p style={{ fontSize: "0.86rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Professor Exam Trap Questions / Misconceptions */}
        {INTRODUCTION_CONTENT.misconceptions && (
          <div
            className="glass-panel"
            style={{
              marginTop: "2.5rem",
              padding: "1.75rem 2rem",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              background: "rgba(251, 191, 36, 0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <span
                style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  background: "rgba(251, 191, 36, 0.2)",
                  color: "#fbbf24",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Viva Defence
              </span>
              <h4 style={{ fontSize: "1.1rem", color: "#ffffff", margin: 0 }}>
                Frequently Asked Professor Trap Questions
              </h4>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {INTRODUCTION_CONTENT.misconceptions.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderLeft: "3px solid #fbbf24",
                  }}
                >
                  <strong style={{ fontSize: "0.88rem", color: "#fbbf24", display: "block", marginBottom: "0.4rem" }}>
                    Q: {item.q}
                  </strong>
                  <p style={{ fontSize: "0.84rem", color: "#cbd5e1", margin: 0, lineHeight: 1.55 }}>
                    <strong>A:</strong> {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .intro-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
