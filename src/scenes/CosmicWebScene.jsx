import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import StarField from "./StarField";
import { cosmicAudio } from "../utils/audioSynth";
import { getGlowTexture, getStarTexture } from "../utils/textureGen";

// Real cosmological supercluster nodes
export const CLUSTER_NODES = [
  {
    id: "laniakea",
    name: "Laniakea Core (Our Home)",
    type: "Supercluster Node",
    pos: [0, 0, 0],
    mass: "1.0 × 10¹⁷ M☉",
    z: "0.015",
    desc: "Our home supercluster, spanning 520 million light-years, flowing toward the Great Attractor.",
  },
  {
    id: "shapley",
    name: "Shapley Concentration",
    type: "Supercluster Basin",
    pos: [6.2, 2.8, -3.2],
    mass: "1.2 × 10¹⁸ M☉",
    z: "0.046",
    desc: "The largest gravitationally bound basin of mass in our observable neighborhood.",
  },
  {
    id: "coma",
    name: "Coma Supercluster Hub",
    type: "Historical Benchmark",
    pos: [-5.4, 4.2, 2.8],
    mass: "3.5 × 10¹⁵ M☉",
    z: "0.023",
    desc: "Where Fritz Zwicky in 1933 first inferred unseen dark matter from galaxy velocity dispersions.",
  },
  {
    id: "perseus",
    name: "Perseus-Pisces Chain",
    type: "Filamentary Ridge",
    pos: [4.5, -4.8, 4.2],
    mass: "1.5 × 10¹⁶ M☉",
    z: "0.018",
    desc: "A dense cosmic highway of galaxies stretching across 300 million light-years.",
  },
  {
    id: "hercules",
    name: "Hercules Supercluster",
    type: "Filament Intersection",
    pos: [-6.5, -3.4, -4.2],
    mass: "8.0 × 10¹⁵ M☉",
    z: "0.037",
    desc: "An interconnected network of multiple rich clusters connected by filamentary spines.",
  },
];

// Major cosmological void regions
export const VOID_REGIONS = [
  {
    id: "bootes",
    name: "Boötes Void (The Great Nothing)",
    type: "Supervoid",
    pos: [1.5, 5.2, -6.0],
    radius: 3.4,
    mass: "< 0.05 × Mean Density",
    z: "0.052",
    desc: "One of the largest known cosmic voids, spanning ~330 million light-years across. It contains barely 60 galaxies where ~2,000 should exist.",
  },
  {
    id: "local_void",
    name: "Local Void",
    type: "Adjacent Void",
    pos: [-4.2, -2.2, 4.5],
    radius: 2.6,
    mass: "Severe Under-density",
    z: "0.008",
    desc: "A vast empty region right beside the Milky Way and Local Group, exerting an apparent repulsive gravitational push on our galaxy.",
  },
  {
    id: "sculptor_void",
    name: "Sculptor Supervoid",
    type: "Cosmic Cavity",
    pos: [5.2, 2.0, 5.5],
    radius: 2.9,
    mass: "< 0.1 × Mean Density",
    z: "0.031",
    desc: "A gigantic low-density bubble bounded by the Southern Galactic Filament wall.",
  },
];

