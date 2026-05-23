'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMousePosition } from '@/hooks/useMousePosition';
import * as THREE from 'three';

/* ---------- Floating torus knot ---------- */
function TorusKnot({ position, scale, speed, phase }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
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
      <meshStandardMaterial
        color={new THREE.Color('oklch(0.75 0.14 52)')}
        roughness={0.25}
        metalness={0.6}
        wireframe={false}
      />
    </mesh>
  );
}

/* ---------- Floating icosahedron ---------- */
function Ico({ position, scale, speed, phase }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
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
      <meshStandardMaterial
        color={new THREE.Color('oklch(0.68 0.11 66)')}
        roughness={0.1}
        metalness={0.8}
        wireframe
      />
    </mesh>
  );
}

/* ---------- Particle field ---------- */
function Particles({ count = 160 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const { positions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
    }
    return { positions };
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
      <pointsMaterial
        size={0.06}
        color={new THREE.Color('oklch(0.75 0.12 56)')}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
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
function SceneContents() {
  const mouse = useMousePosition();

  return (
    <>
      <CameraRig mouse={mouse} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="oklch(0.9 0.05 75)" />
      <pointLight position={[-6, -4, 2]} intensity={0.8} color="oklch(0.75 0.14 52)" />
      <pointLight position={[6, 4, -2]} intensity={0.5} color="oklch(0.68 0.11 66)" />

      <Particles count={180} />

      <TorusKnot position={[-4.5, 0.5, -2]} scale={0.7} speed={0.35} phase={0} />
      <TorusKnot position={[4.8, -0.8, -3]} scale={0.5} speed={0.28} phase={2.1} />
      <TorusKnot position={[1.2, 2.5, -4]} scale={0.35} speed={0.45} phase={4.2} />

      <Ico position={[3.5, 1.5, -1.5]} scale={0.9} speed={0.3} phase={1} />
      <Ico position={[-3, -2, -2]} scale={0.55} speed={0.4} phase={3.1} />
      <Ico position={[-1, -2.8, -3.5]} scale={0.4} speed={0.5} phase={5.2} />
    </>
  );
}

/* ---------- Export ---------- */
export default function Scene3D() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}
