import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingOrb = ({ position, color, speed, distort, size }: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  size: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.35}
          distort={distort}
          speed={speed * 2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

const Particles = () => {
  const points = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.02;
    points.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#818cf8"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const Scene3D = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <pointLight position={[-3, 2, 4]} intensity={0.5} color="#818cf8" />
        <pointLight position={[3, -2, 2]} intensity={0.3} color="#f472b6" />

        <FloatingOrb position={[-3.5, 2, -2]} color="#6366f1" speed={1.2} distort={0.4} size={1.2} />
        <FloatingOrb position={[3.5, -1.5, -3]} color="#a78bfa" speed={0.8} distort={0.3} size={0.9} />
        <FloatingOrb position={[0, 3, -4]} color="#f472b6" speed={1} distort={0.5} size={0.7} />
        <FloatingOrb position={[-2, -2.5, -1]} color="#818cf8" speed={0.6} distort={0.35} size={0.5} />
        <FloatingOrb position={[2.5, 1.5, -2.5]} color="#c084fc" speed={0.9} distort={0.25} size={0.6} />

        <Particles />
      </Canvas>
    </div>
  );
};

export default Scene3D;
