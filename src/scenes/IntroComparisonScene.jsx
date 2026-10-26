import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import StarField from "./StarField";
import { getGlowTexture, getStarTexture } from "../utils/textureGen";

function ComparisonRig({ activeRegion }) {
  const groupRef = useRef();
  const time = useRef(0);

  const glowTexture = useMemo(() => getGlowTexture(), []);
  const starTexture = useMemo(() => getStarTexture(), []);

  // 1. Procedural visible galaxy disk stars (Baryonic matter - ~15% mass)
  const diskParticles = useMemo(() => {
    const count = 4200;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const baseCol = new THREE.Color("#00f5d4");
    const coreCol = new THREE.Color("#ffe066");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2.5) * 4.4 + 0.1;
      const theta = Math.random() * Math.PI * 2;
      pos[i3] = Math.cos(theta) * r;
      pos[i3 + 1] = (Math.random() - 0.5) * (0.3 / (r + 0.5));
      pos[i3 + 2] = Math.sin(theta) * r;

      const c = r < 1.1 ? coreCol : baseCol;
      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }
    return { pos, cols };
  }, []);

  // 2. Colossal Dark Matter Halo (Extends 5x to 10x beyond visible disk - ~85% mass)
  const haloParticles = useMemo(() => {
    const count = 6800;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const haloCol = new THREE.Color("#9d4edd");
    const cyanCol = new THREE.Color("#38bdf8");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const u = Math.random();
      const r = Math.pow(u, 0.42) * 12.5 + 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.85;
      pos[i3 + 2] = r * Math.cos(phi);

      const norm = r / 13.7;
      const c = haloCol.clone().lerp(cyanCol, norm * 0.4);
      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }
    return { pos, cols };
  }, []);

  // 3. Spacetime Curvature Grid (General Relativity Potential Well)
  const gridGeom = useMemo(() => {
    const geom = new THREE.PlaneGeometry(26, 26, 44, 44);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const r = Math.sqrt(x * x + y * y);
      const depth = -4.5 / (1.0 + r * 0.55);
      pos.setZ(i, depth);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame((state, delta) => {
    time.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.035;
    }
  });

  const showHalo = activeRegion === "halo" || activeRegion === "gravity";
  const showGravity = activeRegion === "gravity";

  return (
    <group ref={groupRef} rotation={[Math.PI / 4.5, 0, 0]}>
      {/* Visible Galaxy Disk */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[diskParticles.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[diskParticles.cols, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={0.35}
          vertexColors
          transparent
          opacity={0.92}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Core Bulge Glow */}
      <sprite scale={[3.0, 3.0, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#ffe8a3"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* Dark Matter Halo Envelope */}
      {showHalo && (
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[haloParticles.pos, 3]} />
            <bufferAttribute attach="attributes-color" args={[haloParticles.cols, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={glowTexture}
            size={1.1}
            vertexColors
            transparent
            opacity={0.45}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Spacetime Curvature Funnel Mesh */}
      {showGravity && (
        <mesh geometry={gridGeom} rotation={[Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
          <meshBasicMaterial
            color="#38bdf8"
            wireframe
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

export default function IntroComparisonScene({ activeRegion = "visible" }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 8, 16], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxDistance={28}
          minDistance={6}
          dampingFactor={0.05}
        />
        <ambientLight intensity={0.4} />
        <StarField count={1200} radius={50} />
        <ComparisonRig activeRegion={activeRegion} />
      </Canvas>
    </div>
  );
}
