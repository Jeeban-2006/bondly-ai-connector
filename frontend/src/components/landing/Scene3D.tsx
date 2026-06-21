import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const GlowOrb = ({ position, color, speed, distort, size }: {
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
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.6}
          distort={distort}
          speed={speed * 2}
          roughness={0}
          metalness={1}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
};

const WobbleTorus = ({ position, color, speed, size }: {
  position: [number, number, number];
  color: string;
  speed: number;
  size: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.15;
  });

  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[size, size * 0.35, 32, 64]} />
        <MeshWobbleMaterial
          color={color}
          transparent
          opacity={0.45}
          factor={0.6}
          speed={speed}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
};

const Particles = () => {
  const points = useRef<THREE.Points>(null);
  const count = 300;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#818cf8'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#c084fc'),
      new THREE.Color('#f472b6'),
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return cols;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.03;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        transparent
        opacity={0.8}
        sizeAttenuation
        vertexColors
      />
    </points>
  );
};

const ConnectingLines = () => {
  const linesRef = useRef<THREE.Group>(null);
  const lineCount = 8;

  const curves = useMemo(() => {
    return Array.from({ length: lineCount }, () => {
      const points = [];
      const startX = (Math.random() - 0.5) * 16;
      const startY = (Math.random() - 0.5) * 12;
      for (let j = 0; j <= 20; j++) {
        points.push(
          new THREE.Vector3(
            startX + j * 0.8 - 8,
            startY + Math.sin(j * 0.5) * 2,
            (Math.random() - 0.5) * 6 - 3
          )
        );
      }
      return new THREE.CatmullRomCurve3(points);
    });
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <group ref={linesRef}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 40, 0.008, 8, false]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#818cf8' : '#c084fc'}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

const Scene3D = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" style={{ opacity: 0.85 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-4, 3, 4]} intensity={1} color="#818cf8" />
        <pointLight position={[4, -2, 3]} intensity={0.8} color="#f472b6" />
        <pointLight position={[0, 4, 2]} intensity={0.5} color="#c084fc" />

        {/* Large orbs */}
        <GlowOrb position={[-4, 2.5, -2]} color="#6366f1" speed={1.2} distort={0.5} size={1.8} />
        <GlowOrb position={[4.5, -2, -3]} color="#a78bfa" speed={0.8} distort={0.4} size={1.4} />
        <GlowOrb position={[0.5, 4, -4]} color="#f472b6" speed={1} distort={0.6} size={1.1} />
        <GlowOrb position={[-3, -3, -1.5]} color="#818cf8" speed={0.6} distort={0.35} size={0.9} />
        <GlowOrb position={[3, 2, -3]} color="#c084fc" speed={0.9} distort={0.3} size={1} />

        {/* Torus rings */}
        <WobbleTorus position={[-2, 0, -5]} color="#6366f1" speed={1.5} size={1.2} />
        <WobbleTorus position={[3, 3, -6]} color="#a78bfa" speed={1} size={0.8} />

        <Particles />
        <ConnectingLines />
      </Canvas>
    </div>
  );
};

export default Scene3D;
