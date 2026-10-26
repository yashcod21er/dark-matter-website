import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import StarField from "./StarField";
import { getStarTexture, getGlowTexture } from "../utils/textureGen";

function OrbitingStars({ dmFraction = 0.85 }) {
  const pointsRef = useRef();
  const innerProbeRef = useRef();
  const outerProbeRef = useRef();
  const haloMeshRef = useRef();
  const time = useRef(0);
  const smoothedDm = useRef(dmFraction);

  const starTexture = useMemo(() => getStarTexture(), []);
  const glowTexture = useMemo(() => getGlowTexture(), []);

  // 2400 stars arranged in spiral arms + bulge
  const count = 2400;
  const { radii, baseAngles, speedsKeplerian, speedsFlat, colors, yOffsets } = useMemo(() => {
    const rArr = new Float32Array(count);
    const angles = new Float32Array(count);
    const sk = new Float32Array(count);
    const sf = new Float32Array(count);
    const cols = new Float32Array(count * 3);
    const yOff = new Float32Array(count);

    const coreColor = new THREE.Color("#fbbf24");
    const armColor = new THREE.Color("#00f5d4");
    const outerColor = new THREE.Color("#c77dff");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Radial distribution from core (0.8) to outer rim (6.4)
      const r = 0.8 + Math.pow(Math.random(), 1.5) * 5.6;

      // Spiral arms structure (2 arms)
      const armIdx = i % 2;
      const armAngle = armIdx * Math.PI + r * 1.35;
      const angleScatter = (Math.random() - 0.5) * 0.75 * (0.3 + (r / 6.4) * 0.7);
      const angle = armAngle + angleScatter;

      rArr[i] = r;
      angles[i] = angle;
      yOff[i] = (Math.random() - 0.5) * 0.22;

      // Keplerian angular velocity: w_K = v/r ~ 1 / r^1.5
      // v = 220 at r=1.5, drops to ~85 at r=5.5
      sk[i] = 1.85 / Math.pow(r, 1.35);

      // Flat rotation curve: v = const (~220 km/s) -> w_Flat = v/r ~ const / r
      sf[i] = 1.15 / (r + 0.3);

      const norm = (r - 0.8) / 5.6;
      let c;
      if (norm < 0.25) c = coreColor.clone().lerp(armColor, norm / 0.25);
      else if (norm < 0.7) c = armColor.clone().lerp(outerColor, (norm - 0.25) / 0.45);
      else c = outerColor;

      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }

    return {
      radii: rArr,
      baseAngles: angles,
      speedsKeplerian: sk,
      speedsFlat: sf,
      colors: cols,
      yOffsets: yOff,
    };
  }, [count]);

  const currentAngles = useRef(new Float32Array(baseAngles));
  const dynamicPositions = useMemo(() => new Float32Array(radii.length * 3), [radii]);

  // Two reference probe radii
  const rInner = 1.6;
  const rOuter = 5.4;
  const innerAngle = useRef(0);
  const outerAngle = useRef(Math.PI * 0.8);

  useFrame((state, delta) => {
    time.current += delta;

    // Smooth physics acceleration/deceleration when sliding DM fraction
    smoothedDm.current = THREE.MathUtils.lerp(smoothedDm.current, dmFraction, delta * 3.5);
    const dm = smoothedDm.current;

    // A. Update all 2400 galactic stars
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = radii[i];
        const wK = speedsKeplerian[i];
        const wF = speedsFlat[i];
        const effectiveW = THREE.MathUtils.lerp(wK, wF, dm);

        currentAngles.current[i] += delta * effectiveW * 0.45;
        const th = currentAngles.current[i];

        pos[i3] = Math.cos(th) * r;
        pos[i3 + 1] = yOffsets[i];
        pos[i3 + 2] = Math.sin(th) * r;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // B. Inner Probe kinematics (r = 1.6)
    const wInnerK = 1.85 / Math.pow(rInner, 1.35);
    const wInnerF = 1.15 / (rInner + 0.3);
    const wInner = THREE.MathUtils.lerp(wInnerK, wInnerF, dm) * 0.45;
    innerAngle.current += delta * wInner;
    if (innerProbeRef.current) {
      innerProbeRef.current.position.set(
        Math.cos(innerAngle.current) * rInner,
        0.05,
        Math.sin(innerAngle.current) * rInner
      );
    }

    // C. Outer Probe kinematics (r = 5.4)
    const wOuterK = 1.85 / Math.pow(rOuter, 1.35);
    const wOuterF = 1.15 / (rOuter + 0.3);
    const wOuter = THREE.MathUtils.lerp(wOuterK, wOuterF, dm) * 0.45;
    outerAngle.current += delta * wOuter;
    if (outerProbeRef.current) {
      outerProbeRef.current.position.set(
        Math.cos(outerAngle.current) * rOuter,
        0.05,
        Math.sin(outerAngle.current) * rOuter
      );
    }

    // D. Dark Matter Halo Volumetric Glow
    if (haloMeshRef.current) {
      haloMeshRef.current.material.opacity = dm * 0.32;
      const s = 1.0 + Math.sin(time.current * 1.2) * 0.02;
      haloMeshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Central Supermassive Core Bulge */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#ffe8a3" transparent opacity={0.9} />
      </mesh>
      <sprite scale={[3.8, 3.8, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#fbbf24"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Orbiting Spiral Disk Stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dynamicPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={0.42}
          vertexColors
          transparent
          opacity={0.92}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Probe Alpha: Inner Solar Core Beacon (r = 1.6) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[rInner - 0.02, rInner + 0.02, 64]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <group ref={innerProbeRef}>
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <sprite scale={[1.8, 1.8, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#fbbf24"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      {/* Probe Beta: Outer Rim Star Beacon (r = 5.4) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[rOuter - 0.03, rOuter + 0.03, 80]} />
        <meshBasicMaterial
          color={dmFraction > 0.4 ? "#00f5d4" : "#fbbf24"}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={outerProbeRef}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <sprite scale={[2.2, 2.2, 1]}>
          <spriteMaterial
            map={glowTexture}
            color={dmFraction > 0.4 ? "#00f5d4" : "#fbbf24"}
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      {/* Invisible Dark Matter Halo Sphere Envelope */}
      <sprite ref={haloMeshRef} scale={[14.0, 14.0, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#9d4edd"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Halo Outer Boundary Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.4, 6.48, 64]} />
        <meshBasicMaterial
          color="#c77dff"
          transparent
          opacity={dmFraction * 0.45}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function GalaxyRotationScene({ withDarkMatter = true, customDmFraction }) {
  const dmVal = customDmFraction !== undefined ? customDmFraction : withDarkMatter ? 0.85 : 0.05;

  // Real physical velocities for probes
  const innerV = 220; // km/s (dominated by core baryonic mass)
  const outerV = Math.round(85 + dmVal * 140); // 85 km/s up to 225 km/s

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 8.5, 11], fov: 44 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxDistance={22}
          minDistance={5}
          maxPolarAngle={Math.PI / 2}
        />
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 4, 0]} intensity={1.5} color="#ffe8a3" />
        <StarField count={1200} radius={40} />

        <OrbitingStars dmFraction={dmVal} />
      </Canvas>

      {/* Real-time Physics Telemetry */}
      <div
        className="glass-pill"
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          padding: "0.35rem 0.85rem",
          fontSize: "0.72rem",
          fontFamily: "var(--font-mono, monospace)",
          color: dmVal > 0.4 ? "#00f5d4" : "#fbbf24",
          border: `1px solid ${dmVal > 0.4 ? "rgba(0, 245, 212, 0.4)" : "rgba(251, 191, 36, 0.4)"}`,
          background: "rgba(3, 5, 12, 0.8)",
          transition: "all 0.3s ease",
        }}
      >
        HALO MASS: {Math.round(dmVal * 100)}% | MODEL: {dmVal > 0.4 ? "FLAT (RUBIN OBSERVED)" : "KEPLERIAN 1/√r (NEWTONIAN)"}
      </div>

      {/* Dual Probe Speedometer HUD */}
      <div
        className="glass-panel"
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          padding: "0.6rem 0.9rem",
          fontSize: "0.72rem",
          fontFamily: "var(--font-mono, monospace)",
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
          background: "rgba(5, 8, 20, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24" }} />
          <span style={{ color: "#94a3b8" }}>Inner Core Star (1.6 kpc):</span>
          <strong style={{ color: "#fbbf24" }}>{innerV} km/s</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: dmVal > 0.4 ? "#00f5d4" : "#fbbf24" }} />
          <span style={{ color: "#94a3b8" }}>Outer Rim Star (5.4 kpc):</span>
          <strong style={{ color: dmVal > 0.4 ? "#00f5d4" : "#fbbf24" }}>{outerV} km/s</strong>
        </div>
      </div>
    </div>
  );
}

