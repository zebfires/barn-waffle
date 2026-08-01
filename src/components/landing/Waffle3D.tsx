'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function WaffleModel({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {/* Base waffle grid */}
        <boxGeometry args={[2, 0.3, 2]} />
        <MeshDistortMaterial
          color="#e8b86d"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.4}
          metalness={0.1}
        />
        
        {/* Grid pattern - horizontal lines */}
        {[-0.6, -0.2, 0.2, 0.6].map((z, i) => (
          <mesh key={`h-${i}`} position={[0, 0.16, z]}>
            <boxGeometry args={[2.1, 0.08, 0.08]} />
            <meshStandardMaterial color="#c49a4a" roughness={0.5} metalness={0.2} />
          </mesh>
        ))}
        
        {/* Grid pattern - vertical lines */}
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <mesh key={`v-${i}`} position={[x, 0.16, 0]}>
            <boxGeometry args={[0.08, 0.08, 2.1]} />
            <meshStandardMaterial color="#c49a4a" roughness={0.5} metalness={0.2} />
          </mesh>
        ))}

        {/* Grid indents for depth */}
        {[-0.6, -0.2, 0.2, 0.6].map((x) =>
          [-0.6, -0.2, 0.2, 0.6].map((z, i) => (
            <mesh key={`indent-${x}-${z}`} position={[x, -0.12, z]}>
              <boxGeometry args={[0.35, 0.15, 0.35]} />
              <meshStandardMaterial color="#d4a658" roughness={0.6} />
            </mesh>
          ))
        )}
      </mesh>
    </Float>
  );
}

export default function Waffle3D() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#fff5e6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffa500" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#fff8dc"
        />
        
        {/* Multiple waffles at different positions */}
        <WaffleModel position={[-4, 2, -2]} />
        <WaffleModel position={[4, -2, -3]} />
        <WaffleModel position={[0, 0, -5]} />
      </Canvas>
    </div>
  );
}
