"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Points, Stars } from "@react-three/drei";
import {
  AdditiveBlending,
  Group,
  MathUtils,
  Points as ThreePoints,
} from "three";

/**
 * Small deterministic PRNG (mulberry32). A fixed seed keeps the dust field
 * identical on every render and between server and client, and keeps the
 * position maths pure.
 */
function makeRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Drifting coloured dust, closer to the camera than the star field. */
function Dust({ count = 1400 }: { count?: number }) {
  const ref = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const random = makeRandom(0x5eed1e);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // Even distribution across a spherical shell around the camera.
      const radius = 7 + random() * 17;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points) return;
    points.rotation.y += delta * 0.018;
    points.rotation.x += delta * 0.007;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8fb6ff"
        size={0.055}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
        opacity={0.75}
      />
    </Points>
  );
}

/** Nested wireframe icosahedra that read as a slowly turning neon core. */
function Core() {
  const ref = useRef<Group>(null);

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;
    group.rotation.y += delta * 0.1;
    group.rotation.x += delta * 0.04;
    // Breathe very slightly so the shape never looks frozen.
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.015;
    group.scale.setScalar(pulse);
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[2.4, 1]} />
        <meshBasicMaterial wireframe transparent color="#22d3ee" opacity={0.26} />
      </mesh>
      <mesh scale={0.78}>
        <icosahedronGeometry args={[2.4, 0]} />
        <meshBasicMaterial wireframe transparent color="#a855f7" opacity={0.2} />
      </mesh>
      <mesh scale={0.5}>
        <icosahedronGeometry args={[2.4, 0]} />
        <meshBasicMaterial wireframe transparent color="#f472b6" opacity={0.12} />
      </mesh>
    </group>
  );
}

/** Tilts the whole scene a few degrees toward the pointer. */
function Parallax({
  children,
  enabled,
}: {
  children: React.ReactNode;
  enabled: boolean;
}) {
  const ref = useRef<Group>(null);

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group || !enabled) return;
    const targetX = state.pointer.y * 0.1;
    const targetY = state.pointer.x * 0.16;
    group.rotation.x = MathUtils.damp(group.rotation.x, targetX, 3, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, targetY, 3, delta);
  });

  return <group ref={ref}>{children}</group>;
}

export default function SpaceScene() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 60 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
      style={{ width: "100%", height: "100%" }}
    >
      <Parallax enabled={!reducedMotion}>
        <Stars
          radius={80}
          depth={45}
          count={4200}
          factor={3.4}
          saturation={0}
          fade
          speed={reducedMotion ? 0 : 0.4}
        />
        <Dust />
        <Core />
      </Parallax>
    </Canvas>
  );
}
