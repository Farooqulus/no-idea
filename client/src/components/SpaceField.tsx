import { Float, OrbitControls, Sparkles, Torus } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const colors = ["#d7a262", "#9fb7c8", "#94ad96", "#d58372"];

type Props = { progress: number; activeChapter: number; activeSection: string; cameraMode: "guided" | "free"; onToggleCamera: () => void };

export default function SpaceField({ progress, activeChapter, activeSection, cameraMode, onToggleCamera }: Props) {
  const drag = useRef({ x: 0, y: 0, active: false, lastX: 0, lastY: 0 });
  const [audioPreset, setAudioPreset] = useState<"off" | "nebula" | "pulsar" | "winds">("off");
  const audio = useRef<{ context: AudioContext; gain: GainNode; nodes: OscillatorNode[]; timers: number[] } | null>(null);
  useEffect(() => {
    const down = (event: PointerEvent) => { drag.current.active = true; drag.current.lastX = event.clientX; drag.current.lastY = event.clientY; };
    const move = (event: PointerEvent) => { document.documentElement.style.setProperty("--pointer-x", `${event.clientX / window.innerWidth}`); document.documentElement.style.setProperty("--pointer-y", `${event.clientY / window.innerHeight}`); if (!drag.current.active) return; drag.current.x += (event.clientX - drag.current.lastX) * .002; drag.current.y += (event.clientY - drag.current.lastY) * .002; drag.current.lastX = event.clientX; drag.current.lastY = event.clientY; };
    const up = () => { drag.current.active = false; };
    window.addEventListener("pointerdown", down, { passive: true }); window.addEventListener("pointermove", move, { passive: true }); window.addEventListener("pointerup", up, { passive: true }); window.addEventListener("pointercancel", up, { passive: true });
    return () => { window.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
  }, []);
  useEffect(() => () => { audio.current?.timers.forEach((timer) => window.clearInterval(timer)); audio.current?.nodes.forEach((node) => node.stop()); audio.current?.context.close(); }, []);
  const stopAudio = () => { if (!audio.current) return; audio.current.timers.forEach((timer) => window.clearInterval(timer)); audio.current.nodes.forEach((node) => node.stop()); audio.current.context.close(); audio.current = null; };
  const startAudio = (preset: Exclude<typeof audioPreset, "off">) => { stopAudio(); const context = new AudioContext(); const gain = context.createGain(); gain.gain.value = .016; gain.connect(context.destination); const nodes: OscillatorNode[] = []; const timers: number[] = []; const add = (frequency: number, type: OscillatorType, volume = 1, detune = 0) => { const oscillator = context.createOscillator(); const level = context.createGain(); oscillator.type = type; oscillator.frequency.value = frequency; oscillator.detune.value = detune; level.gain.value = volume; oscillator.connect(level); level.connect(gain); oscillator.start(); nodes.push(oscillator); }; if (preset === "nebula") { add(48, "sine", .7); add(73, "sine", .28, 9); add(146, "triangle", .08); } else if (preset === "pulsar") { add(82, "sine", .38); add(164, "sine", .12); const beat = window.setInterval(() => { const pulse = context.createOscillator(); const pulseGain = context.createGain(); pulse.type = "square"; pulse.frequency.value = 330; pulseGain.gain.setValueAtTime(.0001, context.currentTime); pulseGain.gain.exponentialRampToValueAtTime(.05, context.currentTime + .012); pulseGain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .12); pulse.connect(pulseGain); pulseGain.connect(gain); pulse.start(); pulse.stop(context.currentTime + .13); }, 780); timers.push(beat); } else { add(39, "sine", .5); add(58, "triangle", .18, -12); add(117, "sine", .05, 5); } audio.current = { context, gain, nodes, timers }; setAudioPreset(preset); };
  const cycleAudio = () => { const next = audioPreset === "off" ? "nebula" : audioPreset === "nebula" ? "pulsar" : audioPreset === "pulsar" ? "winds" : "off"; if (next === "off") { stopAudio(); setAudioPreset("off"); } else startAudio(next); };
  return <><div className={`space-field space-field-${activeSection}`} aria-hidden="true"><Canvas dpr={[1, 1.35]} camera={{ position: [0, 0, 8.5], fov: 46 }} gl={{ antialias: true, alpha: true }}><color attach="background" args={["#07090c"]} /><fog attach="fog" args={["#07090c", 8, 19]} /><ambientLight intensity={.36} /><pointLight position={[4, 4, 5]} intensity={22} color="#d7a262" /><pointLight position={[-5, -2, 3]} intensity={16} color="#8db6d2" /><GeometricField progress={progress} activeChapter={activeChapter} activeSection={activeSection} drag={drag} /><Sparkles count={activeSection === "ecosystem" ? 105 : 220} scale={[17, 12, 10]} size={1.35} speed={.16} color="#c5e5f5" opacity={activeSection === "ecosystem" ? .3 : .66} /><OrbitControls enabled={cameraMode === "free"} enablePan enableZoom enableDamping dampingFactor={.08} rotateSpeed={.35} /></Canvas><div className="space-field-hint">{cameraMode === "free" ? "free camera · drag / zoom / pan" : "drag to move the field"}</div></div><div className="space-controls"><button className={`audio-toggle ${audioPreset !== "off" ? "is-on" : ""}`} onClick={cycleAudio} aria-label="Cycle ambient space audio preset"><span className="audio-bars"><i /><i /><i /></span>{audioPreset === "off" ? "sound off" : audioPreset === "nebula" ? "nebula drone" : audioPreset === "pulsar" ? "pulsar beat" : "cosmic winds"}</button><button className={`camera-toggle ${cameraMode === "free" ? "is-on" : ""}`} onClick={onToggleCamera} aria-pressed={cameraMode === "free"}>{cameraMode === "free" ? "free camera" : "guided camera"}</button></div></>;
}

