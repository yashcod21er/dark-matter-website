import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Info, ShieldAlert, Sparkles, Orbit } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import UniverseCompositionScene from "../scenes/UniverseCompositionScene";
import { COMPOSITION_CONTENT } from "../data/scienceContent";
import { cosmicAudio } from "../utils/audioSynth";

export default function CompositionSection() {
  const [activeSliceId, setActiveSliceId] = useState("dark_matter");

  const activeSlice =
    COMPOSITION_CONTENT.slices.find((s) => s.id === activeSliceId) ||
    COMPOSITION_CONTENT.slices[1];

  const handleSelectSlice = (id) => {
    setActiveSliceId(id);
    cosmicAudio.playChime(id === "dark_energy" ? 392 : id === "dark_matter" ? 528 : 659);
  };

  return (
    <section id="composition" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        <SectionHeading
          tag={COMPOSITION_CONTENT.tag}
          title={COMPOSITION_CONTENT.heading}
          lead={COMPOSITION_CONTENT.lead}
        />

        {/* Crucial Scientific Clarification Banner */}
        <div
          className="glass-panel"
          style={{
            maxWidth: "920px",
            margin: "0 auto 3rem auto",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            border: "1px solid rgba(157, 78, 221, 0.4)",
            background: "rgba(157, 78, 221, 0.08)",
          }}
        >
          <Info size={22} color="#00f5d4" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: "0.85rem", color: "#e2e8f0", margin: 0 }}>
            {COMPOSITION_CONTENT.note}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "2.5rem",
            alignItems: "center",
          }}
          className="composition-grid-container"
        >
          {/* 3D Interactive Composition Celestial Gyroscope / Rings */}
          <div className="scene-canvas-wrapper" style={{ height: "480px" }}>
            <UniverseCompositionScene
              activeSliceId={activeSliceId}
              onSelectSlice={handleSelectSlice}
            />
            <div
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <div
                className="glass-pill"
                style={{
                  padding: "0.35rem 0.85rem",
                  fontSize: "0.72rem",
                  color: "#cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Orbit size={13} color="#00f5d4" />
                <span>Interactive 3D Proportional Rings</span>
              </div>
            </div>
          </div>

          {/* Interactive Legends & Educational Cards */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.75rem" }}>
              {COMPOSITION_CONTENT.slices.map((slice) => {
                const isSelected = slice.id === activeSliceId;
                return (
                  <button
                    key={slice.id}
                    onClick={() => handleSelectSlice(slice.id)}
                    className="glass-panel"
                    style={{
                      padding: "1.15rem 1.35rem",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: `1px solid ${isSelected ? slice.color : "rgba(255, 255, 255, 0.08)"}`,
                      background: isSelected ? "rgba(18, 25, 55, 0.85)" : "rgba(10, 15, 34, 0.55)",
                      boxShadow: isSelected ? `0 0 20px ${slice.color}33` : "none",
                      transform: isSelected ? "scale(1.02)" : "scale(1)",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: slice.color,
                          boxShadow: `0 0 10px ${slice.color}`,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: "1rem", color: isSelected ? "#ffffff" : "#cbd5e1" }}>
                          {slice.name}
                        </h4>
                        <span style={{ fontSize: "0.78rem", color: slice.accent, fontWeight: 600 }}>
                          {slice.role.split("—")[0]}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: slice.color,
                      }}
                    >
                      {slice.displayPercent}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Slice Detailed Explanation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlice.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-panel"
                style={{
                  padding: "1.75rem",
                  borderLeft: `4px solid ${activeSlice.color}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
                  <h3 style={{ fontSize: "1.2rem", color: "#ffffff" }}>
                    {activeSlice.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontSize: "1.3rem",
                      fontWeight: 800,
                      color: activeSlice.color,
                    }}
                  >
                    {activeSlice.percentage}%
                  </span>
                </div>
                <p style={{ fontSize: "0.88rem", color: "#e2e8f0", lineHeight: 1.65, marginBottom: "0.75rem" }}>
                  {activeSlice.description}
                </p>
                <p style={{ fontSize: "0.8rem", color: activeSlice.accent, margin: 0, fontWeight: 500 }}>
                  <strong>Cosmic Function:</strong> {activeSlice.role}
                </p>

                {activeSlice.professorTakeaway && (
                  <div
                    style={{
                      marginTop: "1.1rem",
                      padding: "0.85rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(0, 245, 212, 0.07)",
                      border: "1px solid rgba(0, 245, 212, 0.3)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.3rem",
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
                      🎓 Presentation Tip for Professor
                    </span>
                    <p style={{ fontSize: "0.84rem", color: "#f8fafc", margin: 0, lineHeight: 1.5 }}>
                      {activeSlice.professorTakeaway}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Professor Quick-Comparison Drawer: Dark Matter vs Dark Energy */}
        {COMPOSITION_CONTENT.professorComparison && (
          <div
            className="glass-panel"
            style={{
              marginTop: "3rem",
              padding: "1.75rem 2rem",
              border: "1px solid rgba(157, 78, 221, 0.35)",
              background: "linear-gradient(135deg, rgba(18, 25, 55, 0.9) 0%, rgba(10, 15, 34, 0.95) 100%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <span
                style={{
                  padding: "0.25rem 0.65rem",
                  borderRadius: "4px",
                  background: "rgba(157, 78, 221, 0.3)",
                  color: "#c77dff",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Viva & Exam Master Key
              </span>
              <h4 style={{ fontSize: "1.15rem", color: "#ffffff", margin: 0 }}>
                {COMPOSITION_CONTENT.professorComparison.title}
              </h4>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
              {COMPOSITION_CONTENT.professorComparison.summary}
            </p>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.85rem",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)" }}>
                    <th style={{ padding: "0.75rem 1rem", color: "#94a3b8", fontWeight: 600 }}>Feature</th>
                    <th style={{ padding: "0.75rem 1rem", color: "#c77dff", fontWeight: 700 }}>
                      Dark Matter (CDM)
                    </th>
                    <th style={{ padding: "0.75rem 1rem", color: "#38bdf8", fontWeight: 700 }}>
                      Dark Energy (Λ)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPOSITION_CONTENT.professorComparison.points.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        background: idx % 2 === 0 ? "rgba(255, 255, 255, 0.015)" : "transparent",
                      }}
                    >
                      <td style={{ padding: "0.8rem 1rem", color: "#e2e8f0", fontWeight: 600 }}>
                        {row.feature}
                      </td>
                      <td style={{ padding: "0.8rem 1rem", color: "#cbd5e1" }}>
                        <span style={{ color: "#00f5d4", marginRight: "0.4rem" }}>✔</span>
                        {row.dm}
                      </td>
                      <td style={{ padding: "0.8rem 1rem", color: "#cbd5e1" }}>
                        <span style={{ color: "#38bdf8", marginRight: "0.4rem" }}>⚡</span>
                        {row.de}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .composition-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
