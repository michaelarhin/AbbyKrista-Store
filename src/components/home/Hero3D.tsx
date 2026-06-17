import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron, Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingOrb({ position, color, scale = 1, speed = 1 }: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * speed * 0.3) * 0.3;
    meshRef.current.rotation.y = clock.elapsedTime * speed * 0.2;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.4} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
}

function FloatingTorus({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.elapsedTime * 0.3;
    ref.current.rotation.y = clock.elapsedTime * 0.2;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <Float speed={1.5} floatIntensity={1}>
      <Torus ref={ref} args={[1, 0.3, 32, 64]} position={position}>
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.5}
          wireframe
        />
      </Torus>
    </Float>
  );
}

function FloatingIco({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.elapsedTime * 0.15;
    ref.current.rotation.y = clock.elapsedTime * 0.25;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <Icosahedron ref={ref} args={[1, 0]} position={position}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.1}
          roughness={0.2}
          metalness={1}
          transparent
          opacity={0.15}
          wireframe
        />
      </Icosahedron>
    </Float>
  );
}

function CameraRig({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  useFrame(({ camera }) => {
    camera.position.x += (mouse.current[0] * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current[1] * 1.0 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Hero3D() {
  const mouse = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth - 0.5) * 2,
        (e.clientY / window.innerHeight - 0.5) * 2,
      ];
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#22c55e" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#ffffff" />
        <spotLight position={[0, 10, 5]} intensity={1} angle={0.3} color="#3d9140" />

        <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />

        <FloatingOrb position={[-3.5, 1.5, -2]} color="#22c55e" scale={1.4} speed={0.7} />
        <FloatingOrb position={[3.5, -1.5, -3]} color="#3d9140" scale={1.0} speed={0.9} />
        <FloatingOrb position={[0, 3, -4]} color="#ffffff" scale={0.6} speed={1.2} />
        <FloatingOrb position={[-1, -2.5, -1]} color="#4ade80" scale={0.5} speed={1.5} />

        <FloatingTorus position={[3, 2, -3]} />
        <FloatingTorus position={[-2.5, -1, -2]} />

        <FloatingIco position={[1.5, -1, 1]} />
        <FloatingIco position={[-4, 2, -5]} />

        <CameraRig mouse={mouse} />
      </Canvas>
    </div>
  );
}