function CosmicWebRig({
  showFilaments = true,
  showGalaxies = true,
  showVoids = true,
  selectedCluster,
  setSelectedCluster,
}) {
  const groupRef = useRef();
  const time = useRef(0);

  const glowTexture = useMemo(() => getGlowTexture(), []);
  const starTexture = useMemo(() => getStarTexture(), []);

  // Compute curved filament highways connecting nodes
  const { linePositions, filamentParticles, connections, galaxyParticles } = useMemo(() => {
    const pCount = 9000;
    const pPos = new Float32Array(pCount * 3);
    const pCols = new Float32Array(pCount * 3);
    const cViolet = new THREE.Color("#9d4edd");
    const cDeepViolet = new THREE.Color("#5a189a");
    const cCyan = new THREE.Color("#00f5d4");

    const conns = [];
    for (let i = 0; i < CLUSTER_NODES.length; i++) {
      for (let j = i + 1; j < CLUSTER_NODES.length; j++) {
        const p1 = new THREE.Vector3(...CLUSTER_NODES[i].pos);
        const p2 = new THREE.Vector3(...CLUSTER_NODES[j].pos);
        if (p1.distanceTo(p2) < 14) {
          conns.push({ p1, p2 });
        }
      }
    }

    const lines = [];
    conns.forEach(({ p1, p2 }) => {
      lines.push(p1.x, p1.y, p1.z);
      lines.push(p2.x, p2.y, p2.z);
    });

    for (let i = 0; i < pCount; i++) {
      const conn = conns[i % conns.length];
      const t = Math.random();
      const basePos = conn.p1.clone().lerp(conn.p2, t);
      // Bell-shaped filament dispersion (thinner near nodes, wider in middle)
      const dispersion = (Math.sin(t * Math.PI) * 0.85 + 0.15) * 0.48;

      pPos[i * 3] = basePos.x + (Math.random() - 0.5) * dispersion;
      pPos[i * 3 + 1] = basePos.y + (Math.random() - 0.5) * dispersion;
      pPos[i * 3 + 2] = basePos.z + (Math.random() - 0.5) * dispersion;

      // Dark matter filament gradient: deep purple fading into bright violet
      const col = Math.random() < 0.25 ? cCyan : Math.random() < 0.6 ? cViolet : cDeepViolet;
      pCols[i * 3] = col.r;
      pCols[i * 3 + 1] = col.g;
      pCols[i * 3 + 2] = col.b;
    }

    // Luminous galaxies embedded inside the clusters and along the filament spine
    const gCount = 2000;
    const gPos = new Float32Array(gCount * 3);
    const gCols = new Float32Array(gCount * 3);
    const cGold = new THREE.Color("#fbbf24");
    const cWhite = new THREE.Color("#ffffff");
    const cAmber = new THREE.Color("#f59e0b");

    for (let i = 0; i < gCount; i++) {
      if (Math.random() < 0.65) {
        // Clustered tightly inside one of the supercluster nodes
        const node = CLUSTER_NODES[i % CLUSTER_NODES.length];
        const r = Math.pow(Math.random(), 2.2) * 1.6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        gPos[i * 3] = node.pos[0] + r * Math.sin(phi) * Math.cos(theta);
        gPos[i * 3 + 1] = node.pos[1] + r * Math.sin(phi) * Math.sin(theta);
        gPos[i * 3 + 2] = node.pos[2] + r * Math.cos(phi);
      } else {
        // Streaming along the filament highway
        const conn = conns[i % conns.length];
        const t = Math.random();
        const basePos = conn.p1.clone().lerp(conn.p2, t);
        const disp = (Math.sin(t * Math.PI) * 0.4 + 0.1) * 0.35;
        gPos[i * 3] = basePos.x + (Math.random() - 0.5) * disp;
        gPos[i * 3 + 1] = basePos.y + (Math.random() - 0.5) * disp;
        gPos[i * 3 + 2] = basePos.z + (Math.random() - 0.5) * disp;
      }

      const c = Math.random() < 0.5 ? cWhite : Math.random() < 0.8 ? cGold : cAmber;
      gCols[i * 3] = c.r;
      gCols[i * 3 + 1] = c.g;
      gCols[i * 3 + 2] = c.b;
    }

    return {
      linePositions: new Float32Array(lines),
      filamentParticles: { pos: pPos, cols: pCols },
      galaxyParticles: { pos: gPos, cols: gCols },
      connections: conns,
    };
  }, []);

  // 350 streaming inflow particles travelling along the filaments
  const flowCount = 350;
  const flowPositions = useMemo(() => new Float32Array(flowCount * 3), [flowCount]);
  const flowColors = useMemo(() => {
    const cols = new Float32Array(flowCount * 3);
    const cCyan = new THREE.Color("#00f5d4");
    const cGold = new THREE.Color("#fbbf24");
    const cViolet = new THREE.Color("#c77dff");
    for (let i = 0; i < flowCount; i++) {
      const c = i % 3 === 0 ? cCyan : i % 3 === 1 ? cGold : cViolet;
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return cols;
  }, [flowCount]);

  const flowRef = useRef();
  const lineMatRef = useRef();

  useFrame((state, delta) => {
    time.current += delta;
    const t = time.current;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.016;
    }

    // Filament line breathing animation
    if (lineMatRef.current) {
      lineMatRef.current.opacity = 0.22 + Math.sin(t * 1.8) * 0.08;
    }

    // Animate streaming flow particles safely
    if (
      showFilaments &&
      flowRef.current &&
      flowRef.current.geometry &&
      flowRef.current.geometry.attributes.position &&
      connections &&
      connections.length > 0
    ) {
      const pos = flowRef.current.geometry.attributes.position.array;
      for (let i = 0; i < flowCount; i++) {
        const conn = connections[i % connections.length];
        const progress = (t * 0.16 + i / flowCount) % 1.0;
        const pt = conn.p1.clone().lerp(conn.p2, progress);

        const disp = Math.sin(progress * Math.PI) * 0.22;
        pos[i * 3] = pt.x + Math.sin(t * 2.0 + i) * disp;
        pos[i * 3 + 1] = pt.y + Math.cos(t * 2.0 + i) * disp;
        pos[i * 3 + 2] = pt.z;
      }
      flowRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ============================================================== */}
      {/* 1. DARK MATTER FILAMENTS                                       */}
      {/* ============================================================== */}
      {showFilaments && (
        <group>
          {/* Connecting Backbone Filament Lines */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              ref={lineMatRef}
              color="#9d4edd"
              transparent
              opacity={0.25}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>

          {/* Diffuse Dark Matter Cloud along Filaments */}
          <points>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[filamentParticles.pos, 3]} />
              <bufferAttribute attach="attributes-color" args={[filamentParticles.cols, 3]} />
            </bufferGeometry>
            <pointsMaterial
              map={starTexture}
              size={0.36}
              vertexColors
              transparent
              opacity={0.82}
              sizeAttenuation
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>

          {/* Streaming Matter Inflow Particles */}
          <points ref={flowRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[flowPositions, 3]} />
              <bufferAttribute attach="attributes-color" args={[flowColors, 3]} />
            </bufferGeometry>
            <pointsMaterial
              map={starTexture}
              size={0.48}
              vertexColors
              transparent
              opacity={0.95}
              sizeAttenuation
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>
      )}

      {/* ============================================================== */}
      {/* 2. VISIBLE GALAXY NODES & CLUSTERS                              */}
      {/* ============================================================== */}
      {showGalaxies && (
        <group>
          {/* Luminous Embedded Galaxies Point Cloud */}
          <points>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[galaxyParticles.pos, 3]} />
              <bufferAttribute attach="attributes-color" args={[galaxyParticles.cols, 3]} />
            </bufferGeometry>
            <pointsMaterial
              map={starTexture}
              size={0.32}
              vertexColors
              transparent
              opacity={0.9}
              sizeAttenuation
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>

          {/* Supercluster Dense Nodes */}
          {CLUSTER_NODES.map((node) => {
            const isSelected = selectedCluster && selectedCluster.id === node.id;
            return (
              <group key={node.id} position={node.pos}>
                {/* Luminous Core Sphere */}
                <mesh
                  onClick={() => {
                    setSelectedCluster(isSelected ? null : node);
                    cosmicAudio.playPulse(440);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <sphereGeometry args={[0.36, 24, 24]} />
                  <meshBasicMaterial color={isSelected ? "#00f5d4" : "#fbbf24"} />
                </mesh>

                {/* Glowing Aura Sprite */}
                <sprite scale={[isSelected ? 4.5 : 3.5, isSelected ? 4.5 : 3.5, 1]}>
                  <spriteMaterial
                    map={glowTexture}
                    color={isSelected ? "#00f5d4" : "#c77dff"}
                    transparent
                    opacity={0.65}
                    blending={THREE.AdditiveBlending}
                  />
                </sprite>

                {/* Interactive 3D Label */}
                <Html distanceFactor={18} center position={[0, 0.7, 0]}>
                  <button
                    onClick={() => {
                      setSelectedCluster(isSelected ? null : node);
                      cosmicAudio.playPulse(440);
                    }}
                    className="glass-pill"
                    style={{
                      padding: "0.25rem 0.65rem",
                      fontSize: "0.68rem",
                      color: isSelected ? "#00f5d4" : "#ffffff",
                      borderColor: isSelected ? "#00f5d4" : "rgba(255, 255, 255, 0.15)",
                      background: isSelected ? "rgba(0, 245, 212, 0.25)" : "rgba(3, 5, 12, 0.8)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                    }}
                  >
                    {node.name.split(" ")[0]}
                  </button>
                </Html>
              </group>
            );
          })}
        </group>
      )}

      {/* ============================================================== */}
      {/* 3. COSMIC VOIDS (EMPTY BUBBLE VOLUMES)                          */}
      {/* ============================================================== */}
      {showVoids && (
        <group>
          {VOID_REGIONS.map((voidItem) => {
            const isSelected = selectedCluster && selectedCluster.id === voidItem.id;
            return (
              <group key={voidItem.id} position={voidItem.pos}>
                {/* Translucent Empty Void Bubble */}
                <mesh
                  onClick={() => {
                    setSelectedCluster(isSelected ? null : voidItem);
                    cosmicAudio.playPulse(220);
                  }}
                >
                  <sphereGeometry args={[voidItem.radius, 24, 24]} />
                  <meshBasicMaterial
                    color="#023e8a"
                    transparent
                    opacity={isSelected ? 0.18 : 0.08}
                    wireframe={false}
                    depthWrite={false}
                  />
                </mesh>

                {/* Boundary Equator Ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[voidItem.radius - 0.05, voidItem.radius, 48]} />
                  <meshBasicMaterial
                    color={isSelected ? "#00f5d4" : "#38bdf8"}
                    transparent
                    opacity={isSelected ? 0.6 : 0.25}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                  />
                </mesh>

                {/* 3D Void Label */}
                <Html distanceFactor={22} center position={[0, voidItem.radius + 0.5, 0]}>
                  <button
                    onClick={() => {
                      setSelectedCluster(isSelected ? null : voidItem);
                      cosmicAudio.playPulse(220);
                    }}
                    className="glass-pill"
                    style={{
                      padding: "0.22rem 0.6rem",
                      fontSize: "0.65rem",
                      color: isSelected ? "#00f5d4" : "#38bdf8",
                      borderColor: isSelected ? "#00f5d4" : "rgba(56, 189, 248, 0.3)",
                      background: isSelected ? "rgba(0, 245, 212, 0.2)" : "rgba(3, 10, 25, 0.8)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                    }}
                  >
                    🫧 {voidItem.name.split(" ")[0]} Void
                  </button>
                </Html>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}

export default function CosmicWebScene({
  showFilaments = true,
  showGalaxies = true,
  showVoids = true,
  selectedCluster,
  setSelectedCluster,
}) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 8, 18], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxDistance={34}
          minDistance={7}
          dampingFactor={0.05}
        />
        <ambientLight intensity={0.4} />
        <StarField count={2000} radius={60} />
        <CosmicWebRig
          showFilaments={showFilaments}
          showGalaxies={showGalaxies}
          showVoids={showVoids}
          selectedCluster={selectedCluster}
          setSelectedCluster={setSelectedCluster}
        />
      </Canvas>
    </div>
  );
}
