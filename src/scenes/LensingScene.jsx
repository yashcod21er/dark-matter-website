import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import StarField from "./StarField";
import { getGlowTexture, getStarTexture } from "../utils/textureGen";

function LensingRig({ showMassDistribution }) {
  const time = useRef(0);
  const currentDeflection = useRef(showMassDistribution ? 2.85 : 1.15);
  const currentDepth = useRef(showMassDistribution ? 3.4 : 0.9);
  const currentHaloOpacity = useRef(showMassDistribution ? 0.45 : 0);
  const currentRingOpacity = useRef(showMassDistribution ? 0.85 : 0);

  const glowTexture = useMemo(() => getGlowTexture(), []);
  const starTexture = useMemo(() => getStarTexture(), []);

  // Ray parameters: 16 geodesic trajectories
  const rayCount = 16;
  const samplesPerRay = 36;
  const totalRayVertices = rayCount * samplesPerRay;

  // Reusable Float32Array for ray line positions
  const rayPositions = useMemo(() => new Float32Array(totalRayVertices * 3), [totalRayVertices]);
  const rayColors = useMemo(() => {
    const cols = new Float32Array(totalRayVertices * 3);
    const cCyan = new THREE.Color("#00f5d4");
    const cViolet = new THREE.Color("#9d4edd");
    const cSilver = new THREE.Color("#cbd5e1");

    for (let r = 0; r < rayCount; r++) {
      for (let s = 0; s < samplesPerRay; s++) {
        const idx = (r * samplesPerRay + s) * 3;
        const t = s / (samplesPerRay - 1);
        // Center of path (near lens z=0) has higher cyan/violet intensity
        const lensDist = Math.abs(t - 0.5) * 2.0; // 0 at lens, 1 at ends
        const c = cCyan.clone().lerp(cViolet, 1 - lensDist).lerp(cSilver, lensDist * 0.6);
        cols[idx] = c.r;
        cols[idx + 1] = c.g;
        cols[idx + 2] = c.b;
      }
    }
    return cols;
  }, [rayCount, samplesPerRay]);

  // Ray line segments indices
  const rayIndices = useMemo(() => {
    const indices = [];
    for (let r = 0; r < rayCount; r++) {
      const offset = r * samplesPerRay;
      for (let s = 0; s < samplesPerRay - 1; s++) {
        indices.push(offset + s, offset + s + 1);
      }
    }
    return new Uint16Array(indices);
  }, [rayCount, samplesPerRay]);

  const raysGeomRef = useRef();
  const spacetimeGridRef = useRef();
  const photonsRef = useRef();
  const haloRef = useRef();
  const ringRef = useRef();
  const ringOuterRef = useRef();
  const arcMiragesRef = useRef();

  // Dense spacetime grid (48x48)
  const gridGeom = useMemo(() => {
    return new THREE.PlaneGeometry(15, 15, 46, 46);
  }, []);

  // 140 Photons streaming along the curved geodetic rays
  const photonCount = 144;
  const photonPositions = useMemo(() => new Float32Array(photonCount * 3), [photonCount]);
  const photonColors = useMemo(() => {
    const cols = new Float32Array(photonCount * 3);
    const cWhite = new THREE.Color("#ffffff");
    const cCyan = new THREE.Color("#00f5d4");
    for (let i = 0; i < photonCount; i++) {
      const c = Math.random() < 0.6 ? cCyan : cWhite;
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return cols;
  }, [photonCount]);

  // Bezier calculation helper
  const startZ = -8.5;
  const endZ = 8.0;

  useFrame((state, delta) => {
    time.current += delta;
    const targetDeflection = showMassDistribution ? 2.85 : 1.15;
    const targetDepth = showMassDistribution ? 3.4 : 0.9;
    const targetHaloOp = showMassDistribution ? 0.45 : 0;
    const targetRingOp = showMassDistribution ? 0.85 : 0;

    // Smooth spring-like lerping
    const lerpRate = Math.min(delta * 4.0, 1.0);
    currentDeflection.current = THREE.MathUtils.lerp(currentDeflection.current, targetDeflection, lerpRate);
    currentDepth.current = THREE.MathUtils.lerp(currentDepth.current, targetDepth, lerpRate);
    currentHaloOpacity.current = THREE.MathUtils.lerp(currentHaloOpacity.current, targetHaloOp, lerpRate);
    currentRingOpacity.current = THREE.MathUtils.lerp(currentRingOpacity.current, targetRingOp, lerpRate);

    const def = currentDeflection.current;

    // 1. Update Spacetime Potential Well Grid Vertices & Waves
    if (spacetimeGridRef.current) {
      const pos = spacetimeGridRef.current.geometry.attributes.position;
      const depth = currentDepth.current;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const r = Math.sqrt(x * x + y * y);
        // Deep gravitational funnel + subtle cosmic ripple wave
        const ripple = Math.sin(time.current * 2.2 - r * 0.8) * 0.05 * (depth / 3.4);
        const zDepth = -depth / (1.0 + r * 0.65) + ripple;
        pos.setZ(i, zDepth);
      }
      pos.needsUpdate = true;
    }

    // 2. Dynamically Morph Ray Geodetic Curves
    if (raysGeomRef.current) {
      const pos = raysGeomRef.current.attributes.position.array;
      for (let r = 0; r < rayCount; r++) {
        const angle = (r * Math.PI * 2) / rayCount;
        const radius = def * (0.88 + (r % 3) * 0.18);
        const midX = Math.cos(angle) * radius;
        const midY = Math.sin(angle) * radius;

        for (let s = 0; s < samplesPerRay; s++) {
          const t = s / (samplesPerRay - 1);
          // Quadratic Bezier interpolation: P(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
          const oneMinusT = 1.0 - t;
          const b0 = oneMinusT * oneMinusT;
          const b1 = 2.0 * oneMinusT * t;
          const b2 = t * t;

          const px = b1 * midX;
          const py = b1 * midY;
          const pz = b0 * startZ + b1 * 0.0 + b2 * endZ;

          const idx = (r * samplesPerRay + s) * 3;
          pos[idx] = px;
          pos[idx + 1] = py;
          pos[idx + 2] = pz;
        }
      }
      raysGeomRef.current.attributes.position.needsUpdate = true;
    }

    // 3. High-Speed Luminous Photons Streaming along Rays
    if (photonsRef.current) {
      const pos = photonsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < photonCount; i++) {
        const rayIdx = i % rayCount;
        const angle = (rayIdx * Math.PI * 2) / rayCount;
        const radius = def * (0.88 + (rayIdx % 3) * 0.18);
        const midX = Math.cos(angle) * radius;
        const midY = Math.sin(angle) * radius;

        // Progress along the path
        const speed = 0.55;
        const t = (time.current * speed + i / photonCount) % 1.0;
        const oneMinusT = 1.0 - t;
        const b0 = oneMinusT * oneMinusT;
        const b1 = 2.0 * oneMinusT * t;
        const b2 = t * t;

        pos[i * 3] = b1 * midX;
        pos[i * 3 + 1] = b1 * midY;
        pos[i * 3 + 2] = b0 * startZ + b1 * 0.0 + b2 * endZ;
      }
      photonsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Update Halo and Einstein Ring Shimmer
    if (haloRef.current) {
      haloRef.current.material.opacity = currentHaloOpacity.current;
      // Gentle cosmic pulsation
      const s = 11.5 + Math.sin(time.current * 1.4) * 0.35;
      haloRef.current.scale.set(s, s, 1);
    }

    if (ringRef.current) {
      ringRef.current.material.opacity = currentRingOpacity.current * 0.85;
      ringRef.current.rotation.z += delta * 0.2;
    }

    if (ringOuterRef.current) {
      ringOuterRef.current.material.opacity = currentRingOpacity.current * 0.5;
      ringOuterRef.current.rotation.z -= delta * 0.15;
    }

    // 5. Mirage Gravitational Arcs (Einstein Cross / Arcs)
    if (arcMiragesRef.current) {
      arcMiragesRef.current.children.forEach((arc, idx) => {
        arc.material.opacity = currentRingOpacity.current * 0.9;
        const pulse = 1.0 + Math.sin(time.current * 3.0 + idx * 1.5) * 0.06;
        arc.scale.set(pulse, pulse, pulse);
      });
    }
  });

  return (
    <group>
      {/* Background Source Galaxy at z = -8.5 */}
      <group position={[0, 0, startZ]}>
        <mesh>
          <sphereGeometry args={[0.48, 24, 24]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <sprite scale={[3.6, 3.6, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#00f5d4"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      {/* Foreground Lensing Mass Cluster at z = 0 */}
      <group position={[0, 0, 0]}>
        {/* Core Galaxy Cluster Stars */}
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
        </mesh>
        <sprite scale={[4.4, 4.4, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#fbbf24"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </sprite>

        {/* Vast Invisible Dark Matter Halo (5x mass of cluster) */}
        <sprite ref={haloRef} scale={[11.5, 11.5, 1]}>
          <spriteMaterial
            map={glowTexture}
            color="#9d4edd"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>

        {/* Einstein Ring Critical Curves */}
        <mesh ref={ringRef} rotation={[0, 0, 0]}>
          <ringGeometry args={[2.72, 2.82, 80]} />
          <meshBasicMaterial
            color="#00f5d4"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={ringOuterRef} rotation={[0, 0, 0]}>
          <ringGeometry args={[3.2, 3.28, 80]} />
          <meshBasicMaterial
            color="#c77dff"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Lensed Mirage Arcs (Gravitational Arclets) */}
        <group ref={arcMiragesRef}>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => {
            const rx = Math.cos(ang) * 2.76;
            const ry = Math.sin(ang) * 2.76;
            return (
              <mesh key={i} position={[rx, ry, 0.05]} rotation={[0, 0, ang + Math.PI / 2]}>
                <ringGeometry args={[0.3, 0.45, 32, 1, 0, Math.PI * 0.7]} />
                <meshBasicMaterial
                  color="#38bdf8"
                  transparent
                  opacity={0}
                  side={THREE.DoubleSide}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* Curved Spacetime Coordinate Mesh */}
      <mesh
        ref={spacetimeGridRef}
        geometry={gridGeom}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -2.8, 0]}
      >
        <meshBasicMaterial
          color={showMassDistribution ? "#7b2cbf" : "#334155"}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Bent Light Beams (Continuous Morphing Lines) */}
      <lineSegments>
        <bufferGeometry ref={raysGeomRef}>
          <bufferAttribute attach="attributes-position" args={[rayPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[rayColors, 3]} />
          <bufferAttribute attach="index" args={[rayIndices, 1]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={showMassDistribution ? 0.7 : 0.35}
          linewidth={2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* High-Speed Photon Stream Particles */}
      <points ref={photonsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[photonPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[photonColors, 3]} />
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
  );
}

export default function LensingScene({ showMassDistribution = true }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [8, 5, 12], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxDistance={26}
          minDistance={6}
          maxPolarAngle={Math.PI / 1.7}
        />
        <ambientLight intensity={0.4} />
        <StarField count={1000} radius={45} />
        <LensingRig showMassDistribution={showMassDistribution} />
      </Canvas>

      <div
        className="glass-pill"
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          padding: "0.35rem 0.85rem",
          fontSize: "0.72rem",
          fontFamily: "var(--font-mono, monospace)",
          color: showMassDistribution ? "#00f5d4" : "#94a3b8",
          border: `1px solid ${showMassDistribution ? "rgba(0, 245, 212, 0.4)" : "rgba(255, 255, 255, 0.15)"}`,
          background: "rgba(3, 5, 12, 0.75)",
          transition: "all 0.3s ease",
        }}
      >
        GRAVITATIONAL LENS: {showMassDistribution ? "STRONG LENSING (EINSTEIN RINGS FORMED)" : "WEAK NEWTONIAN LENSING (MINIMAL DEFLECTION)"}
      </div>
    </div>
  );
}