function GeometricField({ progress, activeChapter, activeSection, drag }: { progress: number; activeChapter: number; activeSection: string; drag: React.MutableRefObject<{ x: number; y: number; active: boolean; lastX: number; lastY: number }> }) {
  const group = useRef<THREE.Group>(null);
  const geometryGroup = useRef<THREE.Group>(null);
  const positions = useMemo(() => Array.from({ length: 15 }, (_, i) => ({ position: [(i % 5 - 2) * 1.5 + ((i * 7) % 3) * .15, (Math.floor(i / 5) - 1) * 1.2 + ((i * 5) % 2) * .15, -2 - (i % 4) * 1.2] as [number, number, number], color: colors[i % colors.length], size: .12 + (i % 4) * .045 })), []);
  useFrame((state, delta) => {
    if (!group.current || !geometryGroup.current) return;
    group.current.rotation.y += delta * (.008 + progress * .016);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, drag.current.y + (state.pointer.y * .08), .035);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, drag.current.x + progress * .26, .035);
    geometryGroup.current.rotation.y += delta * (.018 + activeChapter * .008);
    geometryGroup.current.rotation.x = THREE.MathUtils.lerp(geometryGroup.current.rotation.x, -drag.current.y * .7, .04);
  });
  const primaryColor = activeSection === "people" ? "#91d9ff" : activeSection === "ecosystem" ? "#ff9f43" : "#d7a262";
  return <group ref={group} rotation={[.12, -.28, -.12]}><group ref={geometryGroup}>{positions.map((item, i) => <Float key={i} speed={.65 + (i % 3) * .3} floatIntensity={.2 + (i % 3) * .08} rotationIntensity={.22}><mesh position={item.position} rotation={[i * .25, i * .18, i * .12]} scale={item.size * (activeSection === "journey" && i % 4 === activeChapter % 4 ? 1.8 : 1)}><icosahedronGeometry args={[1, i % 3 === 0 ? 1 : 0]} /><meshBasicMaterial color={item.color} wireframe transparent opacity={.18 + (i % 4) * .06} /></mesh></Float>)}</group><Float speed={1.2} floatIntensity={.45}><mesh position={[0, 0, -.2]} rotation={[.5, .3, .1]}><dodecahedronGeometry args={[.9, 1]} /><meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={activeSection === "ecosystem" ? 1.8 : 1.05} wireframe transparent opacity={.58} roughness={.22} metalness={.72} /></mesh></Float><Torus args={[1.34, .018, 8, 128]} rotation={[.8, .18, .25]}><meshBasicMaterial color={primaryColor} transparent opacity={.5} /></Torus><Torus args={[1.72, .009, 8, 128]} rotation={[1.18, -.2, .4]}><meshBasicMaterial color="#9fb7c8" transparent opacity={.24} /></Torus></group>;
}
