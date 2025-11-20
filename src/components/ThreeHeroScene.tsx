import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";

function FloatingTorus() {
  return (
    <mesh rotation={[0.5, 0.2, 0]} position={[0, 0.2, 0]}>
      <torusKnotGeometry args={[1.1, 0.32, 256, 64]} />
      <meshStandardMaterial
        color={"#00e5ff"}
        metalness={0.6}
        roughness={0.2}
        emissive={"#00e5ff"}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

function Orbs() {
  return (
    <group>
      <mesh position={[-2.2, -0.8, -1.5]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={"#7c3aed"} emissive={"#7c3aed"} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[2.4, 0.6, -1]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={"#22d3ee"} emissive={"#22d3ee"} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

export const ThreeHeroScene = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-60 animate-fade-in">
      <Canvas>
        <color attach="background" args={["#020617"]} />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[4, 4, 4]} intensity={1.2} color={"#22d3ee"} />
        <pointLight position={[-4, -3, -2]} intensity={1.1} color={"#7c3aed"} />
        <Suspense fallback={null}>
          <FloatingTorus />
          <Orbs />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
    </div>
  );
};
