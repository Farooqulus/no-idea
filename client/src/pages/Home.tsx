import { ArrowUpRight, ChevronDown, Circle, Menu, MoveUpRight, RotateCw } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import DeveloperConstellation from "../components/DeveloperConstellation";
import BlackHoleObject from "../components/BlackHoleObject";
import IdeaUniverse from "../components/IdeaUniverse";
import RoverOrb, { RoverOrbState } from "../components/RoverOrb";
import SpaceField from "../components/SpaceField";
import { Developer, developers } from "../services/collaboration";

const chapters = [
  ["01", "The Idea", "A loose thought is still a beginning."],
  ["02", "Understanding", "Rover listens for the signal inside the noise."],
  ["03", "Structure", "Fragments become requirements, constraints, and a point of view."],
  ["04", "Connection", "The right people appear around the shape of the work."],
  ["05", "Building", "An idea earns momentum when it can be made together."],
];
const objects = [
  ["thought", "A raw fragment", "The thing that arrives before the brief."],
  ["signal", "Useful tension", "The question worth staying with."],
  ["people", "A nearby orbit", "Builders who make the idea more possible."],
  ["momentum", "A working pulse", "The first move you can actually make."],
];
const team = [
  { name: "Farhaan Muhammed J K", role: "Founder · Product & systems", work: "Frontend Implementation · Integration", linkedin: "https://www.linkedin.com/in/farhaan-mjk?utm_source=share_via&utm_content=profile&utm_medium=member_android", accent: "amber" },
  { name: "Spencer Jubily", role: "Product · Experience & direction", work: "Semantic Similarity · Developer Matching", linkedin: "https://www.linkedin.com/in/spencer-jubily?utm_source=share_via&utm_content=profile&utm_medium=member_android", accent: "ice" },
  { name: "Fabena Franklin Fernandez", role: "Design · Research & craft", work: "LLM Chatbot · Requirement Elicitation", linkedin: "https://www.linkedin.com/in/fabena-franklin-fernandez-5108942b8?utm_source=share_via&utm_content=profile&utm_medium=member_android", accent: "green" },
  { name: "Miraclin Charles Williams", role: "Engineering · Prototyping & build", work: "UI/UX Design · Idea Validation frontend", linkedin: "https://www.linkedin.com/in/miraclin-charles-williams-35274a281?utm_source=share_via&utm_content=profile&utm_medium=member_android", accent: "coral" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeObject, setActiveObject] = useState(0);
  const [selectedSignal, setSelectedSignal] = useState("Select a signal to follow it.");
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [roverState, setRoverState] = useState<RoverOrbState>("idle");
  const [cameraMode, setCameraMode] = useState<"guided" | "free">("guided");

  useEffect(() => {
    let frame = 0;
    const sections = ["hero", "journey", "ecosystem", "people", "team"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)), { rootMargin: "-35% 0px -45%", threshold: .01 });
    sections.forEach((section) => observer.observe(section));
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { setScrolled(window.scrollY > 32); setScrollProgress(Math.min(window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1), 1)); }); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const handleRover = () => setRoverState((current) => { if (current === "idle") return "listening"; if (current === "listening") return "responding"; document.querySelector("#journey")?.scrollIntoView({ behavior: "smooth" }); return "idle"; });
  const jumpToChapter = (index: number) => { setActiveChapter(index); document.querySelector("#journey")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return <main className="site-shell" onPointerMove={(event) => { document.documentElement.style.setProperty("--pointer-x", `${event.clientX / window.innerWidth}`); document.documentElement.style.setProperty("--pointer-y", `${event.clientY / window.innerHeight}`); }}>
    <SpaceField progress={scrollProgress} activeChapter={activeChapter} activeSection={activeSection} cameraMode={cameraMode} onToggleCamera={() => setCameraMode((mode) => mode === "guided" ? "free" : "guided")} />
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}><Link href="/" className="wordmark" aria-label="NO IDEA home"><span className="mark">◌</span> NO IDEA</Link><nav id="primary-navigation" className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation"><a href="#journey" onClick={() => setMenuOpen(false)}>The journey</a><a href="#ecosystem" onClick={() => setMenuOpen(false)}>Ecosystem</a><a href="#people" onClick={() => setMenuOpen(false)}>People</a><a href="#team" onClick={() => setMenuOpen(false)}>Our team</a><Link href="/login" className="nav-login">Sign in <ArrowUpRight size={14} /></Link></nav><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="primary-navigation"><Menu size={19} /></button></header>

    <section id="hero" className={`hero-section flow-section ${activeSection === "hero" ? "active" : ""}`}><div className="hero-grain" /><div className="hero-copy"><p className="eyebrow"><span className="signal-dot" /> An intelligence layer for unfinished thoughts</p><h1>Every breakthrough<br /><em>starts as an idea.</em></h1><p className="hero-lede">Turn an unstructured thought into a validated project, find the right people, and build it together.</p><div className="hero-actions"><Link href="/login" className="button button-primary">Start an idea <MoveUpRight size={16} /></Link><a href="#journey" className="button button-quiet">Explore the field <ChevronDown size={16} /></a></div><div className="hero-signal-readout"><span className="signal-dot" /> field status: <strong>{scrollProgress > .08 ? "in motion" : "awaiting a signal"}</strong></div></div><div className="hero-visual" style={{ "--scroll-progress": scrollProgress } as React.CSSProperties}><IdeaUniverse onSelect={(node) => setSelectedSignal(`${node.label} · ${node.detail}`)} /><div className="selected-signal" aria-live="polite">/ {selectedSignal}</div></div><div className="hero-footer"><span>01 / 07</span><span>Scroll to enter the field <ChevronDown size={14} /></span><span>© 2026</span></div></section>

    <RoverOrb state={roverState} onOpen={handleRover} />
    <div className="flow-rail" aria-label="Landing page sections">{["hero", "journey", "ecosystem", "people", "team"].map((id, index) => <a key={id} href={`#${id}`} className={activeSection === id ? "active" : ""}><span>0{index + 1}</span><i /></a>)}</div>

    <section id="journey" className={`journey-section flow-section ${activeSection === "journey" ? "active" : ""}`}><div className="section-intro"><p className="eyebrow"><span className="signal-dot" /> Phase {String(activeChapter + 1).padStart(2, "0")} / 05</p><h2>From <em>unclear</em><br />to inevitable.</h2><p>Move through the idea field. Each phase changes the orbit, the objects, and the next useful question.</p><div className="journey-controls"><button onClick={() => setActiveChapter((chapter) => (chapter + chapters.length - 1) % chapters.length)} aria-label="Previous phase">←</button><button onClick={() => setActiveChapter((chapter) => (chapter + 1) % chapters.length)} aria-label="Next phase">→</button><span>Swipe or use arrows</span></div></div><div className="chapter-list">{chapters.map(([num, title, desc], i) => <button className={`chapter ${activeChapter === i ? "active" : ""}`} key={num} onClick={() => setActiveChapter(i)}><span className="chapter-number">{num}</span><div className="chapter-line"><span style={{ width: `${30 + i * 15}%` }} /></div><div><h3>{title}</h3><p>{desc}</p></div><Circle size={13} strokeWidth={1} /></button>)}</div></section>

    <section id="ecosystem" className={`ecosystem-section flow-section ${activeSection === "ecosystem" ? "active" : ""}`}><div className="ecosystem-visual interactive-object-field"><BlackHoleObject cameraMode={cameraMode} />{objects.map(([id], index) => <button key={id} className={`eco-node node-${index + 1} ${activeObject === index ? "active" : ""}`} onClick={() => setActiveObject(index)}>{id}</button>)}<div className="object-orbit-hint"><RotateCw size={12} /> touch the black hole</div></div><div className="ecosystem-copy"><p className="eyebrow"><span className="signal-dot" /> Object {String(activeObject + 1).padStart(2, "0")} / 04</p><h2>Ideas are not<br /><em>linear.</em></h2><p className="object-description"><strong>{objects[activeObject][1]}</strong><br />{objects[activeObject][2]}</p><div className="object-pills">{objects.map(([id], index) => <button className={activeObject === index ? "active" : ""} key={id} onClick={() => setActiveObject(index)}>{id}</button>)}</div><Link href="/login" className="text-link">Enter the field <ArrowUpRight size={15} /></Link></div></section>

    <section id="people" className={`people-section flow-section ${activeSection === "people" ? "active" : ""}`}><div className="people-copy"><p className="eyebrow"><span className="signal-dot" /> The people around the signal</p><h2>Good ideas<br /><em>find their orbit.</em></h2><p>Drag the field, pinch to inspect, and tap a node. Distance is a visual cue for fit, not a final verdict.</p><div className="people-readout" aria-live="polite"><span className="readout-kicker">selected signal</span><strong>{selectedDeveloper ? selectedDeveloper.name : "none yet"}</strong><span>{selectedDeveloper ? selectedDeveloper.role : "Tap a node to tune the field."}</span></div><Link href={selectedDeveloper ? `/developers/${selectedDeveloper.id}` : "/developers"} className="text-link">Open the people index <ArrowUpRight size={15} /></Link></div><DeveloperConstellation developers={developers} onSelect={setSelectedDeveloper} /></section>

    <section id="team" className={`team-section flow-section ${activeSection === "team" ? "active" : ""}`}><div className="team-intro"><p className="eyebrow"><span className="signal-dot" /> The people making the field</p><h2>Small team.<br /><em>Wide orbit.</em></h2><p>Meet the people shaping NO IDEA. Touch a name to open the shared LinkedIn profile.</p></div><div className="team-grid">{team.map((member, index) => <a className={`team-card team-card-${member.accent}`} key={member.name} href={member.linkedin} target="_blank" rel="noreferrer"><span className="team-index">0{index + 1}</span><span className="team-avatar">{member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div className="team-card-copy"><h3>{member.name}</h3><p>{member.role}</p><span className="team-work-label">WORK DONE</span><p className="team-work">{member.work}</p></div><span className="team-link"><ArrowUpRight size={16} /> LinkedIn</span></a>)}</div></section>
    <footer className="site-footer"><Link href="/" className="wordmark"><span className="mark">◌</span> NO IDEA</Link><span>Make the first move.</span><span>Built for the unfinished.</span></footer>
  </main>;
}
