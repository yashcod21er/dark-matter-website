import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import StarField from "./StarField";
import { getGlowTexture, getStarTexture } from "../utils/textureGen";

function BulletClusterRig({ step = 2 }) {
  const groupRef = useRef();
  const shockwaveRef = useRef();
  const time = useRef(0);

  const glowTexture = useMemo(() => getGlowTexture(), []);
  const starTexture = useMemo(() => getStarTexture(), []);

  // Target positions based on step (0: Pre, 1: Collision, 2: Observed separation)
  const targetState = useMemo(() => {
    if (step === 0) {
      return {
        gas1X: -5.8,
        gas2X: 5.8,
        dm1X: -5.8,
        dm2X: 5.8,
        gal1X: -5.8,
        gal2X: 5.8,
        shockScale: 0.1,
        shockOpacity: 0,
        gasTurbulence: 0.05,
      };
    } else if (step === 1) {
      // Peak Collision: intense thermal heating & shockwave
      return {
        gas1X: -0.5,
        gas2X: 0.5,
        dm1X: -0.8,
        dm2X: 0.8,
        gal1X: -0.8,
        gal2X: 0.8,
        shockScale: 4.8,
        shockOpacity: 0.85,
        gasTurbulence: 0.35,
      };
    } else {
      // Step 2: Observed Today (Clear Spatial Disconnection)
      return {
        gas1X: -0.9,  // Decelerated hot X-ray gas
        gas2X: 0.9,
        dm1X: -4.8,   // Collisionless dark matter passed through
        dm2X: 4.4,
        gal1X: -4.8,  // Collisionless galaxies passed through
        gal2X: 4.4,
        shockScale: 8.5,
        shockOpacity: 0.25,
        gasTurbulence: 0.12,
      };
    }
  }, [step]);

  const currentPos = useRef({
    gas1X: targetState.gas1X,
    gas2X: targetState.gas2X,
    dm1X: targetState.dm1X,
    dm2X: targetState.dm2X,
    gal1X: targetState.gal1X,
    gal2X: targetState.gal2X,
    shockScale: targetState.shockScale,
    shockOpacity: targetState.shockOpacity,
    gasTurbulence: targetState.gasTurbulence,
  });

  // Hot Plasma Gas Particles (Chandra X-Ray Pink/Red)
  const gasParticles = useMemo(() => {
    const count = 1800;
    const pos = new Float32Array(count * 3);
    const basePos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cPink = new THREE.Color("#f43f5e");
    const cRed = new THREE.Color("#fb7185");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const u = Math.random();
      const r = Math.pow(u, 0.45) * 1.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.sin(phi) * Math.sin(theta) * 0.72;
      const pz = r * Math.cos(phi);

      pos[i3] = px;
      pos[i3 + 1] = py;
      pos[i3 + 2] = pz;

      basePos[i3] = px;
      basePos[i3 + 1] = py;
      basePos[i3 + 2] = pz;

      const c = Math.random() < 0.5 ? cPink : cRed;
      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }
    return { pos, basePos, cols };
  }, []);

  // Galaxy Cluster Stars (Hubble Optical Yellow/White)
  const galaxyStars = useMemo(() => {
    const count = 550;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cGold = new THREE.Color("#fbbf24");
    const cWhite = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2.2) * 1.35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      const c = Math.random() < 0.6 ? cGold : cWhite;
      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }
    return { pos, cols };
  }, []);

  const gasRef1 = useRef();
  const gasRef2 = useRef();
  const dmRef1 = useRef();
  const dmRef2 = useRef();
  const galRef1 = useRef();
  const galRef2 = useRef();
  const bowShockRef = useRef();

  useFrame((state, delta) => {
    time.current += delta;
    const t = time.current;
    const lerpRate = Math.min(delta * 3.8, 1.0);
    const cp = currentPos.current;

    cp.gas1X = THREE.MathUtils.lerp(cp.gas1X, targetState.gas1X, lerpRate);
    cp.gas2X = THREE.MathUtils.lerp(cp.gas2X, targetState.gas2X, lerpRate);
    cp.dm1X = THREE.MathUtils.lerp(cp.dm1X, targetState.dm1X, lerpRate);
    cp.dm2X = THREE.MathUtils.lerp(cp.dm2X, targetState.dm2X, lerpRate);
    cp.gal1X = THREE.MathUtils.lerp(cp.gal1X, targetState.gal1X, lerpRate);
    cp.gal2X = THREE.MathUtils.lerp(cp.gal2X, targetState.gal2X, lerpRate);
    cp.shockScale = THREE.MathUtils.lerp(cp.shockScale, targetState.shockScale, lerpRate);
    cp.shockOpacity = THREE.MathUtils.lerp(cp.shockOpacity, targetState.shockOpacity, lerpRate);
    cp.gasTurbulence = THREE.MathUtils.lerp(cp.gasTurbulence, targetState.gasTurbulence, lerpRate);

    if (gasRef1.current) gasRef1.current.position.x = cp.gas1X;
    if (gasRef2.current) gasRef2.current.position.x = cp.gas2X;
    if (dmRef1.current) dmRef1.current.position.x = cp.dm1X;
    if (dmRef2.current) dmRef2.current.position.x = cp.dm2X;
    if (galRef1.current) galRef1.current.position.x = cp.gal1X;
    if (galRef2.current) galRef2.current.position.x = cp.gal2X;

    // Shockwave expansion & breathing
    if (shockwaveRef.current) {
      shockwaveRef.current.scale.set(cp.shockScale, cp.shockScale, 1);
      shockwaveRef.current.material.opacity = cp.shockOpacity * (0.8 + Math.sin(t * 4.0) * 0.2);
    }

    // Dynamic Bow Shock undulation
    if (bowShockRef.current) {
      const showBow = step === 2;
      bowShockRef.current.visible = showBow;
      if (showBow) {
        const s = 1.0 + Math.sin(t * 3.5) * 0.08;
        bowShockRef.current.scale.set(s, s, s);
      }
    }

    // Ethereal dark matter breathing
    if (dmRef1.current) {
      const s = 1.0 + Math.sin(t * 1.5) * 0.04;
      dmRef1.current.scale.set(s, s, 1);
    }
    if (dmRef2.current) {
      const s = 1.0 + Math.cos(t * 1.5) * 0.04;
      dmRef2.current.scale.set(s, s, 1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Collision Epicenter Shockwave Ring */}
      <mesh ref={shockwaveRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.9, 1.05, 48]} />
        <meshBasicMaterial
          color="#f43f5e"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 1. HOT INTERGALACTIC PLASMA (CHANDRA X-RAY - PINK/MAGENTA) */}
      <group ref={gasRef1} position={[currentPos.current.gas1X, 0, 0]}>
        <sprite scale={[5.4, 4.0, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#f43f5e"
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
          />
        </sprite>

        {/* Supersonic Bow Shock Cone in Step 2 */}
        <group ref={bowShockRef} position={[-0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <coneGeometry args={[1.7, 2.4, 28, 1, true]} />
            <meshBasicMaterial
              color="#fb7185"
              wireframe
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <ringGeometry args={[1.55, 1.68, 36]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      </group>

      <group ref={gasRef2} position={[currentPos.current.gas2X, 0, 0]}>
        <sprite scale={[4.8, 3.4, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#fb7185"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      {/* 2. DARK MATTER GRAVITATIONAL LENSING MASS ENVELOPES (LENSING BLUE/CYAN) */}
      <group ref={dmRef1} position={[currentPos.current.dm1X, 0, 0]}>
        <sprite scale={[7.8, 6.2, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#38bdf8"
            transparent
            opacity={0.48}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
        <sprite scale={[10.0, 7.8, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#9d4edd"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      <group ref={dmRef2} position={[currentPos.current.dm2X, 0, 0]}>
        <sprite scale={[6.8, 5.4, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#38bdf8"
            transparent
            opacity={0.48}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
        <sprite scale={[8.8, 6.8, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#9d4edd"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      {/* 3. COLLISIONLESS GALAXIES (OPTICAL STARS - GOLD/WHITE) */}
      <group ref={galRef1} position={[currentPos.current.gal1X, 0, 0]}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[galaxyStars.pos, 3]} />
            <bufferAttribute attach="attributes-color" args={[galaxyStars.cols, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={starTexture}
            size={0.38}
            vertexColors
            transparent
            opacity={0.92}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      <group ref={galRef2} position={[currentPos.current.gal2X, 0, 0]}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[galaxyStars.pos, 3]} />
            <bufferAttribute attach="attributes-color" args={[galaxyStars.cols, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={starTexture}
            size={0.38}
            vertexColors
            transparent
            opacity={0.92}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}

export default function BulletClusterScene({ step = 2 }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 4, 13], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxDistance={22}
          minDistance={6}
          maxPolarAngle={Math.PI / 1.8}
        />
        <ambientLight intensity={0.4} />
        <StarField count={1100} radius={45} />
        <BulletClusterRig step={step} />
      </Canvas>

      {/* Multi-spectral Legend Badges */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.6rem",
          zIndex: 10,
        }}
      >
        <span
          className="glass-pill"
          style={{
            padding: "0.3rem 0.75rem",
            fontSize: "0.68rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "#fb7185",
            border: "1px solid rgba(251, 113, 133, 0.4)",
            background: "rgba(3, 5, 12, 0.8)",
          }}
        >
          ● PINK: X-RAY HOT PLASMA (DRAGGED &amp; DECELERATED)
        </span>
        <span
          className="glass-pill"
          style={{
            padding: "0.3rem 0.75rem",
            fontSize: "0.68rem",
            fontFamily: "var(--font-mono, monospace)",
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            background: "rgba(3, 5, 12, 0.8)",
          }}
        >
          ● BLUE: WEAK LENSING MASS (PASSED THROUGH)
        </span>
      </div>
    </div>
  );
}

