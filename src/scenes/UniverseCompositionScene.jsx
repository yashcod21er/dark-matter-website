import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import StarField from "./StarField";
import { getGlowTexture, getStarTexture } from "../utils/textureGen";

function CompositionRing({
  radiusInner,
  radiusOuter,
  arcAngle,
  startAngle,
  color,
  highlighted,
  onClick,
  onPointerOver,
  onPointerOut,
  count = 2400,
}) {
  const pointsRef = useRef();
  const starTexture = useMemo(() => getStarTexture(), []);

  const [positions, cols] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cl = new Float32Array(count * 3);
    const baseCol = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = startAngle + Math.random() * arcAngle;
      const r = radiusInner + Math.random() * (radiusOuter - radiusInner);
      const thickness = (Math.random() - 0.5) * 0.45;

      pos[i3] = Math.cos(angle) * r;
      pos[i3 + 1] = thickness;
      pos[i3 + 2] = Math.sin(angle) * r;

      cl[i3] = baseCol.r;
      cl[i3 + 1] = baseCol.g;
      cl[i3 + 2] = baseCol.b;
    }
    return [pos, cl];
  }, [count, radiusInner, radiusOuter, arcAngle, startAngle, color]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * (highlighted ? 0.08 : 0.03);
    }
  });

  return (
    <group
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      scale={highlighted ? [1.06, 1.06, 1.06] : [1, 1, 1]}
    >
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[cols, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={highlighted ? 0.42 : 0.3}
          vertexColors
          transparent
          opacity={highlighted ? 0.95 : 0.75}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Boundary Guide Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radiusInner, radiusOuter, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={highlighted ? 0.15 : 0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function CompositionGyroscope({ activeSliceId, onSelectSlice }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI / 5 + Math.sin(state.clock.elapsedTime * 0.35) * 0.05;
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.25) * 0.04;
    }
  });

  // Cosmic Budget: Dark Energy ~68% (4.27 rad), Dark Matter ~27% (1.70 rad), Ordinary Matter ~5% (0.31 rad)
  return (
    <group ref={groupRef}>
      {/* 1. Dark Energy Sector (~68.3%) */}
      <CompositionRing
        radiusInner={4.8}
        radiusOuter={6.5}
        startAngle={0}
        arcAngle={Math.PI * 2 * 0.683}
        color="#38bdf8"
        highlighted={activeSliceId === "dark_energy"}
        onClick={() => onSelectSlice("dark_energy")}
      />

      {/* 2. Dark Matter Sector (~26.8%) */}
      <CompositionRing
        radiusInner={3.0}
        radiusOuter={4.7}
        startAngle={Math.PI * 2 * 0.683}
        arcAngle={Math.PI * 2 * 0.268}
        color="#c084fc"
        highlighted={activeSliceId === "dark_matter"}
        onClick={() => onSelectSlice("dark_matter")}
      />

      {/* 3. Ordinary Baryonic Matter Sector (~4.9%) */}
      <CompositionRing
        radiusInner={1.6}
        radiusOuter={2.9}
        startAngle={Math.PI * 2 * (0.683 + 0.268)}
        arcAngle={Math.PI * 2 * 0.049}
        color="#fbbf24"
        highlighted={activeSliceId === "ordinary_matter"}
        onClick={() => onSelectSlice("ordinary_matter")}
      />

      {/* Center Cosmic Origin Marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export default function UniverseCompositionScene({ activeSliceId = "dark_matter", onSelectSlice }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 9, 14], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <OrbitControls enableZoom={true} enablePan={false} maxDistance={24} minDistance={6} />
        <ambientLight intensity={0.5} />
        <StarField count={1000} radius={45} />
        <CompositionGyroscope activeSliceId={activeSliceId} onSelectSlice={onSelectSlice || (() => {})} />
      </Canvas>
    </div>
  );
}
