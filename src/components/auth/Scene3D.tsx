'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useTheme } from 'next-themes';
import * as THREE from 'three';

/* ---------- Read a CSS variable as a hex color ---------- */
function getCSSColor(variable: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  if (!raw) return fallback;
  // CSS vars are oklch strings — create a temporary element to resolve
  const el = document.createElement('div');
  el.style.color = raw;
  document.body.appendChild(el);
  const resolved = getComputedStyle(el).color;
  document.body.removeChild(el);
  return resolved || fallback;
}

function useThemeColors() {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState({
    primary: '#c4875a',
    secondary: '#a06840',
    accent: '#7a5230',
    particle: '#d4a870',
  });

  useEffect(() => {
    const isDark = resolvedTheme === 'dark';
    setColors(isDark ? {
      primary: getCSSColor('--primary', '#c9975f'),
      secondary: getCSSColor('--chart-2', '#a8836a'),
      accent: getCSSColor('--chart-4', '#8a6245'),
      particle: getCSSColor('--primary', '#c9975f'),
    } : {
      primary: getCSSColor('--primary', '#7a4f2a'),
      secondary: getCSSColor('--chart-4', '#5a3518'),
      accent: getCSSColor('--chart-1', '#8a5f30'),
      particle: getCSSColor('--primary', '#7a4f2a'),
    });
  }, [resolvedTheme]);

  return colors;
}

/* ---------- Floating torus knot ---------- */
function TorusKnot({ position, scale, speed, phase, color }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    mesh.current.rotation.x = t * 0.4;
    mesh.current.rotation.y = t * 0.6;
    mesh.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <torusKnotGeometry args={[1, 0.32, 128, 16]} />
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.6} />
    </mesh>
  );
}

/* ---------- Floating icosahedron ---------- */
function Ico({ position, scale, speed, phase, color }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    mesh.current.rotation.x = t * 0.3;
    mesh.current.rotation.z = t * 0.5;
    mesh.current.position.y = position[1] + Math.sin(t * 0.7 + 1) * 0.25;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} wireframe />
    </mesh>
  );
}

/* ---------- Particle field ---------- */
function Particles({ count = 180, color }: { count?: number; color: string }) {
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.025;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color={color} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ---------- Camera rig that follows mouse ---------- */
function CameraRig({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  useFrame(() => {
    if (!mouse.current) return;
    camera.position.x += (mouse.current.x * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.current.y * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ---------- Scene contents ---------- */
function SceneContents({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const mouse = useMousePosition();

  return (
    <>
      <CameraRig mouse={mouse} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.0} />
      <pointLight position={[-6, -4, 2]} intensity={0.7} color={colors.primary} />
      <pointLight position={[6, 4, -2]} intensity={0.5} color={colors.secondary} />

      <Particles count={180} color={colors.particle} />

      <TorusKnot position={[-4.5, 0.5, -2]}  scale={0.7}  speed={0.35} phase={0}   color={colors.primary} />
      <TorusKnot position={[4.8, -0.8, -3]}  scale={0.5}  speed={0.28} phase={2.1} color={colors.secondary} />
      <TorusKnot position={[1.2, 2.5, -4]}   scale={0.35} speed={0.45} phase={4.2} color={colors.accent} />

      <Ico position={[3.5, 1.5, -1.5]}  scale={0.9}  speed={0.3}  phase={1}   color={colors.secondary} />
      <Ico position={[-3, -2, -2]}       scale={0.55} speed={0.4}  phase={3.1} color={colors.primary} />
      <Ico position={[-1, -2.8, -3.5]}  scale={0.4}  speed={0.5}  phase={5.2} color={colors.accent} />
    </>
  );
}

/* ---------- Export ---------- */
export default function Scene3D() {
  const colors = useThemeColors();

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <SceneContents colors={colors} />
      </Canvas>
    </div>
  );
}
