import { ArrowUpRight, Check, ChevronDown, Circle, Layers3, Menu, MoveUpRight, Play, Sparkles, Users, Zap } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import DeveloperConstellation from "../components/DeveloperConstellation";
import IdeaUniverse from "../components/IdeaUniverse";
import RoverOrb, { RoverOrbState } from "../components/RoverOrb";
import SpaceField from "../components/SpaceField";
import { Developer, developers } from "../services/collaboration";

const workflow = [
  ["01", "Capture the spark", "Drop in the rough thought, voice note, question, or half-written brief."],
  ["02", "Shape the direction", "Rover turns the messy first draft into a clear opportunity and next move."],
  ["03", "Find the right people", "Discover people with the skills, context, and energy to move it forward."],
  ["04", "Build in the open", "Keep decisions, tasks, files, and momentum in one shared workspace."],
];
const workspaceSignals = [
  ["Brief", "A clear problem worth solving", "amber"],
  ["People", "Three collaborators in orbit", "ice"],
  ["Next move", "Validate the first prototype", "green"],
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
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [selectedSignal, setSelectedSignal] = useState("Select an idea or person to explore it.");
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [roverState, setRoverState] = useState<RoverOrbState>("idle");
  const [cameraMode, setCameraMode] = useState<"guided" | "free">("guided");

  useEffect(() => {
    let frame = 0;
    const ids = ["hero", "workflow", "workspace", "people", "team"];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)), { rootMargin: "-35% 0px -45%", threshold: .01 });
    sections.forEach((section) => observer.observe(section));
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { setScrolled(window.scrollY > 32); setScrollProgress(Math.min(window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1), 1)); }); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const handleRover = () => setRoverState((current) => { if (current === "idle") return "listening"; if (current === "listening") return "responding"; document.querySelector("#workflow")?.scrollIntoView({ behavior: "smooth" }); return "idle"; });
  const jumpToWorkflow = (index: number) => { setActiveWorkflow(index); document.querySelector("#workflow")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return <main className="site-shell platform-shell" onPointerMove={(event) => { document.documentElement.style.setProperty("--pointer-x", `${event.clientX / window.innerWidth}`); document.documentElement.style.setProperty("--pointer-y", `${event.clientY / window.innerHeight}`); }}>
    <SpaceField progress={scrollProgress} activeChapter={activeWorkflow} activeSection={activeSection} cameraMode={cameraMode} onToggleCamera={() => setCameraMode((mode) => mode === "guided" ? "free" : "guided")} />
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}><Link href="/" className="wordmark" aria-label="NO IDEA home"><span className="mark">◌</span> NO IDEA</Link><nav id="primary-navigation" className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation"><a href="#workflow" onClick={() => setMenuOpen(false)}>How it works</a><a href="#workspace" onClick={() => setMenuOpen(false)}>Workspace</a><a href="#people" onClick={() => setMenuOpen(false)}>Find people</a><a href="#team" onClick={() => setMenuOpen(false)}>Our team</a><Link href="/login" className="nav-login">Sign in <ArrowUpRight size={14} /></Link></nav><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="primary-navigation"><Menu size={19} /></button></header>

    <section id="hero" className={`hero-section platform-hero flow-section ${activeSection === "hero" ? "active" : ""}`}><div className="hero-grain" /><div className="hero-copy"><p className="eyebrow"><span className="signal-dot" /> A calmer way to start and build</p><h1>From first spark<br /><em>to shared momentum.</em></h1><p className="hero-lede">Turn a rough idea into a clear plan, a working team, and a place to keep moving.</p><div className="hero-actions"><Link href="/login" className="button button-primary">Start a project <MoveUpRight size={16} /></Link><a href="#workflow" className="button button-quiet"><Play size={14} /> See how it works</a></div><div className="hero-proof"><span><Check size={13} /> A clear next step</span><span><Users size={13} /> People around the work</span></div></div><div className="hero-visual" style={{ "--scroll-progress": scrollProgress } as React.CSSProperties}><IdeaUniverse onSelect={(node) => setSelectedSignal(`${node.label} · ${node.detail}`)} /><div className="selected-signal" aria-live="polite">/ {selectedSignal}</div></div><div className="hero-footer"><span>NO IDEA / 01</span><span>Drag to explore the field <ChevronDown size={14} /></span><span>© 2026</span></div></section>

    <RoverOrb state={roverState} onOpen={handleRover} /><div className="flow-rail" aria-label="Landing page sections">{["hero", "workflow", "workspace", "people", "team"].map((id, index) => <a key={id} href={`#${id}`} className={activeSection === id ? "active" : ""}><span>0{index + 1}</span><i /></a>)}</div>

    <section id="workflow" className={`journey-section platform-section flow-section ${activeSection === "workflow" ? "active" : ""}`}><div className="section-intro"><p className="eyebrow"><span className="signal-dot" /> A clear path through the work</p><h2>From a rough idea<br />to a plan people<br /><em>can act on.</em></h2><p>Start with what you have. Then make the next useful decision with the people who need to be part of it.</p><div className="journey-controls"><button onClick={() => setActiveWorkflow((step) => (step + workflow.length - 1) % workflow.length)} aria-label="Previous workflow step">←</button><button onClick={() => setActiveWorkflow((step) => (step + 1) % workflow.length)} aria-label="Next workflow step">→</button><span>Swipe or use arrows</span></div></div><div className="chapter-list workflow-list">{workflow.map(([num, title, desc], i) => <button className={`chapter ${activeWorkflow === i ? "active" : ""}`} key={num} onClick={() => setActiveWorkflow(i)}><span className="chapter-number">{num}</span><div className="chapter-line"><span style={{ width: `${32 + i * 18}%` }} /></div><div><h3>{title}</h3><p>{desc}</p></div><Circle size={13} strokeWidth={1} /></button>)}</div></section>

    <section id="workspace" className={`workspace-section platform-section flow-section ${activeSection === "workspace" ? "active" : ""}`}><div className="workspace-copy"><p className="eyebrow"><span className="signal-dot" /> One place for the whole project</p><h2>Keep the work<br /><em>in view.</em></h2><p>Keep the brief, decisions, collaborators, and next action together so the project can keep moving.</p><Link href="/login" className="text-link light-link">Open your workspace <ArrowUpRight size={15} /></Link></div><div className="workspace-board"><div className="board-topline"><span><span className="live-dot" /> PROJECT SPACE / ACTIVE</span><span>Updated just now</span></div><div className="board-title"><span className="board-icon"><Sparkles size={16} /></span><div><strong>Community repair circles</strong><span>Make local skills easier to share</span></div><span className="board-progress">68%</span></div><div className="workspace-orbit"><div className="orbit-glow" /><div className="orbit-core"><Layers3 size={21} /><span>shared<br />context</span></div><span className="orbit-chip orbit-chip-a">brief</span><span className="orbit-chip orbit-chip-b">research</span><span className="orbit-chip orbit-chip-c">people</span><span className="orbit-chip orbit-chip-d">prototype</span></div><div className="signal-grid">{workspaceSignals.map(([label, value, accent]) => <div className={`signal-card signal-card-${accent}`} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="board-footer"><span><Users size={13} /> 4 collaborators</span><span><Zap size={13} /> next: validate prototype</span></div></div></section>

    <section id="people" className={`people-section platform-section flow-section ${activeSection === "people" ? "active" : ""}`}><div className="people-copy"><p className="eyebrow"><span className="signal-dot" /> Find the right people</p><h2>Find the people<br /><em>for this work.</em></h2><p>Meet developers, mentors, and collaborators by skills, context, and how they like to work.</p><div className="people-readout" aria-live="polite"><span className="readout-kicker">selected collaborator</span><strong>{selectedDeveloper ? selectedDeveloper.name : "Explore the constellation"}</strong><span>{selectedDeveloper ? `${selectedDeveloper.role} · ${selectedDeveloper.match}% fit` : "Tap a person to see the connection."}</span></div><Link href={selectedDeveloper ? `/developers/${selectedDeveloper.id}` : "/developers"} className="text-link light-link">Explore all collaborators <ArrowUpRight size={15} /></Link></div><DeveloperConstellation developers={developers} onSelect={setSelectedDeveloper} /></section>

    <section id="team" className={`team-section platform-section flow-section ${activeSection === "team" ? "active" : ""}`}><div className="team-intro"><p className="eyebrow"><span className="signal-dot" /> The people behind NO IDEA</p><h2>Bring the idea.<br /><em>Build it together.</em></h2><p>Meet the people shaping NO IDEA. Touch a name to open their shared LinkedIn profile.</p></div><div className="team-grid">{team.map((member, index) => <a className={`team-card team-card-${member.accent}`} key={member.name} href={member.linkedin} target="_blank" rel="noreferrer"><span className="team-index">0{index + 1}</span><span className="team-avatar">{member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div className="team-card-copy"><h3>{member.name}</h3><p>{member.role}</p><span className="team-work-label">CONTRIBUTION</span><p className="team-work">{member.work}</p></div><span className="team-link"><ArrowUpRight size={16} /> LinkedIn</span></a>)}</div></section>
    <footer className="site-footer"><Link href="/" className="wordmark"><span className="mark">◌</span> NO IDEA</Link><span>Bring the idea. We will help with the next step.</span><span>A workspace for people who make.</span></footer>
  </main>;
}
