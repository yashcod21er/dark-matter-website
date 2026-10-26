import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getGlowTexture } from "../utils/textureGen";

export default function DarkMatterHalo({
  visible = true,
  radius = 15,
  count = 9500,
  densityScale = 1.0,
}) {
  const pointsRef = useRef();
  const materialRef = useRef();
  const ringsGroupRef = useRef();
  const currentOpacity = useRef(visible ? 0.45 : 0);
  const time = useRef(0);

  const glowTexture = useMemo(() => getGlowTexture(), []);

  // Isothermal / Navarro-Frenk-White (NFW) Dark Matter Density Distribution
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const baseViolet = new THREE.Color("#9d4edd");
    const edgeCyan = new THREE.Color("#00f5d4");
    const deepPurple = new THREE.Color("#7b2cbf");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // NFW Profile density scaling: rho(r) ~ 1 / [ (r/rs) * (1 + r/rs)^2 ]
      const u = Math.random();
      const r = Math.pow(u, 0.48) * radius + 1.2;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // Triaxial oblateness (halos are slightly flattened ellipsoids)
      const q = 0.88; // flattening factor
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * q;
      pos[i3 + 2] = r * Math.cos(phi);

      const normR = r / radius;
      let c;
      if (normR < 0.4) {
        c = deepPurple.clone().lerp(baseViolet, normR / 0.4);
      } else {
        c = baseViolet.clone().lerp(edgeCyan, (normR - 0.4) / 0.6);
      }

      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }

    return [pos, cols];
  }, [count, radius]);

  // Equipotential gravitational curvature contour rings
  const contourRadii = useMemo(() => [4.5, 8.5, 12.5, 15.5], []);

  useFrame((state, delta) => {
    time.current += delta;
    if (!materialRef.current || !pointsRef.current) return;

    // Smooth opacity fade
    const targetOpacity = visible ? 0.42 * densityScale : 0;
    currentOpacity.current = THREE.MathUtils.lerp(
      currentOpacity.current,
      targetOpacity,
      delta * 4.0
    );
    materialRef.current.opacity = currentOpacity.current;

    // Ethereal slow counter-rotation & subtle cosmic pulsation
    pointsRef.current.rotation.y -= delta * 0.014;
    pointsRef.current.rotation.x += delta * 0.005;

    const s = 1.0 + Math.sin(time.current * 0.75) * 0.035;
    pointsRef.current.scale.set(s, s, s);

    if (ringsGroupRef.current) {
      ringsGroupRef.current.rotation.y += delta * 0.012;
      ringsGroupRef.current.rotation.z += delta * 0.006;
      ringsGroupRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Volumetric Dark Matter Cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          map={glowTexture}
          size={1.3}
          vertexColors
          transparent
          opacity={0.42}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Gravitational Equipotential Orbit Lines */}
      {visible && (
        <group ref={ringsGroupRef}>
          {contourRadii.map((r, idx) => (
            <mesh key={idx} rotation={[Math.PI / 2.3 + idx * 0.1, idx * 0.2, 0]}>
              <ringGeometry args={[r - 0.04, r + 0.04, 64]} />
              <meshBasicMaterial
                color={idx % 2 === 0 ? "#c77dff" : "#00f5d4"}
                transparent
                opacity={0.15 - idx * 0.025}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
