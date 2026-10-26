import React, { useState } from "react";
import { Html } from "@react-three/drei";

export default function FloatingInfoLabel({
  position = [0, 0, 0],
  title,
  subtitle,
  active = false,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* 3D Pulse Anchor Ring */}
      <mesh onClick={onClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial
          color={active ? "#00f5d4" : hovered ? "#c77dff" : "#9d4edd"}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[0.28, 0.36, 24]} />
        <meshBasicMaterial
          color={active ? "#00f5d4" : "#c77dff"}
          transparent
          opacity={0.5}
          side={2}
        />
      </mesh>

      <Html
        distanceFactor={15}
        center
        position={[0, 0.6, 0]}
        style={{ pointerEvents: "auto", userSelect: "none" }}
      >
        <div
          onClick={onClick}
          style={{
            cursor: "pointer",
            background: active
              ? "rgba(10, 25, 45, 0.9)"
              : hovered
              ? "rgba(20, 15, 38, 0.9)"
              : "rgba(5, 7, 15, 0.75)",
            border: `1px solid ${active ? "#00f5d4" : hovered ? "#c77dff" : "rgba(255, 255, 255, 0.15)"}`,
            padding: "4px 10px",
            borderRadius: "999px",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            backdropFilter: "blur(8px)",
            boxShadow: active ? "0 0 15px rgba(0, 245, 212, 0.4)" : "none",
            transform: hovered || active ? "scale(1.08)" : "scale(1)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: active ? "#00f5d4" : "#9d4edd",
              boxShadow: `0 0 6px ${active ? "#00f5d4" : "#9d4edd"}`,
            }}
          />
          <span>{title}</span>
        </div>
      </Html>
    </group>
  );
}
