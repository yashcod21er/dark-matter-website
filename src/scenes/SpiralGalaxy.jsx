import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getStarTexture, getGlowTexture, getDustTexture } from "../utils/textureGen";

/**
 * Procedural Realistic Spiral Galaxy (NGC 2841 / M81 morphology)
 * Features natural stellar dispersion, logarithmic spiral arms,
 * H-II star-forming nurseries, and realistic dark matter differential rotation.
 */
export default function SpiralGalaxy({
  particleCount = 22000,
  arms = 4, // 2 primary spiral arms + 2 secondary spurs
  radius = 6.6,
  spin = 1.15,
  randomness = 0.45,
  power = 1.7, // Natural exponential galactic disk decay
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

  // 1. Procedural Stars (Luminous Stellar Population)
  const { starPositions, starColors, starRadii, starBaseAngles, starSpeeds, starOffsetsY } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const rArr = new Float32Array(particleCount);
    const angArr = new Float32Array(particleCount);
    const spdArr = new Float32Array(particleCount);
    const yOffArr = new Float32Array(particleCount);

    // Astronomical color palettes
    const cBulgeWarm = new THREE.Color("#fff7ed"); // Warm K/M-type stars in core
    const cBulgeAmber = new THREE.Color("#fbbf24"); // Ancient golden stars
    const cArmElectric = new THREE.Color("#38bdf8"); // Massive young O/B hypergiants
    const cArmCyan = new THREE.Color("#00f5d4"); // H-II ionized stellar nurseries
    const cArmViolet = new THREE.Color("#a855f7"); // Ethereal outer spiral dust
    const cPeriphery = new THREE.Color("#c084fc"); // Diffuse halo stars

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      let r;
      let angle;
      let randomX;
      let randomY;
      let randomZ;
      let col;

      if (i < 4500) {
        // A. Dense Central Galactic Bulge (Gaussian spherical cluster)
        r = Math.pow(Math.random(), 2.0) * 1.6 + 0.08;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const bulgeDisp = (1.6 - r) * 0.28;

        randomX = Math.sin(phi) * Math.cos(theta) * bulgeDisp;
        randomY = Math.cos(phi) * bulgeDisp * 0.65;
        randomZ = Math.sin(phi) * Math.sin(theta) * bulgeDisp;

        angle = theta;
        col = Math.random() < 0.65 ? cBulgeWarm.clone() : cBulgeAmber.clone();
      } else {
        // B. Logarithmic Spiral Arms & Disk
        r = Math.pow(Math.random(), power) * (radius - 1.2) + 1.2;

        // Arm index (0 to arms - 1)
        const armIdx = i % arms;
        const branchAngle = (armIdx * 2 * Math.PI) / arms;
        const spinAngle = r * spin;

        // Arm width widens naturally with radius (dispersion)
        const armWidth = randomness * (0.22 + (r / radius) * 0.65);
        randomX = (Math.random() - 0.5) * armWidth * r * 0.7;
        randomY = (Math.random() - 0.5) * (0.12 + (r / radius) * 0.2);
        randomZ = (Math.random() - 0.5) * armWidth * r * 0.7;

        angle = branchAngle + spinAngle;

        // Color coding along spiral arms
        const normR = r / radius;
        if (normR < 0.35) {
          col = cBulgeAmber.clone().lerp(cArmElectric, (normR - 0.15) / 0.2);
        } else if (normR < 0.75) {
          const t = (normR - 0.35) / 0.4;
          col = Math.random() < 0.35 ? cArmCyan.clone() : cArmElectric.clone().lerp(cArmViolet, t);
        } else {
          col = cArmViolet.clone().lerp(cPeriphery, (normR - 0.75) / 0.25);
        }
      }

      // Spectral mode override
      if (spectralMode === "xray") {
        const xrayCol = new THREE.Color("#ec4899");
        col = r < 1.5 ? new THREE.Color("#ffffff") : xrayCol.clone().multiplyScalar(Math.max(0.2, 1 - r / radius));
      } else if (spectralMode === "optical") {
        if (r > 1.5 && Math.random() < 0.4) {
          col = cArmElectric.clone();
        }
      }

      rArr[i] = r;
      angArr[i] = angle;
      yOffArr[i] = randomY;

      // Dark Matter Flat Rotation Curve: v(r) ~ const -> w(r) = v / r
      spdArr[i] = 0.24 / Math.sqrt(r * 0.85 + 0.6);

      pos[i3] = Math.cos(angle) * r + randomX;
      pos[i3 + 1] = randomY;
      pos[i3 + 2] = Math.sin(angle) * r + randomZ;

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

  const currentStarAngles = useRef(new Float32Array(starBaseAngles));

  // 2. Realistic Absorptive Cosmic Dust Lanes
  const { dustPos, dustCols, dustRadii, dustAngles, dustSpeeds } = useMemo(() => {
    const dCount = 4800;
    const pos = new Float32Array(dCount * 3);
    const cols = new Float32Array(dCount * 3);
    const rArr = new Float32Array(dCount);
    const angArr = new Float32Array(dCount);
    const spdArr = new Float32Array(dCount);
    const cDust = new THREE.Color("#1e0b36");

    for (let i = 0; i < dCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2.2) * (radius * 0.8) + 0.8;
      const armIdx = i % arms;
      const branchAngle = (armIdx * 2 * Math.PI) / arms + 0.18; // hugs inner edge of luminous arms
      const spinAngle = r * spin;

      const randomX = (Math.random() - 0.5) * 0.28 * r;
      const randomY = (Math.random() - 0.5) * 0.1;
      const randomZ = (Math.random() - 0.5) * 0.28 * r;

      const angle = branchAngle + spinAngle;
      rArr[i] = r;
      angArr[i] = angle;
      spdArr[i] = 0.22 / Math.sqrt(r * 0.85 + 0.6);

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

  // 3. Collimated Relativistic Polar Jets
  const jetParticles = useMemo(() => {
    const jCount = 200;
    const pos = new Float32Array(jCount * 3);
    const cols = new Float32Array(jCount * 3);
    const cCyan = new THREE.Color("#00f5d4");
    const cBlue = new THREE.Color("#38bdf8");

    for (let i = 0; i < jCount; i++) {
      const i3 = i * 3;
      const sign = i % 2 === 0 ? 1 : -1;
      const dist = Math.random() * 4.0 + 0.3;
      const spread = (dist / 4.0) * 0.18;

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

  // Frame update loop
  useFrame((state, delta) => {
    time.current += delta;
    const t = time.current;

    // A. Differential rotation of all stars with gentle disk warp
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array;
      const angles = currentStarAngles.current;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        angles[i] += delta * starSpeeds[i] * 0.32;
        const th = angles[i];
        const r = starRadii[i];

        // Smooth vertical galactic disk warp
        const warp = Math.sin(th + t * 0.35) * Math.pow(r / radius, 2) * 0.12;

        pos[i3] = Math.cos(th) * r;
        pos[i3 + 1] = starOffsetsY[i] + warp;
        pos[i3 + 2] = Math.sin(th) * r;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // B. Dust lanes flow
    if (dustRef.current) {
      const pos = dustRef.current.geometry.attributes.position.array;
      const angles = currentDustAngles.current;
      for (let i = 0; i < dustRadii.length; i++) {
        const i3 = i * 3;
        angles[i] += delta * dustSpeeds[i] * 0.32;
        const th = angles[i];
        const r = dustRadii[i];
        const warp = Math.sin(th + t * 0.35) * Math.pow(r / radius, 2) * 0.1;

        pos[i3] = Math.cos(th) * r;
        pos[i3 + 1] = warp;
        pos[i3 + 2] = Math.sin(th) * r;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // C. Core breathing & subtle photon ring rotation
    if (coreGlowRef.current) {
      const s = 1.0 + Math.sin(t * 1.8) * 0.05;
      coreGlowRef.current.scale.set(s, s, s);
    }

    if (photonRingRef.current) {
      photonRingRef.current.rotation.z += delta * 1.2;
    }

    // D. Polar jets pulse
    if (jetRef.current) {
      jetRef.current.rotation.y += delta * 1.2;
    }
  });

  return (
    <group>
      {/* Luminous Core Nucleus (Soft, Volumetric, Non-cartoonish) */}
      <group position={[0, 0, 0]} ref={coreGlowRef}>
        {/* Core Volumetric Glow */}
        <sprite scale={[2.6, 2.6, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#fff8e7"
            transparent
            opacity={0.92}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>

        {/* Golden Central Bulge Corona */}
        <sprite scale={[4.6, 4.6, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#fbbf24"
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>

        {/* Ionized Cyan Shimmer */}
        <sprite scale={[6.8, 6.8, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#00f5d4"
            transparent
            opacity={0.16}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>

        {/* Delicate Ethereal Accretion Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} ref={photonRingRef}>
          <ringGeometry args={[0.35, 0.44, 48]} />
          <meshBasicMaterial
            color="#ffe8a3"
            side={THREE.DoubleSide}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Relativistic Polar Jets */}
      <points ref={jetRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[jetParticles.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[jetParticles.cols, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={0.22}
          vertexColors
          transparent
          opacity={0.65}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Main Luminous Stars (Fine, Crisp, High-Resolution Stellar Dust) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={0.24}
          vertexColors
          transparent
          opacity={0.88}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Absorptive Interstellar Dust Lanes */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustCols, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={dustTexture}
          size={0.65}
          vertexColors
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}
