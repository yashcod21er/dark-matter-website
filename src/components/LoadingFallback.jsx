import React from "react";

export default function LoadingFallback({ message = "Constructing 3D Simulation..." }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle, rgba(14, 22, 50, 0.9) 0%, rgba(3, 5, 12, 0.98) 100%)",
        zIndex: 20,
        color: "#ffffff",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "3px solid rgba(157, 78, 221, 0.2)",
          borderTopColor: "#00f5d4",
          borderRightColor: "#c77dff",
          animation: "spin 1s linear infinite",
        }}
      />
      <span style={{ fontSize: "0.85rem", color: "#94a3b8", letterSpacing: "0.05em", fontFamily: "Space Grotesk, sans-serif" }}>
        {message}
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
