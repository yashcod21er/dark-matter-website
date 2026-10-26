import React from "react";
import { Move3d, RotateCcw, ZoomIn } from "lucide-react";

export default function SceneControls({ onReset, hint = "Drag to rotate • Scroll to zoom" }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        pointerEvents: "auto",
      }}
    >
      <div
        className="glass-pill"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.35rem 0.75rem",
          fontSize: "0.72rem",
          color: "#94a3b8",
          userSelect: "none",
        }}
      >
        <Move3d size={13} color="#00f5d4" />
        <span>{hint}</span>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="glass-pill"
          style={{
            padding: "0.35rem",
            color: "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.2s",
          }}
          title="Reset Camera View"
          aria-label="Reset Camera"
        >
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
}
