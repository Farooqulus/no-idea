import { Float, OrbitControls, Sparkles, Torus } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const lensVertex = `varying vec3 vNormal; varying vec3 vWorld; void main(){ vNormal = normalize(normalMatrix * normal); vec4 world = modelMatrix * vec4(position,1.0); vWorld = world.xyz; gl_Position = projectionMatrix * viewMatrix * world; }`;
const lensFragment = `uniform float uTime; uniform float uActive; varying vec3 vNormal; varying vec3 vWorld; void main(){ float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 2.4); float pulse = .5 + .5 * sin(uTime * 2.3 + vWorld.y * 5.0); vec3 hot = mix(vec3(.12,.58,1.0), vec3(1.0,.34,.06), .55 + pulse * .25); gl_FragColor = vec4(hot, fresnel * (.18 + uActive * .22)); }`;

export default function BlackHoleObject({ cameraMode = "guided" }: { cameraMode?: "guided" | "free" }) {
  return <div className="black-hole-object" aria-label="Interactive black hole idea object"><Canvas dpr={[1, 1.6]} camera={{ position: [0, .15, 4.8], fov: 42 }} gl={{ antialias: true, alpha: true }}><color attach="background" args={["#070b11"]} /><ambientLight intensity={.22} /><pointLight position={[2, 2, 3]} intensity={18} color="#ffb45b" /><pointLight position={[-2, -1, 1]} intensity={12} color="#66c9ff" /><BlackHoleScene /><OrbitControls enabled={cameraMode === "free"} enablePan enableZoom enableDamping dampingFactor={.08} rotateSpeed={.34} /></Canvas><span className="black-hole-caption">{cameraMode === "free" ? "free camera · orbit the horizon" : "hover / touch the horizon"}</span></div>;
}

function BlackHoleScene() {
  const core = useRef<THREE.Mesh>(null);
  const disk = useRef<THREE.Group>(null);
  const lens = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  const [absorbing, setAbsorbing] = useState(false);
  const particles = useMemo(() => Array.from({ length: 110 }, (_, i) => { const angle = (i / 110) * Math.PI * 2 * (1 + (i % 7) * .03); const radius = .72 + (i % 23) / 23 * 1.42; return { angle, radius, height: ((i % 11) - 5) * .014, size: .014 + (i % 4) * .008, color: i % 3 === 0 ? "#6ad4ff" : i % 4 === 0 ? "#fff0c2" : "#ff9b42" }; }), []);
  useFrame((state, delta) => { if (!core.current || !disk.current || !lens.current) return; core.current.rotation.y += delta * (.1 + (active ? .25 : 0)); disk.current.rotation.z += delta * (active ? .32 : .14); const target = active ? 1.18 : 1; const scale = THREE.MathUtils.lerp(core.current.scale.x, target, .09); core.current.scale.setScalar(scale); disk.current.scale.x = THREE.MathUtils.lerp(disk.current.scale.x, active ? 1.12 : 1, .08); disk.current.rotation.x = THREE.MathUtils.lerp(disk.current.rotation.x, .64 + state.pointer.y * .08, .05); lens.current.rotation.z += delta * (active ? .12 : .045); const material = lens.current.material as THREE.ShaderMaterial; material.uniforms.uTime.value = state.clock.elapsedTime; material.uniforms.uActive.value = active ? 1 : 0; });
  return <group onPointerOver={() => { setActive(true); document.body.style.cursor = "crosshair"; }} onPointerOut={() => { setActive(false); document.body.style.cursor = "default"; }} onClick={(event) => { event.stopPropagation(); setAbsorbing(true); window.setTimeout(() => setAbsorbing(false), 1500); }}>
    <mesh ref={lens} scale={active ? 1.28 : 1.16}><sphereGeometry args={[.86, 48, 48]} /><shaderMaterial vertexShader={lensVertex} fragmentShader={lensFragment} uniforms={{ uTime: { value: 0 }, uActive: { value: 0 } }} transparent blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} /></mesh>
    <LensingRing radius={.98} active={active} color="#73d8ff" rotation={[.76, .15, .12]} /><LensingRing radius={1.12} active={active} color="#ff9d43" rotation={[.9, -.2, .25]} /><LensingRing radius={1.32} active={active} color="#8bceff" rotation={[1.14, .25, -.18]} />
    <mesh ref={core}><sphereGeometry args={[.52, 32, 32]} /><meshBasicMaterial color="#010205" /></mesh>
    <mesh scale={active ? 1.14 : 1}><sphereGeometry args={[.58, 32, 32]} /><meshBasicMaterial color="#020307" transparent opacity={.72} /></mesh>
    <group ref={disk} rotation={[.64, 0, .2]}>{Array.from({ length: 4 }, (_, index) => <Torus key={index} args={[.76 + index * .22, .028 - index * .004, 8, 128]} rotation={[0, 0, index * .22]}><meshBasicMaterial color={index % 2 ? "#5bcfff" : "#ff9d43"} transparent opacity={active ? .78 - index * .1 : .5 - index * .08} /></Torus>)}{particles.map((particle, index) => <PlasmaParticle key={index} particle={particle} active={active} absorbing={absorbing} />)}</group>
    <Float speed={active ? 3.2 : 1.3} rotationIntensity={.22} floatIntensity={.45}><mesh position={[0, 0, .04]}><sphereGeometry args={[.64, 20, 20]} /><meshBasicMaterial color="#ffae54" transparent opacity={active ? .12 : .07} /></mesh></Float>
    <Sparkles count={active ? 90 : 45} scale={[4, 2.5, 2.5]} size={active ? 2.2 : 1.3} speed={active ? 1.4 : .45} color="#ffe1a7" opacity={active ? .85 : .5} />
  </group>;
}

function LensingRing({ radius, active, color, rotation }: { radius: number; active: boolean; color: string; rotation: [number, number, number] }) { return <mesh rotation={rotation} scale={active ? 1.08 : 1}><torusGeometry args={[radius, .014, 8, 160]} /><meshBasicMaterial color={color} transparent opacity={active ? .82 : .42} blending={THREE.AdditiveBlending} /></mesh>; }

function PlasmaParticle({ particle, active, absorbing }: { particle: { angle: number; radius: number; height: number; size: number; color: string }; active: boolean; absorbing: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const currentRadius = useRef(particle.radius);
  useFrame((state, delta) => { if (!mesh.current) return; particle.angle += delta * (active ? .62 / Math.max(currentRadius.current, .12) : .24 / particle.radius); currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, absorbing ? .035 : particle.radius, absorbing ? .12 : .04); const bend = .08 / Math.max(currentRadius.current, .3); mesh.current.position.set(Math.cos(particle.angle) * (currentRadius.current + bend), particle.height + Math.sin(state.clock.elapsedTime * 1.4 + particle.radius) * .025, Math.sin(particle.angle) * (currentRadius.current - bend)); mesh.current.scale.setScalar(absorbing ? 1.8 : 1); });
  return <mesh ref={mesh}><sphereGeometry args={[particle.size * (active ? 1.45 : 1), 8, 8]} /><meshBasicMaterial color={particle.color} transparent opacity={active ? .9 : .65} /></mesh>;
}
