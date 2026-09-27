import { Html, OrbitControls, Sparkles as DreiSparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type IdeaNode = { id: string; label: string; detail: string; color: string; position: [number, number, number] };
const nodes: IdeaNode[] = [
  { id: "thought", label: "thought", detail: "The unfinished fragment", color: "#d7a262", position: [-2.2, .8, .1] },
  { id: "signal", label: "signal", detail: "The useful tension", color: "#9fb7c8", position: [-.7, 1.45, .3] },
  { id: "structure", label: "structure", detail: "Requirements taking shape", color: "#94ad96", position: [.9, .65, .2] },
  { id: "people", label: "people", detail: "The right collaborators", color: "#d7a262", position: [1.95, 1.25, -.1] },
  { id: "project", label: "project", detail: "Something ready to build", color: "#9fb7c8", position: [1.2, -1, .4] },
];

export default function IdeaUniverse({ className = "", onSelect }: { className?: string; onSelect?: (node: IdeaNode) => void }) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch { setWebgl(false); }
    const onScroll = () => setScroll(Math.min(window.scrollY / Math.max(window.innerHeight * 2.15, 1), 1));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (webgl === false) return <IdeaUniverseFallback className={className} onSelect={onSelect} />;
  if (webgl === null) return <div className={`idea-universe-loading ${className}`} aria-label="Loading the interactive idea universe" />;
  return (
    <div className={`idea-universe ${className}`} aria-label="Interactive 3D idea universe">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 6.7], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#0c0d0e"]} />
        <ambientLight intensity={.7} />
        <pointLight position={[2, 3, 4]} intensity={14} color="#d7a262" />
        <pointLight position={[-3, -1, 2]} intensity={9} color="#9fb7c8" />
        <UniverseGroup scroll={scroll} onSelect={onSelect} />
        <DreiSparkles count={80} scale={[7, 5, 4]} size={1.4} speed={.18} color="#9fb7c8" opacity={.42} />
        <OrbitControls enablePan={false} enableZoom={false} enableDamping dampingFactor={.08} rotateSpeed={.35} />
      </Canvas>
      <div className="universe-hint">Drag to orbit · select a signal</div>
    </div>
  );
}

function UniverseGroup({ scroll, onSelect }: { scroll: number; onSelect?: (node: IdeaNode) => void }) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const linePositions = useMemo(() => nodes.slice(0, -1).flatMap((node, index) => [node.position, nodes[index + 1].position]), []);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * (.06 + scroll * .12);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, (state.pointer.y * .08) - scroll * .22, .04);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, scroll * .3, .04);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, scroll * -.35, .04);
  });
  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array(linePositions.flat()), 3]} /></bufferGeometry>
        <lineBasicMaterial color="#53636a" transparent opacity={.5} />
      </lineSegments>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[.66, 32, 32]} />
        <meshStandardMaterial color={scroll > .55 ? "#41677a" : "#bd8145"} emissive={scroll > .55 ? "#163241" : "#684625"} emissiveIntensity={1.25 + scroll * .7} roughness={.34} metalness={.45} />
      </mesh>
      <mesh rotation={[.9, .25, .18]}>
        <torusGeometry args={[.92, .018, 8, 96]} />
        <meshBasicMaterial color="#d7a262" transparent opacity={.72} />
      </mesh>
      <mesh rotation={[1.28, -.25, .44]}>
        <torusGeometry args={[1.12, .009, 8, 96]} />
        <meshBasicMaterial color="#9fb7c8" transparent opacity={.28} />
      </mesh>
      {nodes.map((node) => <SignalNode key={node.id} node={node} hovered={hovered === node.id} onHover={setHovered} onSelect={onSelect} />)}
    </group>
  );
}

function SignalNode({ node, hovered, onHover, onSelect }: { node: IdeaNode; hovered: boolean; onHover: (id: string | null) => void; onSelect?: (node: IdeaNode) => void }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const target = hovered ? 1.36 : 1;
    const scale = THREE.MathUtils.lerp(mesh.current.scale.x, target, .12);
    mesh.current.scale.setScalar(scale);
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * .75 + node.position[0]) * .05;
  });
  return (
    <group position={node.position}>
      <mesh ref={mesh} onPointerOver={(event) => { event.stopPropagation(); onHover(node.id); document.body.style.cursor = "pointer"; }} onPointerOut={() => { onHover(null); document.body.style.cursor = "default"; }} onClick={(event) => { event.stopPropagation(); onSelect?.(node); }}>
        <sphereGeometry args={[.12, 18, 18]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={hovered ? 2 : .75} />
      </mesh>
      {hovered && <><mesh><ringGeometry args={[.2, .215, 32]} /><meshBasicMaterial color={node.color} transparent opacity={.8} /></mesh><Html distanceFactor={8} position={[.18, .18, 0]}><div className="universe-node-label"><strong>{node.label}</strong><span>{node.detail}</span></div></Html></>}
    </group>
  );
}

function IdeaUniverseFallback({ className, onSelect }: { className: string; onSelect?: (node: IdeaNode) => void }) {
  return <div className={`idea-universe fallback ${className}`} aria-label="Idea universe"><div className="fallback-core">NO<br />IDEA</div>{nodes.map((node) => <button key={node.id} className={`fallback-node fallback-${node.id}`} style={{ "--node-color": node.color } as React.CSSProperties} onClick={() => onSelect?.(node)}>{node.label}</button>)}</div>;
}
