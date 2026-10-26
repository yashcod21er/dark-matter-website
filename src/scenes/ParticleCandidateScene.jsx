import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import StarField from "./StarField";
import { getGlowTexture, getStarTexture } from "../utils/textureGen";

// 1. WIMP SIMULATION: Dual-Phase Liquid Xenon Cryostat Detector
function WimpSimulation() {
  const latticeGroup = useRef();
  const recoilFlashRef = useRef();
  const incomingParticleRef = useRef();
  const time = useRef(0);

  const glowTexture = useMemo(() => getGlowTexture(), []);
  const starTexture = useMemo(() => getStarTexture(), []);

  // 3D Xenon atomic targets in liquid lattice
  const atoms = useMemo(() => {
    const list = [];
    const spacing = 1.4;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          list.push([x * spacing, y * spacing, z * spacing]);
        }
      }
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    time.current += delta;
    if (latticeGroup.current) {
      latticeGroup.current.rotation.y += delta * 0.15;
    }

    const cycle = (time.current % 3.0) / 3.0;
    if (incomingParticleRef.current) {
      if (cycle < 0.45) {
        const progress = cycle / 0.45;
        incomingParticleRef.current.position.set(-7 + progress * 7, 2.5 - progress * 2.5, -2 + progress * 2);
        incomingParticleRef.current.visible = true;
      } else {
        const progress = (cycle - 0.45) / 0.55;
        incomingParticleRef.current.position.set(progress * 6, progress * 4.5, progress * 3.5);
      }
    }

    if (recoilFlashRef.current) {
      if (cycle > 0.43 && cycle < 0.6) {
        recoilFlashRef.current.visible = true;
        const scale = 1.0 + (cycle - 0.43) * 12;
        recoilFlashRef.current.scale.set(scale, scale, scale);
      } else {
        recoilFlashRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={latticeGroup}>
      {/* Cryostat Wireframe Enclosure */}
      <mesh>
        <cylinderGeometry args={[3.2, 3.2, 4.5, 32, 4, true]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.18} />
      </mesh>

      {/* Xenon Atomic Nuclei */}
      {atoms.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color={i === 13 ? "#00f5d4" : "#60a5fa"} />
          </mesh>
          <sprite scale={[1.2, 1.2, 1]}>
            <spriteMaterial
              map={glowTexture}
              color={i === 13 ? "#00f5d4" : "#3b82f6"}
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        </group>
      ))}

      {/* Recoil Flash (S1 / S2 Scintillation) */}
      <sprite ref={recoilFlashRef} position={[0, 0, 0]} visible={false}>
        <spriteMaterial
          map={glowTexture}
          color="#00f5d4"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* Incoming WIMP Trajectory Streak */}
      <mesh ref={incomingParticleRef} visible={false}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// 2. AXION SIMULATION: Quantum Oscillating Field Cavity
function AxionSimulation() {
  const pointsRef = useRef();
  const time = useRef(0);
  const glowTexture = useMemo(() => getGlowTexture(), []);

  // Coherent Quantum Wave Field Grid (800 particles)
  const { positions, baseCoords } = useMemo(() => {
    const list = [];
    const countX = 24;
    const countZ = 24;
    const pos = new Float32Array(countX * countZ * 3);

    for (let x = 0; x < countX; x++) {
      for (let z = 0; z < countZ; z++) {
        const u = (x / (countX - 1) - 0.5) * 7.5;
        const v = (z / (countZ - 1) - 0.5) * 7.5;
        list.push({ x: u, z: v });
      }
    }

    return { positions: pos, baseCoords: list };
  }, []);

  useFrame((state, delta) => {
    time.current += delta * 3.5;
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < baseCoords.length; i++) {
      const { x, z } = baseCoords[i];
      const dist = Math.sqrt(x * x + z * z);
      // Oscillating standing wave with radial harmonic
      const y = Math.sin(dist * 2.2 - time.current) * Math.cos(x * 1.5) * 0.75;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Resonant Microwave Cavity Walls */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[4.2, 4.2, 3.0, 32, 2, true]} />
        <meshBasicMaterial color="#c084fc" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Quantum Scalar Field Wavepacket */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={glowTexture}
          size={0.4}
          color="#c77dff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Primakoff Converted Photon Pulse */}
      <sprite scale={[2.5, 2.5, 1]} position={[0, 1.2, 0]}>
        <spriteMaterial
          map={glowTexture}
          color="#38bdf8"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

// 3. PRIMORDIAL BLACK HOLE SIMULATION: Relativistic Kerr Spacetime
function BlackHoleSimulation() {
  const diskRef = useRef();
  const time = useRef(0);
  const glowTexture = useMemo(() => getGlowTexture(), []);
  const starTexture = useMemo(() => getStarTexture(), []);

  // Relativistic Accretion Swarm
  const accretionParticles = useMemo(() => {
    const count = 1800;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cCyan = new THREE.Color("#00f5d4");
    const cViolet = new THREE.Color("#c77dff");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = 1.3 + Math.pow(Math.random(), 1.6) * 3.6;
      const angle = Math.random() * Math.PI * 2;

      pos[i3] = Math.cos(angle) * r;
      pos[i3 + 1] = (Math.random() - 0.5) * 0.15 * r;
      pos[i3 + 2] = Math.sin(angle) * r;

      const norm = (r - 1.3) / 3.6;
      const c = cCyan.clone().lerp(cViolet, norm);
      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }
    return { pos, cols };
  }, []);

  useFrame((state, delta) => {
    time.current += delta;
    if (diskRef.current) {
      diskRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group rotation={[Math.PI / 5, 0, 0]}>
      {/* Absolute Event Horizon */}
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Relativistic Photon Sphere Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.08, 1.25, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          side={THREE.DoubleSide}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Swirling Relativistic Accretion Ring */}
      <points ref={diskRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[accretionParticles.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[accretionParticles.cols, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={0.35}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Gravitational Lensing Halo */}
      <sprite scale={[5.2, 5.2, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#9d4edd"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

export default function ParticleCandidateScene({ candidateId = "wimp" }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 4, 9], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <OrbitControls enableZoom={true} enablePan={false} maxDistance={18} minDistance={4} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <StarField count={800} radius={25} />

        {candidateId === "wimp" && <WimpSimulation />}
        {candidateId === "axion" && <AxionSimulation />}
        {candidateId === "other" && <BlackHoleSimulation />}
      </Canvas>
    </div>
  );
}
