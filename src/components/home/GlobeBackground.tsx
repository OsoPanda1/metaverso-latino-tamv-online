import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line, Text, Float } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";

function MatrixText() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.6}
          color="#00e5ff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          TAMV ONLINE
        </Text>
      </Float>
    </group>
  );
}

function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const gridLines = useMemo(() => {
    const lines = [];
    // Latitude lines
    for (let i = -80; i <= 80; i += 20) {
      const points = [];
      const rad = Math.cos((i * Math.PI) / 180) * 1.5;
      const y = Math.sin((i * Math.PI) / 180) * 1.5;
      for (let j = 0; j <= 360; j += 5) {
        const x = Math.cos((j * Math.PI) / 180) * rad;
        const z = Math.sin((j * Math.PI) / 180) * rad;
        points.push(new THREE.Vector3(x, y, z));
      }
      lines.push(points);
    }
    // Longitude lines
    for (let i = 0; i < 360; i += 30) {
      const points = [];
      for (let j = -90; j <= 90; j += 5) {
        const rad = Math.cos((j * Math.PI) / 180) * 1.5;
        const y = Math.sin((j * Math.PI) / 180) * 1.5;
        const x = Math.cos((i * Math.PI) / 180) * rad;
        const z = Math.sin((i * Math.PI) / 180) * rad;
        points.push(new THREE.Vector3(x, y, z));
      }
      lines.push(points);
    }
    return lines;
  }, []);

  return (
    <group>
      <Sphere ref={globeRef} args={[1.48, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#0a1628"
          transparent
          opacity={0.3}
          wireframe={false}
        />
      </Sphere>
      
      <group ref={linesRef}>
        {gridLines.map((points, i) => (
          <Line
            key={i}
            points={points}
            color="#00e5ff"
            lineWidth={0.5}
            transparent
            opacity={0.4}
          />
        ))}
      </group>
    </group>
  );
}

function FloatingOrbs() {
  const orbsRef = useRef<THREE.Group>(null);
  
  const orbs = useMemo(() => {
    const items = [];
    for (let i = 0; i < 20; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 2 + Math.random() * 1.5;
      items.push({
        position: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        ] as [number, number, number],
        scale: 0.02 + Math.random() * 0.05,
        color: Math.random() > 0.5 ? "#00e5ff" : "#7c3aed",
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <Float key={i} speed={1 + Math.random()} floatIntensity={0.3}>
          <Sphere args={[orb.scale, 16, 16]} position={orb.position}>
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={2}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

function MatrixRain() {
  const rainRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const items = [];
    for (let i = 0; i < 100; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 10,
          Math.random() * 10 - 5,
          (Math.random() - 0.5) * 10,
        ] as [number, number, number],
        speed: 0.02 + Math.random() * 0.03,
      });
    }
    return items;
  }, []);

  useFrame(() => {
    if (rainRef.current) {
      rainRef.current.children.forEach((child, i) => {
        child.position.y -= particles[i].speed;
        if (child.position.y < -5) {
          child.position.y = 5;
        }
      });
    }
  });

  return (
    <group ref={rainRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <boxGeometry args={[0.01, 0.1, 0.01]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export const GlobeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00e5ff" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#7c3aed" />
        
        <Suspense fallback={null}>
          <Globe />
          <FloatingOrbs />
          <MatrixRain />
          <MatrixText />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none" />
    </div>
  );
};
