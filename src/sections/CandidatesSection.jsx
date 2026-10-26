import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Atom, Radio, CircleDot, AlertTriangle, Sparkles, ExternalLink } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import ParticleCandidateScene from "../scenes/ParticleCandidateScene";
import { CANDIDATES_CONTENT } from "../data/scienceContent";
import { cosmicAudio } from "../utils/audioSynth";

export default function CandidatesSection() {
  const [activeCandidateId, setActiveCandidateId] = useState("wimp");

  const activeCandidate =
    CANDIDATES_CONTENT.list.find((c) => c.id === activeCandidateId) ||
    CANDIDATES_CONTENT.list[0];

  const handleSelectCandidate = (id) => {
    setActiveCandidateId(id);
    cosmicAudio.playPulse(id === "wimp" ? 380 : id === "axion" ? 480 : 280);
  };

  return (
    <section id="candidates" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        <SectionHeading
          tag={CANDIDATES_CONTENT.tag}
          title={CANDIDATES_CONTENT.heading}
          lead={CANDIDATES_CONTENT.lead}
        />

        {/* Disclaimer Banner */}
        <div
          className="glass-panel"
          style={{
            maxWidth: "920px",
            margin: "0 auto 2.5rem auto",
            padding: "0.85rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            border: "1px solid rgba(251, 191, 36, 0.3)",
            background: "rgba(251, 191, 36, 0.06)",
          }}
        >
          <AlertTriangle size={20} color="#fbbf24" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: "0.82rem", color: "#fef3c7", margin: 0 }}>
            {CANDIDATES_CONTENT.disclaimer}
          </p>
        </div>

        {/* Interactive Candidate Switcher */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div className="pill-tab-group">
            {CANDIDATES_CONTENT.list.map((c) => (
              <button
                key={c.id}
                className={`pill-tab-btn ${activeCandidateId === c.id ? "active" : ""}`}
                onClick={() => handleSelectCandidate(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: 3D Visualization + Detailed Physics Breakdown */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "2.5rem",
            alignItems: "center",
          }}
          className="candidates-grid-container"
        >
          {/* 3D Simulation Canvas */}
          <div className="scene-canvas-wrapper" style={{ height: "480px" }}>
            <ParticleCandidateScene candidateId={activeCandidateId} />

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
                  border: `1px solid ${activeCandidate.statusColor}`,
                }}
              >
                Simulation Mode: <strong>{activeCandidate.fullName}</strong>
              </div>
              <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                Interactive 3D Model
              </span>
            </div>
          </div>

          {/* Details Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCandidate.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="glass-panel"
              style={{ padding: "2.25rem" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(157, 78, 221, 0.2)",
                      border: "1px solid rgba(157, 78, 221, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: activeCandidate.statusColor,
                    }}
                  >
                    {activeCandidate.id === "wimp" ? (
                      <Atom size={20} />
                    ) : activeCandidate.id === "axion" ? (
                      <Radio size={20} />
                    ) : (
                      <CircleDot size={20} />
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.4rem", color: "#ffffff", margin: 0 }}>
                      {activeCandidate.name}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0 }}>
                      {activeCandidate.fullName}
                    </p>
                  </div>
                </div>

                <span
                  className="brand-badge"
                  style={{
                    margin: 0,
                    borderColor: activeCandidate.statusColor,
                    color: activeCandidate.statusColor,
                    background: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {activeCandidate.status}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  marginTop: "1.5rem",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "0.78rem", color: "#00f5d4", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.35rem" }}>
                    Predicted Mass Scale
                  </h4>
                  <p style={{ fontSize: "0.9rem", color: "#f8fafc", margin: 0, fontFamily: "var(--font-display)" }}>
                    {activeCandidate.massRange}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: "0.78rem", color: "#c77dff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.35rem" }}>
                    Physical Mechanism
                  </h4>
                  <p style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
                    {activeCandidate.mechanism}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: "0.78rem", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.35rem" }}>
                    Experimental Search Strategy
                  </h4>
                  <p style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
                    {activeCandidate.detectionMethod}
                  </p>
                </div>

                <div
                  style={{
                    padding: "0.9rem 1.1rem",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(255, 255, 255, 0.03)",
                    borderLeft: `3px solid ${activeCandidate.statusColor}`,
                  }}
                >
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: "0.2rem" }}>
                    Theoretical Appeal:
                  </span>
                  <p style={{ fontSize: "0.85rem", color: "#e2e8f0", margin: 0 }}>
                    {activeCandidate.pros}
                  </p>
                </div>

                {activeCandidate.professorSummary && (
                  <div
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(0, 245, 212, 0.06)",
                      border: "1px solid rgba(0, 245, 212, 0.25)",
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
                        marginBottom: "0.25rem",
                      }}
                    >
                      🎓 Key Point for Professor
                    </span>
                    <p style={{ fontSize: "0.84rem", color: "#f8fafc", margin: 0, lineHeight: 1.5 }}>
                      {activeCandidate.professorSummary}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Candidate Quick Comparison Matrix */}
        <div
          className="glass-panel"
          style={{
            marginTop: "3rem",
            padding: "1.75rem 2rem",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#c77dff",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Cross-Examination Cheat Sheet
            </span>
            <h4 style={{ fontSize: "1.15rem", color: "#ffffff", marginTop: "0.25rem" }}>
              Particle Candidates at a Glance
            </h4>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.84rem",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)" }}>
                  <th style={{ padding: "0.75rem 1rem", color: "#94a3b8" }}>Candidate</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#94a3b8" }}>Mass Range</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#94a3b8" }}>Detection Strategy</th>
                  <th style={{ padding: "0.75rem 1rem", color: "#94a3b8" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {CANDIDATES_CONTENT.list.map((c, i) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      background: i % 2 === 0 ? "rgba(255, 255, 255, 0.015)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "0.8rem 1rem", color: c.statusColor, fontWeight: 700 }}>
                      {c.name} ({c.fullName})
                    </td>
                    <td style={{ padding: "0.8rem 1rem", color: "#cbd5e1" }}>
                      {c.massRange}
                    </td>
                    <td style={{ padding: "0.8rem 1rem", color: "#94a3b8" }}>
                      {c.detectionMethod.split(".")[0]}
                    </td>
                    <td style={{ padding: "0.8rem 1rem" }}>
                      <span
                        style={{
                          padding: "0.2rem 0.55rem",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          color: c.statusColor,
                          background: "rgba(255, 255, 255, 0.05)",
                          border: `1px solid ${c.statusColor}44`,
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
