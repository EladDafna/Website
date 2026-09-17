"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Float,
  MeshDistortMaterial,
  PerformanceMonitor,
  PointMaterial,
  Points,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
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

type FieldProps = {
  count: number;
  /** Inner and outer radius of the spherical shell the points sit in. */
  inner: number;
  outer: number;
  /** World units when `attenuate` is on, screen pixels when it is off. */
  size: number;
  /**
   * Whether points shrink with distance. Off gives every point the same pixel
   * size, which is what a star field wants and which removes any chance of a
   * near point being drawn as a huge disc.
   */
  attenuate: boolean;
  color: string;
  opacity: number;
  seed: number;
  spin: number;
  animate: boolean;
};

/**
 * A shell of points around the camera.
 *
 * This replaces drei's <Stars>, whose vertex shader sizes each sprite by
 * `30.0 / -mvPosition.z`. Stars at a grazing view angle have a view-space z
 * near zero, so that term explodes and the sprite is drawn as a huge grey
 * disc over the page. Sizing through PointMaterial avoids the blow-up.
 */
function ParticleField({
  count,
  inner,
  outer,
  size,
  attenuate,
  color,
  opacity,
  seed,
  spin,
  animate,
}: FieldProps) {
  const ref = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const random = makeRandom(seed);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // Even distribution across a spherical shell around the camera.
      const radius = inner + random() * (outer - inner);
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, [count, inner, outer, seed]);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points || !animate) return;
    points.rotation.y += delta * spin;
    points.rotation.x += delta * spin * 0.4;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={attenuate}
        depthWrite={false}
        blending={AdditiveBlending}
        opacity={opacity}
      />
    </Points>
  );
}

/**
 * The neon centrepiece: a soft distorting inner mass wrapped in two wireframe
 * shells. It is parked to the right of centre so it never sits behind the
 * headline, and pushed back in z so the copy always reads in front of it.
 */
function Core({ animate }: { animate: boolean }) {
  const ref = useRef<Group>(null);
  const { viewport } = useThree();

  // Wide screens have room beside the text column. Narrow ones do not, so the
  // shape drops below the hero copy instead of sitting behind it.
  const wide = viewport.width > 9;
  const position: [number, number, number] = wide
    ? [viewport.width * 0.26, 0.2, -1.4]
    : [0, -3.4, -2.6];
  const scale = wide ? 1 : 0.8;

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group || !animate) return;
    group.rotation.y += delta * 0.1;
    group.rotation.x += delta * 0.04;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.015;
    group.scale.setScalar(pulse * scale);
  });

  return (
    <Float
      speed={animate ? 1.1 : 0}
      rotationIntensity={animate ? 0.25 : 0}
      floatIntensity={animate ? 0.7 : 0}
      floatingRange={[-0.25, 0.25]}
    >
      <group ref={ref} position={position} scale={scale}>
        {/*
          Each shell uses `emissive` rather than plain `color`. The bloom pass
          reads scene luminance before tone mapping, and an emissive channel is
          the standard way to push a material's output past 1.0 there without
          it looking blown out or losing the wireframe's hue.
        */}
        <mesh>
          <icosahedronGeometry args={[2.4, 1]} />
          <meshStandardMaterial
            wireframe
            transparent
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={1.6}
            opacity={0.3}
          />
        </mesh>
        <mesh scale={0.78}>
          <icosahedronGeometry args={[2.4, 0]} />
          <meshStandardMaterial
            wireframe
            transparent
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={1.6}
            opacity={0.24}
          />
        </mesh>
        {/*
          Kept as a wireframe rather than a solid. A filled mesh here read as an
          opaque grey mass that sat on top of the headline and killed contrast.
        */}
        <mesh scale={0.52}>
          <icosahedronGeometry args={[2.4, 5]} />
          <MeshDistortMaterial
            wireframe
            color="#f472b6"
            emissive="#f472b6"
            emissiveIntensity={1.6}
            transparent
            opacity={0.3}
            distort={animate ? 0.4 : 0}
            speed={animate ? 1.6 : 0}
          />
        </mesh>
        {/* The energy core: small, solid, and the brightest thing in the scene. */}
        <mesh scale={0.16}>
          <icosahedronGeometry args={[2.4, 2]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#67e8f9"
            emissiveIntensity={3.5}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
}

/**
 * Ties the scene to the page scroll so the whole background has real depth:
 * the camera dollies in slightly and the scene rolls as you move down.
 */
function ScrollRig({ enabled }: { enabled: boolean }) {
  const progress = useRef(0);

  // The camera is read off the frame state rather than from useThree(), so the
  // per-frame mutation happens on a value this component does not own.
  useFrame((state, delta) => {
    if (!enabled) return;
    const doc = document.documentElement;
    const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const target = MathUtils.clamp(window.scrollY / scrollable, 0, 1);
    progress.current = MathUtils.damp(progress.current, target, 3, delta);

    const { camera } = state;
    camera.position.z = 9 - progress.current * 2.4;
    camera.position.y = progress.current * 1.1;
    camera.rotation.z = progress.current * 0.12;
    camera.lookAt(0, progress.current * 0.4, 0);
  });

  return null;
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
  const [dpr, setDpr] = useState(1.5);
  // Bloom is a real-time full-screen pass, the single most expensive thing in
  // this scene. Dropped first (before resolution) on a declining GPU.
  const [highQuality, setHighQuality] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const animate = !reducedMotion;

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 60 }}
      dpr={dpr}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      frameloop={animate ? "always" : "demand"}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Drop bloom, then resolution, rather than frames if the GPU struggles. */}
      <PerformanceMonitor
        onDecline={() => {
          setHighQuality(false);
          setDpr(1);
        }}
        onIncline={() => {
          setHighQuality(true);
          setDpr(1.75);
        }}
      />
      <AdaptiveDpr pixelated />

      <ambientLight intensity={0.6} />
      <pointLight position={[6, 4, 6]} intensity={40} color="#22d3ee" />
      <pointLight position={[-6, -3, 4]} intensity={30} color="#f472b6" />

      <ScrollRig enabled={animate} />

      <Parallax enabled={animate}>
        {/* Far, dense, near-white: reads as the star field. Fixed pixel size. */}
        <ParticleField
          count={3600}
          inner={30}
          outer={95}
          size={1.8}
          attenuate={false}
          color="#dce7ff"
          opacity={0.9}
          seed={0x5741225}
          spin={0.004}
          animate={animate}
        />
        {/*
          Near, sparse, blue: gives the field real parallax depth. The inner
          radius stays well outside the camera's own orbit (z 6.6 to 9.1) so no
          particle can end up a fraction of a unit from the lens.
        */}
        <ParticleField
          count={900}
          inner={17}
          outer={34}
          size={0.05}
          attenuate
          color="#8fb6ff"
          opacity={0.7}
          seed={0x5eed1e}
          spin={0.018}
          animate={animate}
        />
        <Core animate={animate} />
      </Parallax>

      {highQuality && (
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.15}
            luminanceSmoothing={0.3}
            intensity={0.9}
            radius={0.55}
          />
          <Vignette eskil={false} offset={0.15} darkness={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
