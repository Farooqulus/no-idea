import { Float, Sparkles as DreiSparkles, Torus } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

export type RoverOrbState = "idle" | "listening" | "responding";
const stateCopy: Record<RoverOrbState, string> = { idle: "Rover", listening: "Listening", responding: "A signal" };

export default function RoverOrb({ state = "idle", onOpen }: { state?: RoverOrbState; onOpen?: () => void }) {
  return (
    <button className={`rover-orb-3d rover-orb-${state}`} aria-label="Open Rover assistant" onClick={onOpen}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.5], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={.8} />
        <pointLight position={[2, 2, 3]} intensity={9} color="#d7a262" />
        <OrbMesh state={state} />
        <DreiSparkles count={state === "responding" ? 32 : 18} scale={2.5} size={state === "responding" ? 2 : 1.5} speed={state === "responding" ? 1.1 : .3} color={state === "responding" ? "#94ad96" : "#9fb7c8"} />
      </Canvas>
      <span className="rover-orb-label">{stateCopy[state]}</span>
      <span className="rover-orb-state-dot" aria-hidden="true" />
    </button>
  );
}

function OrbMesh({ state }: { state: RoverOrbState }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useFrame((frame, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * (state === "responding" ? .9 : state === "listening" ? .55 : .35);
    mesh.current.rotation.x += delta * .08;
    const target = hovered ? 1.15 : state === "listening" ? 1.08 : state === "responding" ? 1.12 : 1;
    const scale = THREE.MathUtils.lerp(mesh.current.scale.x, target, .1);
    mesh.current.scale.setScalar(scale);
    mesh.current.position.y = Math.sin(frame.clock.elapsedTime * (state === "listening" ? 2 : 1)) * .04;
  });
  const color = state === "responding" ? "#94ad96" : "#d7a262";
  return <Float speed={state === "responding" ? 3 : 1.5} rotationIntensity={.3} floatIntensity={.6}>
    <group>
      <mesh ref={mesh} onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}>
        <icosahedronGeometry args={[.58, 2]} />
        <meshStandardMaterial color={color} emissive={state === "listening" ? "#d7a262" : state === "responding" ? "#52775c" : "#5b4028"} emissiveIntensity={state === "listening" ? 1.9 : state === "responding" ? 2.3 : 1.1} roughness={.28} metalness={.5} />
      </mesh>
      <Torus args={[.82, .012, 8, 64]} rotation={[Math.PI / 2.5, 0, 0]}><meshBasicMaterial color={color} transparent opacity={state === "idle" ? .28 : .7} /></Torus>
      {state !== "idle" && <Torus args={[1.03, .008, 8, 64]} rotation={[Math.PI / 3, 0, 0]}><meshBasicMaterial color={state === "responding" ? "#94ad96" : "#d7a262"} transparent opacity={.48} /></Torus>}
    </group>
  </Float>;
}
