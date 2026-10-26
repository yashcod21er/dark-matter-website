import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getStarTexture, getGlowTexture, getDustTexture } from "../utils/textureGen";

export default function SpiralGalaxy({
  particleCount = 18000,
  arms = 2,
  radius = 7.5,
  spin = 1.6,
  randomness = 0.38,
  power = 3.6,
  spectralMode = "composite", // "composite", "optical", "xray"
}) {
  const pointsRef = useRef();
  const dustRef = useRef();
  const coreGlowRef = useRef();
  const photonRingRef = useRef();
  const jetRef = useRef();
  const time = useRef(0);

  const starTexture = useMemo(() => getStarTexture(), []);
  const glowTexture = useMemo(() => getGlowTexture(), []);
  const dustTexture = useMemo(() => getDustTexture(), []);

  // 1. Procedural Stars (Luminous Population) with Orbital Kinematics
  const { starPositions, starColors, starRadii, starBaseAngles, starSpeeds, starOffsetsY } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const rArr = new Float32Array(particleCount);
    const angArr = new Float32Array(particleCount);
    const spdArr = new Float32Array(particleCount);
    const yOffArr = new Float32Array(particleCount);

    // Astronomical color palettes
    const cBulge = new THREE.Color("#fff2b2");    // Warm K/M-giant solar core
    const cHotBlue = new THREE.Color("#38bdf8");  // Massive O/B hypergiants in arms
    const cCyanGlow = new THREE.Color("#00f5d4"); // H-II ionized stellar nurseries
    const cOuterViolet = new THREE.Color("#c084fc"); // Fading periphery

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), power) * radius + 0.15;

      // Arm assignment with subtle logarithmic spiral pitch
      const branchAngle = ((i % arms) * 2 * Math.PI) / arms;
      const spinAngle = r * spin;

      // Dispersion tighter near the arm spines, fluffier in the outer halo
      const dispersion = randomness * (0.18 + (r / radius) * 0.82);
      const randomX = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * dispersion * r;
      const randomY = Math.pow(Math.random(), 2.4) * (Math.random() < 0.5 ? 1 : -1) * 0.22 * (r + 0.3);
      const randomZ = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * dispersion * r;

      const angle = branchAngle + spinAngle;

      rArr[i] = r;
      angArr[i] = angle;
      yOffArr[i] = randomY;

      // Dark Matter Flat Rotation Curve: v(r) ~ const -> w(r) = v / r ~ 0.22 / (r + 1.2)
      spdArr[i] = 0.26 / Math.sqrt(r * 0.9 + 0.8);

      pos[i3] = Math.cos(angle) * r + randomX;
      pos[i3 + 1] = randomY;
      pos[i3 + 2] = Math.sin(angle) * r + randomZ;

      // Color computation based on radial population
      const normR = r / radius;
      let col;

      if (normR < 0.22) {
        col = cBulge.clone().lerp(cHotBlue, normR / 0.22);
      } else if (normR < 0.65) {
        const t = (normR - 0.22) / 0.43;
        col = Math.random() < 0.4 ? cCyanGlow.clone() : cHotBlue.clone().lerp(cOuterViolet, t);
      } else {
        col = cOuterViolet.clone();
      }

      // X-Ray spectral mode override
      if (spectralMode === "xray") {
        const xrayCol = new THREE.Color("#ec4899");
        col = normR < 0.25 ? new THREE.Color("#ffffff") : xrayCol.clone().multiplyScalar(1 - normR * 0.8);
      }

      cols[i3] = col.r;
      cols[i3 + 1] = col.g;
      cols[i3 + 2] = col.b;
    }

    return {
      starPositions: pos,
      starColors: cols,
      starRadii: rArr,
      starBaseAngles: angArr,
      starSpeeds: spdArr,
      starOffsetsY: yOffArr,
    };
  }, [particleCount, arms, radius, spin, randomness, power, spectralMode]);

  // Current dynamic star angles
  const currentStarAngles = useRef(new Float32Array(starBaseAngles));

  // 2. Cosmic Dust Lanes (Absorptive silhouettes)
  const { dustPos, dustCols, dustRadii, dustAngles, dustSpeeds } = useMemo(() => {
    const dCount = 4200;
    const pos = new Float32Array(dCount * 3);
    const cols = new Float32Array(dCount * 3);
    const rArr = new Float32Array(dCount);
    const angArr = new Float32Array(dCount);
    const spdArr = new Float32Array(dCount);
    const cDust = new THREE.Color("#2a0845");

    for (let i = 0; i < dCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2.8) * (radius * 0.85) + 0.6;
      const branchAngle = ((i % arms) * 2 * Math.PI) / arms + 0.2;
      const spinAngle = r * spin;

      const randomX = (Math.random() - 0.5) * 0.32 * r;
      const randomY = (Math.random() - 0.5) * 0.12;
      const randomZ = (Math.random() - 0.5) * 0.32 * r;

      const angle = branchAngle + spinAngle;
      rArr[i] = r;
      angArr[i] = angle;
      spdArr[i] = 0.22 / Math.sqrt(r * 0.9 + 0.8);

      pos[i3] = Math.cos(angle) * r + randomX;
      pos[i3 + 1] = randomY;
      pos[i3 + 2] = Math.sin(angle) * r + randomZ;

      cols[i3] = cDust.r;
      cols[i3 + 1] = cDust.g;
      cols[i3 + 2] = cDust.b;
    }

    return { dustPos: pos, dustCols: cols, dustRadii: rArr, dustAngles: angArr, dustSpeeds: spdArr };
  }, [arms, radius, spin]);

  const currentDustAngles = useRef(new Float32Array(dustAngles));

  // 3. Relativistic Astrophysical Polar Jets
  const jetParticles = useMemo(() => {
    const jCount = 280;
    const pos = new Float32Array(jCount * 3);
    const cols = new Float32Array(jCount * 3);
    const cCyan = new THREE.Color("#00f5d4");
    const cBlue = new THREE.Color("#38bdf8");

    for (let i = 0; i < jCount; i++) {
      const i3 = i * 3;
      const sign = i % 2 === 0 ? 1 : -1;
      const dist = Math.random() * 4.5 + 0.3;
      const spread = (dist / 4.5) * 0.25;

      pos[i3] = (Math.random() - 0.5) * spread;
      pos[i3 + 1] = dist * sign;
      pos[i3 + 2] = (Math.random() - 0.5) * spread;

      const c = Math.random() < 0.6 ? cCyan : cBlue;
      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }
    return { pos, cols };
  }, []);

  // Galactic rotation and wave loop
  useFrame((state, delta) => {
    time.current += delta;
    const t = time.current;

    // A. Differential Rotation of Stars with Galactic Warp Wave
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array;
      const angles = currentStarAngles.current;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        angles[i] += delta * starSpeeds[i] * 0.35;
        const th = angles[i];
        const r = starRadii[i];

        // Cosmic galactic disk warp wave (integral-sign warp)
        const warp = Math.sin(th + t * 0.4) * (r / radius) * (r / radius) * 0.16;

        pos[i3] = Math.cos(th) * r;
        pos[i3 + 1] = starOffsetsY[i] + warp;
        pos[i3 + 2] = Math.sin(th) * r;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // B. Dust Lane Differential Flow
    if (dustRef.current) {
      const pos = dustRef.current.geometry.attributes.position.array;
      const angles = currentDustAngles.current;
      for (let i = 0; i < dustRadii.length; i++) {
        const i3 = i * 3;
        angles[i] += delta * dustSpeeds[i] * 0.35;
        const th = angles[i];
        const r = dustRadii[i];
        const warp = Math.sin(th + t * 0.4) * (r / radius) * 0.14;

        pos[i3] = Math.cos(th) * r;
        pos[i3 + 1] = warp;
        pos[i3 + 2] = Math.sin(th) * r;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // C. Relativistic Photon Ring rapid swirl
    if (photonRingRef.current) {
      photonRingRef.current.rotation.z += delta * 2.8;
    }

    // D. Core breathing pulse
    if (coreGlowRef.current) {
      const s = 1.0 + Math.sin(t * 2.0) * 0.08 + Math.cos(t * 0.8) * 0.04;
      coreGlowRef.current.scale.set(s, s, s);
    }

    // E. Relativistic Jet stream pulse
    if (jetRef.current) {
      jetRef.current.rotation.y += delta * 1.5;
      const js = 1.0 + Math.sin(t * 4.0) * 0.1;
      jetRef.current.scale.set(1, js, 1);
    }
  });

  return (
    <group>
      {/* Supermassive Core Singularity & Accretion Halo */}
      <group position={[0, 0, 0]} ref={coreGlowRef}>
        {/* Event Horizon Silhouette */}
        <mesh>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Accretion Photon Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} ref={photonRingRef}>
          <ringGeometry args={[0.38, 0.52, 64]} />
          <meshBasicMaterial
            color="#fbbf24"
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Volumetric Core Glow */}
        <sprite scale={[3.4, 3.4, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#ffe8a3"
            transparent
            opacity={0.88}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>

        {/* Secondary Cyan Ionization Halo */}
        <sprite scale={[6.4, 6.4, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#00f5d4"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      </group>

      {/* Relativistic Astrophysical Polar Jet Beams */}
      <points ref={jetRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[jetParticles.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[jetParticles.cols, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={0.28}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Main Luminous Spiral Arms (Differential Flow) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={0.42}
          vertexColors
          transparent
          opacity={0.94}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Interstellar Dust Silhouette Lanes */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustCols, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={dustTexture}
          size={0.85}
          vertexColors
          transparent
          opacity={0.42}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

