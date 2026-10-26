import React, { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import SpiralGalaxy from "./SpiralGalaxy";
import DarkMatterHalo from "./DarkMatterHalo";
import StarField from "./StarField";
import FloatingInfoLabel from "./FloatingInfoLabel";
import { Info, Eye, EyeOff } from "lucide-react";
import { cosmicAudio } from "../utils/audioSynth";

function GalaxyRig({ showHalo, activeLabel, setActiveLabel, spectralMode }) {
  const controlsRef = useRef();

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={7}
        maxDistance={28}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 6}
        autoRotate={false}
        dampingFactor={0.06}
        rotateSpeed={0.8}
      />

      {/* Galactic Ambient & Core Lighting */}
      <ambientLight intensity={spectralMode === "xray" ? 0.15 : 0.45} />
      <pointLight position={[2.8, 0, 0]} intensity={2.5} color="#fff1c2" distance={22} />
      <pointLight position={[10, 8, 8]} intensity={0.6} color="#00f5d4" />
      <pointLight position={[-8, -8, -8]} intensity={0.8} color="#9d4edd" />

      {/* Full-Bleed Background Starfield */}
      <StarField count={2600} radius={65} />

      {/* Galaxy Group Offset to the Right so it pairs gracefully with left hero typography */}
      <group position={[2.8, -0.2, 0]} rotation={[Math.PI / 4.4, 0, -0.1]}>
        <SpiralGalaxy spectralMode={spectralMode} />
        <DarkMatterHalo visible={showHalo} radius={12.0} count={8000} />

        {/* Floating Hotspots (positioned safely within view) */}
        <FloatingInfoLabel
          position={[0, 0.4, 0]}
          title="Galactic Bulge"
          active={activeLabel === "bulge"}
          onClick={() => {
            setActiveLabel(activeLabel === "bulge" ? null : "bulge");
            cosmicAudio.playPulse(220);
          }}
        />

        <FloatingInfoLabel
          position={[2.4, 0.2, -1.0]}
          title="Stellar Disk"
          active={activeLabel === "disk"}
          onClick={() => {
            setActiveLabel(activeLabel === "disk" ? null : "disk");
            cosmicAudio.playPulse(330);
          }}
        />

        {showHalo && (
          <FloatingInfoLabel
            position={[-3.2, 0.6, 1.8]}
            title="Dark Matter Halo"
            active={activeLabel === "halo"}
            onClick={() => {
              setActiveLabel(activeLabel === "halo" ? null : "halo");
              cosmicAudio.playPulse(440);
            }}
          />
        )}
      </group>
    </>
  );
}

export default function GalaxyScene({ showHalo = true, onToggleHalo }) {
  const [activeLabel, setActiveLabel] = useState(null);
  const [spectralMode, setSpectralMode] = useState("composite"); // composite, optical, xray

  const labelDetails = {
    bulge: {
      title: "Galactic Bulge & Nucleus",
      text: "The densely packed central sphere of ancient stars and central supermassive black hole. Ordinary baryonic mass dominates this inner 1 kpc region, dictating inner orbital dynamics.",
      badge: "Ordinary Matter Dominated",
      color: "#fbbf24",
    },
    disk: {
      title: "Spiral Arms & Luminous Disk",
      text: "Stretching ~100,000 light-years across, containing young blue star clusters and molecular gas clouds. According to Newtonian mechanics alone, stars out here should orbit slowly, yet they move at ~220 km/s.",
      badge: "Keplerian Discrepancy",
      color: "#00f5d4",
    },
    halo: {
      title: "Dark Matter Halo (Inferred)",
      text: "A non-luminous, diffuse envelope extending out to 1,000,000 light-years. It accounts for ~85% of the galaxy's gravitational mass, anchoring the high orbital speeds of the outer disk.",
      badge: "Gravitational Reservoir",
      color: "#c77dff",
    },
  };

  const handleSpectralChange = (mode) => {
    setSpectralMode(mode);
    cosmicAudio.playPulse(mode === "xray" ? 520 : mode === "optical" ? 360 : 440);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Telemetry HUD Badge: Positioned safely below the 72px navbar */}
      <div
        className="glass-pill telemetry-hud"
        style={{
          position: "absolute",
          top: "5.5rem",
          right: "2rem",
          zIndex: 10,
          padding: "0.45rem 0.95rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          fontSize: "0.72rem",
          fontFamily: "var(--font-mono, monospace)",
          color: "#94a3b8",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          background: "rgba(5, 7, 15, 0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00f5d4", boxShadow: "0 0 8px #00f5d4" }} />
          SIMULATION
        </span>
        <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>|</span>
        <span>MASS: <strong style={{ color: "#ffffff" }}>1.2 × 10¹² M☉</strong></span>
        <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>|</span>
        <span>DM: <strong style={{ color: "#c77dff" }}>84.6%</strong></span>
      </div>

      <Canvas
        camera={{ position: [0, 8, 16], fov: 46 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <GalaxyRig
            showHalo={showHalo}
            activeLabel={activeLabel}
            setActiveLabel={setActiveLabel}
            spectralMode={spectralMode}
          />
        </Suspense>
      </Canvas>

      {/* Active Hotspot Educational Drawer */}
      {activeLabel && labelDetails[activeLabel] && (
        <div
          className="glass-panel"
          style={{
            position: "absolute",
            bottom: "6.5rem",
            right: "2rem",
            maxWidth: "340px",
            padding: "1.2rem 1.4rem",
            zIndex: 15,
            animation: "fadeIn 0.25s ease-out",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: labelDetails[activeLabel].color,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {labelDetails[activeLabel].badge}
            </span>
            <button
              onClick={() => setActiveLabel(null)}
              style={{ color: "#94a3b8", fontSize: "0.8rem", cursor: "pointer", background: "none", border: "none" }}
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
          <h4 style={{ fontSize: "1.05rem", color: "#ffffff", marginBottom: "0.4rem" }}>
            {labelDetails[activeLabel].title}
          </h4>
          <p style={{ fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
            {labelDetails[activeLabel].text}
          </p>
        </div>
      )}

      {/* Viewport Control Cluster */}
      <div className="scene-overlay-controls">
        {/* Spectral View Filter Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.35rem" }}>
          <span style={{ fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "0.35rem" }}>
            Spectrum:
          </span>
          {["composite", "optical", "xray"].map((mode) => (
            <button
              key={mode}
              onClick={() => handleSpectralChange(mode)}
              className="glass-pill"
              style={{
                padding: "0.25rem 0.65rem",
                fontSize: "0.68rem",
                textTransform: "capitalize",
                fontWeight: spectralMode === mode ? 700 : 500,
                color: spectralMode === mode ? "#ffffff" : "#94a3b8",
                background: spectralMode === mode ? "rgba(157, 78, 221, 0.35)" : "transparent",
                borderColor: spectralMode === mode ? "#c77dff" : "rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Toggle Dark Matter Halo */}
        <label className="toggle-switch-label" onClick={() => onToggleHalo && onToggleHalo()}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            {showHalo ? <Eye size={15} color="#c77dff" /> : <EyeOff size={15} color="#94a3b8" />}
            SHOW DARK MATTER HALO
          </span>
          <div className={`toggle-slider ${showHalo ? "active" : ""}`}>
            <div className="toggle-knob" />
          </div>
        </label>

        <div className="scene-hint">
          <Info size={13} color="#00f5d4" />
          <span>Drag to rotate 3D view</span>
        </div>
      </div>
    </div>
  );
}
