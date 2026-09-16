import { ArrowUpRight, ChevronDown, Circle, Menu, MoveUpRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

const chapters = [
  ["01", "The Idea", "A loose thought is still a beginning."],
  ["02", "Understanding", "Rover listens for the signal inside the noise."],
  ["03", "Structure", "Fragments become requirements, constraints, and a point of view."],
  ["04", "Connection", "The right people appear around the shape of the work."],
  ["05", "Building", "An idea earns momentum when it can be made together."],
];

function IdeaField() {
  const dots = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div className="idea-field" aria-label="A visual representation of an idea becoming structured">
      <div className="field-orbit orbit-a" />
      <div className="field-orbit orbit-b" />
      <div className="field-orbit orbit-c" />
      <div className="idea-core"><span>NO<br />IDEA</span><i /></div>
      {dots.map((dot) => <span key={dot} className={`field-dot dot-${dot}`} />)}
      <div className="field-label label-top">/ signal detected</div>
      <div className="field-label label-bottom">a project is forming</div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <main className="site-shell">
      <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
        <Link href="/" className="wordmark" aria-label="NO IDEA home"><span className="mark">◌</span> NO IDEA</Link>
        <nav id="primary-navigation" className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
          <a href="#journey" onClick={() => setMenuOpen(false)}>The journey</a><a href="#ecosystem" onClick={() => setMenuOpen(false)}>Ecosystem</a><a href="#manifesto" onClick={() => setMenuOpen(false)}>Manifesto</a>
          <Link href="/login" className="nav-login">Sign in <ArrowUpRight size={14} /></Link>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="primary-navigation"><Menu size={19} /></button>
      </header>

      <section className="hero-section">
        <div className="hero-grain" />
        <div className="hero-copy">
          <p className="eyebrow"><span className="signal-dot" /> An intelligence layer for unfinished thoughts</p>
          <h1>Every breakthrough<br /><em>starts as an idea.</em></h1>
          <p className="hero-lede">Turn an unstructured thought into a validated project, find the right people, and build it together.</p>
          <div className="hero-actions">
            <Link href="/login" className="button button-primary">Start an idea <MoveUpRight size={16} /></Link>
            <a href="#journey" className="button button-quiet">Explore the ecosystem <ChevronDown size={16} /></a>
          </div>
        </div>
        <div className="hero-visual"><IdeaField /></div>
        <div className="hero-footer"><span>01 / 07</span><span>Scroll to enter the field <ChevronDown size={14} /></span><span>© 2026</span></div>
      </section>

      <section id="journey" className="journey-section">
        <div className="section-intro"><p className="eyebrow">The idea journey</p><h2>From <em>unclear</em><br />to inevitable.</h2><p>NO IDEA gives the half-formed a place to become real. A quiet system for the messy, human work that comes before the build.</p></div>
        <div className="chapter-list">{chapters.map(([num, title, desc], i) => <div className="chapter" key={num}><span className="chapter-number">{num}</span><div className="chapter-line"><span style={{ width: `${30 + i * 15}%` }} /></div><div><h3>{title}</h3><p>{desc}</p></div><Circle size={13} strokeWidth={1} /></div>)}</div>
      </section>

      <section id="ecosystem" className="ecosystem-section">
        <div className="ecosystem-visual"><div className="mini-core">✳</div><span className="eco-line line-1" /><span className="eco-line line-2" /><span className="eco-line line-3" /><span className="eco-node node-1">thought</span><span className="eco-node node-2">people</span><span className="eco-node node-3">momentum</span></div>
        <div className="ecosystem-copy"><p className="eyebrow">A new kind of workspace</p><h2>Ideas are not<br /><em>linear.</em></h2><p>They move through questions, connections, false starts, and flashes of clarity. NO IDEA is designed around that motion.</p><Link href="/login" className="text-link">Enter the field <ArrowUpRight size={15} /></Link></div>
      </section>

      <section id="manifesto" className="manifesto-section"><p className="eyebrow">The manifesto</p><blockquote>“The distance between a thought and a thing is not as far as it feels.”</blockquote><div className="manifesto-meta"><span>NO IDEA / FIELD NOTES 001</span><span>For ideators, mentors &amp; builders</span></div></section>
      <footer className="site-footer"><Link href="/" className="wordmark"><span className="mark">◌</span> NO IDEA</Link><span>Make the first move.</span><span>Built for the unfinished.</span></footer>
    </main>
  );
}
