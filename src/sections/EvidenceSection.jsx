import React, { useState } from "react";
import { Sliders, GraduationCap, Calculator, Lightbulb } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import GalaxyRotationScene from "../scenes/GalaxyRotationScene";
import LensingScene from "../scenes/LensingScene";
import BulletClusterScene from "../scenes/BulletClusterScene";
import { EVIDENCE_CONTENT } from "../data/scienceContent";
import { cosmicAudio } from "../utils/audioSynth";

export default function EvidenceSection() {
  // Station A State: Rotation Curve with interactive slider
  const [dmFraction, setDmFraction] = useState(0.85);
  const [stationATab, setStationATab] = useState("concept"); // "concept", "math", "professor"

  // Station B State: Gravitational Lensing
  const [showLensingMass, setShowLensingMass] = useState(true);
  const [stationBTab, setStationBTab] = useState("concept"); // "concept", "math", "professor"

  // Station C State: Bullet Cluster (0: Pre, 1: Peak, 2: Today)
  const [bulletStep, setBulletStep] = useState(2);
  const [stationCTab, setStationCTab] = useState("concept"); // "concept", "math", "professor"

  const { rotation, lensing, bullet } = EVIDENCE_CONTENT.stations;

  // Linear interpolation helper
  const lerp = (a, b, t) => a + (b - a) * t;

  // Calculated outer velocity based on DM fraction: ~85 km/s up to ~225 km/s
  const calculatedV = Math.round(85 + dmFraction * 140);

  return (
    <section id="evidence" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        <SectionHeading
          tag={EVIDENCE_CONTENT.tag}
          title={EVIDENCE_CONTENT.heading}
          lead={EVIDENCE_CONTENT.subtitle}
        />

        {/* ============================================================== */}
        {/* EVIDENCE STATION 01: GALAXY ROTATION CURVES                   */}
        {/* ============================================================== */}
        <div className="evidence-station-card">
          <div className="scene-canvas-wrapper" style={{ height: "500px" }}>
            <GalaxyRotationScene customDmFraction={dmFraction} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
              <span className="section-tag" style={{ margin: 0 }}>Pillar 01 • Stellar Kinematics</span>
              <span className="brand-badge" style={{ margin: 0 }}>Vera Rubin &amp; Kent Ford (1970s)</span>
            </div>

            <h3 style={{ fontSize: "1.75rem", color: "#ffffff", marginBottom: "0.65rem" }}>
              {rotation.title}
            </h3>

            {/* Quick 1-Sentence Concept Callout */}
            <div
              style={{
                padding: "0.65rem 0.95rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(0, 245, 212, 0.08)",
                borderLeft: "3px solid #00f5d4",
                marginBottom: "1rem",
                fontSize: "0.82rem",
                color: "#e2e8f0",
                lineHeight: 1.5,
              }}
            >
              <strong>Core Concept:</strong> {rotation.coreConcept}
            </div>

            {/* Explanatory Mode Selector Tabs */}
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem" }}>
              <button
                className={`pill-tab-btn ${stationATab === "concept" ? "active" : ""}`}
                onClick={() => setStationATab("concept")}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
              >
                <Lightbulb size={13} />
                <span>The Paradox</span>
              </button>
              <button
                className={`pill-tab-btn ${stationATab === "math" ? "active" : ""}`}
                onClick={() => setStationATab("math")}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
              >
                <Calculator size={13} />
                <span>Physics &amp; Math</span>
              </button>
              <button
                className={`pill-tab-btn ${stationATab === "professor" ? "active" : ""}`}
                onClick={() => setStationATab("professor")}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.8rem", fontSize: "0.75rem", borderColor: stationATab === "professor" ? "#fbbf24" : "" }}
              >
                <GraduationCap size={13} color={stationATab === "professor" ? "#fbbf24" : "currentColor"} />
                <span style={{ color: stationATab === "professor" ? "#fbbf24" : "inherit" }}>Explain to Professor</span>
              </button>
            </div>

            {/* Tab 1: Concept & Observation */}
            {stationATab === "concept" && (
              <div style={{ marginBottom: "1.1rem" }}>
                <p style={{ fontSize: "0.85rem", color: "#e2e8f0", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                  {rotation.summary}
                </p>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                  {rotation.paradox}
                </p>
              </div>
            )}

            {/* Tab 2: Mathematical Derivation */}
            {stationATab === "math" && (
              <div
                className="glass-panel"
                style={{
                  padding: "0.85rem 1rem",
                  marginBottom: "1.1rem",
                  background: "rgba(5, 10, 24, 0.8)",
                  fontSize: "0.8rem",
                  color: "#cbd5e1",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                <div style={{ color: "#fbbf24", marginBottom: "0.35rem" }}>
                  {rotation.mathProof.formula1}
                </div>
                <div style={{ color: "#00f5d4", marginBottom: "0.5rem", fontWeight: 700 }}>
                  {rotation.mathProof.formula2}
                </div>
                <p style={{ fontSize: "0.76rem", color: "#94a3b8", fontFamily: "var(--font-body)", lineHeight: 1.5, margin: 0 }}>
                  {rotation.mathProof.derivation}
                </p>
              </div>
            )}

            {/* Tab 3: Professor Presentation Script */}
            {stationATab === "professor" && (
              <div
                className="glass-panel"
                style={{
                  padding: "0.85rem 1rem",
                  marginBottom: "1.1rem",
                  borderLeft: "3px solid #fbbf24",
                  background: "rgba(251, 191, 36, 0.05)",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#fbbf24", fontWeight: 700, marginBottom: "0.3rem", fontSize: "0.76rem" }}>
                  <GraduationCap size={14} />
                  <span>WHAT TO SAY TO YOUR PROFESSOR (30 SECONDS):</span>
                </div>
                <p style={{ color: "#f8fafc", margin: 0, fontStyle: "italic" }}>
                  "{rotation.professorTip}"
                </p>
              </div>
            )}

            {/* Interactive Dark Matter Mass Slider */}
            <div
              className="glass-panel"
              style={{
                padding: "1rem 1.15rem",
                marginBottom: "1rem",
                border: "1px solid rgba(0, 245, 212, 0.3)",
                background: "rgba(0, 245, 212, 0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Sliders size={14} color="#00f5d4" />
                  Dark Matter Halo Mass
                </span>
                <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono, monospace)", color: "#00f5d4", fontWeight: 700 }}>
                  {Math.round(dmFraction * 100)}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                className="dm-range-slider"
                value={dmFraction}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setDmFraction(val);
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.72rem", fontFamily: "var(--font-mono, monospace)", color: "#94a3b8" }}>
                <span>0% (Newtonian Keplerian: stars slow down)</span>
                <span>85% (Observed Flat: stars stay fast)</span>
              </div>
            </div>

            {/* Scientific Synchronized Rotation Curve Graph (SVG) */}
            <div className="rotation-graph-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
                  Orbital Velocity v(r) vs Radius
                </span>
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)", color: "#00f5d4" }}>
                  Outer Star v ≈ {calculatedV} km/s
                </span>
              </div>

              <svg viewBox="0 0 340 140" style={{ width: "100%", height: "130px", overflow: "visible" }}>
                <defs>
                  <filter id="neon-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00f5d4" floodOpacity="0.6" />
                  </filter>
                  <filter id="neon-glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#fbbf24" floodOpacity="0.5" />
                  </filter>
                  <linearGradient id="discrepancy-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(0, 245, 212, 0.05)" />
                    <stop offset="100%" stopColor="rgba(0, 245, 212, 0.25)" />
                  </linearGradient>
                </defs>

                {/* Axes */}
                <line x1="40" y1="105" x2="320" y2="105" stroke="#334155" strokeWidth="1.5" />
                <line x1="40" y1="105" x2="40" y2="18" stroke="#334155" strokeWidth="1.5" />
                <text x="320" y="118" fill="#64748b" fontSize="9" textAnchor="end">Radius (kpc)</text>
                <text x="36" y="24" fill="#64748b" fontSize="9" textAnchor="end">v (km/s)</text>

                {/* Gridlines */}
                <line x1="40" y1="75" x2="320" y2="75" stroke="#1e293b" strokeDasharray="2 2" />
                <line x1="40" y1="45" x2="320" y2="45" stroke="#1e293b" strokeDasharray="2 2" />
                <text x="36" y="48" fill="#475569" fontSize="8" textAnchor="end">220</text>
                <text x="36" y="78" fill="#475569" fontSize="8" textAnchor="end">120</text>

                {/* Shaded Dark Matter Discrepancy Area */}
                {dmFraction > 0.1 && (
                  <path
                    d={`M 140 76 Q 225 87, 310 98 L 310 ${lerp(98, 44, dmFraction)} Q 225 ${lerp(87, 44, dmFraction)}, 140 ${lerp(76, 44, dmFraction)} Z`}
                    fill="url(#discrepancy-grad)"
                    opacity={dmFraction}
                    style={{ transition: "all 0.2s ease" }}
                  />
                )}

                {/* Curve A: Expected Keplerian Decline */}
                <path
                  d="M 45 44 Q 90 46, 140 76 T 310 98"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                  opacity={0.65}
                />

                {/* Dynamic Interpolated Velocity Curve */}
                <path
                  d={`M 45 52 Q 90 44, 140 ${lerp(76, 44, dmFraction)} T 310 ${lerp(98, 44, dmFraction)}`}
                  fill="none"
                  stroke={dmFraction > 0.5 ? "#00f5d4" : "#fbbf24"}
                  strokeWidth="2.8"
                  filter={dmFraction > 0.5 ? "url(#neon-glow-cyan)" : "url(#neon-glow-gold)"}
                  style={{ transition: "stroke 0.25s ease" }}
                />

                {/* Core Probe Marker (r = 90) */}
                <circle cx="90" cy="44" r="3.5" fill="#fbbf24" filter="url(#neon-glow-gold)" />

                {/* Edge Probe Marker (r = 310) */}
                <circle
                  cx="310"
                  cy={lerp(98, 44, dmFraction)}
                  r="4.5"
                  fill={dmFraction > 0.5 ? "#00f5d4" : "#fbbf24"}
                  filter={dmFraction > 0.5 ? "url(#neon-glow-cyan)" : "url(#neon-glow-gold)"}
                />

                {/* Discrepancy Callout Label */}
                {dmFraction > 0.4 && (
                  <text x="210" y="70" fill="#00f5d4" fontSize="8" fontStyle="italic" opacity={0.85}>
                    ▲ Dark Matter Halo Effect
                  </text>
                )}

                {/* Legend */}
                <text x="50" y="132" fill="#94a3b8" fontSize="8.5">
                  ● Dotted Yellow: Newtonian Keplerian | Solid: Real-time Sim v(r)
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* EVIDENCE STATION 02: GRAVITATIONAL LENSING                     */}
        {/* ============================================================== */}
        <div className="evidence-station-card">
          <div className="scene-canvas-wrapper" style={{ height: "480px" }}>
            <LensingScene showMassDistribution={showLensingMass} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
              <span className="section-tag" style={{ margin: 0 }}>Pillar 02 • Spacetime Optics</span>
              <span className="brand-badge" style={{ margin: 0 }}>Albert Einstein (1915) &amp; Fritz Zwicky (1937)</span>
            </div>

            <h3 style={{ fontSize: "1.75rem", color: "#ffffff", marginBottom: "0.65rem" }}>
              {lensing.title}
            </h3>

            {/* Quick 1-Sentence Concept Callout */}
            <div
              style={{
                padding: "0.65rem 0.95rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(157, 78, 221, 0.08)",
                borderLeft: "3px solid #c77dff",
                marginBottom: "1rem",
                fontSize: "0.82rem",
                color: "#e2e8f0",
                lineHeight: 1.5,
              }}
            >
              <strong>Core Concept:</strong> {lensing.coreConcept}
            </div>

            {/* Explanatory Mode Selector Tabs */}
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem" }}>
              <button
                className={`pill-tab-btn ${stationBTab === "concept" ? "active" : ""}`}
                onClick={() => setStationBTab("concept")}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
              >
                <Lightbulb size={13} />
                <span>The Concept</span>
              </button>
              <button
                className={`pill-tab-btn ${stationBTab === "math" ? "active" : ""}`}
                onClick={() => setStationBTab("math")}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
              >
                <Calculator size={13} />
                <span>Physics &amp; Math</span>
              </button>
              <button
                className={`pill-tab-btn ${stationBTab === "professor" ? "active" : ""}`}
                onClick={() => setStationBTab("professor")}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.8rem", fontSize: "0.75rem", borderColor: stationBTab === "professor" ? "#fbbf24" : "" }}
              >
                <GraduationCap size={13} color={stationBTab === "professor" ? "#fbbf24" : "currentColor"} />
                <span style={{ color: stationBTab === "professor" ? "#fbbf24" : "inherit" }}>Explain to Professor</span>
              </button>
            </div>

            {/* Tab 1: Concept & Observation */}
            {stationBTab === "concept" && (
              <div style={{ marginBottom: "1.1rem" }}>
                <p style={{ fontSize: "0.85rem", color: "#e2e8f0", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                  {lensing.summary}
                </p>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                  {lensing.paradox}
                </p>
              </div>
            )}

            {/* Tab 2: Mathematical Derivation */}
            {stationBTab === "math" && (
              <div
                className="glass-panel"
                style={{
                  padding: "0.85rem 1rem",
                  marginBottom: "1.1rem",
                  background: "rgba(5, 10, 24, 0.8)",
                  fontSize: "0.8rem",
                  color: "#cbd5e1",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                <div style={{ color: "#38bdf8", marginBottom: "0.35rem" }}>
                  {lensing.mathProof.formula1}
                </div>
                <div style={{ color: "#c77dff", marginBottom: "0.5rem", fontWeight: 700 }}>
                  {lensing.mathProof.formula2}
                </div>
                <p style={{ fontSize: "0.76rem", color: "#94a3b8", fontFamily: "var(--font-body)", lineHeight: 1.5, margin: 0 }}>
                  {lensing.mathProof.derivation}
                </p>
              </div>
            )}

            {/* Tab 3: Professor Presentation Script */}
            {stationBTab === "professor" && (
              <div
                className="glass-panel"
                style={{
                  padding: "0.85rem 1rem",
                  marginBottom: "1.1rem",
                  borderLeft: "3px solid #fbbf24",
                  background: "rgba(251, 191, 36, 0.05)",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#fbbf24", fontWeight: 700, marginBottom: "0.3rem", fontSize: "0.76rem" }}>
                  <GraduationCap size={14} />
                  <span>WHAT TO SAY TO YOUR PROFESSOR (30 SECONDS):</span>
                </div>
                <p style={{ color: "#f8fafc", margin: 0, fontStyle: "italic" }}>
                  "{lensing.professorTip}"
                </p>
              </div>
            )}

            {/* Toggle Lensing Mass */}
            <div style={{ marginBottom: "1.25rem" }}>
              <button
                onClick={() => {
                  setShowLensingMass(!showLensingMass);
                  cosmicAudio.playPulse(showLensingMass ? 300 : 500);
                }}
                className="glass-panel"
                style={{
                  width: "100%",
                  padding: "0.85rem 1.15rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: `1px solid ${showLensingMass ? "#c77dff" : "rgba(255, 255, 255, 0.1)"}`,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#ffffff" }}>
                  {showLensingMass ? "Showing Total Inferred Mass (5x Visible)" : "Showing Visible Cluster Baryons Only"}
                </span>
                <span
                  className="brand-badge"
                  style={{
                    margin: 0,
                    background: showLensingMass ? "rgba(157, 78, 221, 0.25)" : "rgba(255, 255, 255, 0.05)",
                    color: showLensingMass ? "#c77dff" : "#94a3b8",
                  }}
                >
                  {showLensingMass ? "DARK MATTER ACTIVE" : "TOGGLE"}
                </span>
              </button>
            </div>

            <div
              className="glass-panel"
              style={{
                padding: "1rem 1.25rem",
                borderLeft: "3px solid #00f5d4",
                background: "rgba(0, 245, 212, 0.04)",
              }}
            >
              <h5 style={{ fontSize: "0.85rem", color: "#00f5d4", marginBottom: "0.3rem" }}>
                How Cosmologists Weigh the Invisible:
              </h5>
              <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
                Because photons follow null geodesics in curved spacetime, light bending directly measures the <em>total mass</em> (visible + dark) without depending on whether that mass is luminous or in thermal equilibrium.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* EVIDENCE STATION 03: THE BULLET CLUSTER (1E 0657-558)          */}
        {/* ============================================================== */}
        <div className="evidence-station-card">
          <div className="scene-canvas-wrapper" style={{ height: "480px" }}>
            <BulletClusterScene step={bulletStep} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
              <span className="section-tag" style={{ margin: 0 }}>Pillar 03 • Natural Collision Experiment</span>
              <span className="brand-badge" style={{ margin: 0 }}>Chandra &amp; Magellan (2006)</span>
            </div>

            <h3 style={{ fontSize: "1.75rem", color: "#ffffff", marginBottom: "0.65rem" }}>
              {bullet.title}
            </h3>

            {/* Quick 1-Sentence Concept Callout */}
            <div
              style={{
                padding: "0.65rem 0.95rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(244, 63, 94, 0.08)",
                borderLeft: "3px solid #f43f5e",
                marginBottom: "1rem",
                fontSize: "0.82rem",
                color: "#e2e8f0",
                lineHeight: 1.5,
              }}
            >
              <strong>Core Concept:</strong> {bullet.coreConcept}
            </div>

            {/* Explanatory Mode Selector Tabs */}
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem" }}>
              <button
                className={`pill-tab-btn ${stationCTab === "concept" ? "active" : ""}`}
                onClick={() => setStationCTab("concept")}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
              >
                <Lightbulb size={13} />
                <span>The Collision</span>
              </button>
              <button
                className={`pill-tab-btn ${stationCTab === "math" ? "active" : ""}`}
                onClick={() => setStationCTab("math")}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
              >
                <Calculator size={13} />
                <span>Why It Rules Out MOND</span>
              </button>
              <button
                className={`pill-tab-btn ${stationCTab === "professor" ? "active" : ""}`}
                onClick={() => setStationCTab("professor")}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.8rem", fontSize: "0.75rem", borderColor: stationCTab === "professor" ? "#fbbf24" : "" }}
              >
                <GraduationCap size={13} color={stationCTab === "professor" ? "#fbbf24" : "currentColor"} />
                <span style={{ color: stationCTab === "professor" ? "#fbbf24" : "inherit" }}>Explain to Professor</span>
              </button>
            </div>

            {/* Tab 1: Concept & Observation */}
            {stationCTab === "concept" && (
              <div style={{ marginBottom: "1.1rem" }}>
                <p style={{ fontSize: "0.85rem", color: "#e2e8f0", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                  {bullet.summary}
                </p>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                  {bullet.paradox}
                </p>
              </div>
            )}

            {/* Tab 2: Why it rules out MOND */}
            {stationCTab === "math" && (
              <div
                className="glass-panel"
                style={{
                  padding: "0.85rem 1rem",
                  marginBottom: "1.1rem",
                  background: "rgba(5, 10, 24, 0.8)",
                  fontSize: "0.8rem",
                  color: "#cbd5e1",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                <div style={{ color: "#fb7185", marginBottom: "0.35rem" }}>
                  {bullet.mathProof.formula1}
                </div>
                <div style={{ color: "#38bdf8", marginBottom: "0.5rem", fontWeight: 700 }}>
                  {bullet.mathProof.formula2}
                </div>
                <p style={{ fontSize: "0.76rem", color: "#94a3b8", fontFamily: "var(--font-body)", lineHeight: 1.5, margin: 0 }}>
                  {bullet.mathProof.derivation}
                </p>
              </div>
            )}

            {/* Tab 3: Professor Presentation Script */}
            {stationCTab === "professor" && (
              <div
                className="glass-panel"
                style={{
                  padding: "0.85rem 1rem",
                  marginBottom: "1.1rem",
                  borderLeft: "3px solid #fbbf24",
                  background: "rgba(251, 191, 36, 0.05)",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#fbbf24", fontWeight: 700, marginBottom: "0.3rem", fontSize: "0.76rem" }}>
                  <GraduationCap size={14} />
                  <span>WHAT TO SAY TO YOUR PROFESSOR (30 SECONDS):</span>
                </div>
                <p style={{ color: "#f8fafc", margin: 0, fontStyle: "italic" }}>
                  "{bullet.professorTip}"
                </p>
              </div>
            )}

            {/* Collision Timeline Stepper */}
            <div className="stepper-container">
              {bullet.steps.map((st, idx) => {
                const isActive = bulletStep === idx;
                return (
                  <button
                    key={idx}
                    className={`step-btn ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setBulletStep(idx);
                      cosmicAudio.playPulse(250 + idx * 120);
                    }}
                  >
                    <span className="step-btn-num">Phase 0{idx + 1}</span>
                    <span className="step-btn-title">{st.label}</span>
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
              "{bullet.steps[bulletStep].desc}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
