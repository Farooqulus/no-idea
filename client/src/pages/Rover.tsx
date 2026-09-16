import { ArrowLeft, BrainCircuit, Compass, Lightbulb, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import AppShell from "../components/AppShell";
import RoverPanel from "../components/RoverPanel";
import { loadSavedIdea } from "../services/ideas";

export default function Rover() {
  const [open, setOpen] = useState(false);
  const idea = loadSavedIdea();

  return (
    <AppShell>
      <div className="rover-page">
        <header className="page-topline">
          <div>
            <Link href="/dashboard" className="back-link"><ArrowLeft size={15} /> Back to overview</Link>
            <p className="eyebrow"><span className="signal-dot" /> Rover / contextual intelligence</p>
            <h1>A quieter way to<br /><em>move forward.</em></h1>
          </div>
          <button className="button button-primary" onClick={() => setOpen(true)}><Sparkles size={15} /> Open Rover</button>
        </header>
        <section className="rover-intro-grid">
          <div className="rover-orbit-card">
            <div className="rover-orbit orbit-one" />
            <div className="rover-orbit orbit-two" />
            <div className="rover-orbit-core"><Sparkles size={26} /></div>
            <span className="rover-orbit-label">/ listening for signal</span>
          </div>
          <div className="rover-guidance">
            <p className="eyebrow">What Rover can do</p>
            <h2>{idea ? "Keep the thread visible." : "Start with the unfinished version."}</h2>
            <p>{idea ? "Rover knows you have a live idea. Open the panel when you want a question, a related signal, or a clearer next move." : "Rover does not replace the thinking. It gives your first signal somewhere to go."}</p>
            <div className="rover-capabilities">
              <div><Lightbulb size={16} /><span>Shape an early thought</span></div>
              <div><BrainCircuit size={16} /><span>Surface the useful tension</span></div>
              <div><Compass size={16} /><span>Find the next move</span></div>
            </div>
            <button className="rover-inline" onClick={() => setOpen(true)}><span>✦</span> Ask Rover a question <Sparkles size={14} /></button>
          </div>
        </section>
      </div>
      {open && <RoverPanel context={idea ?? undefined} onClose={() => setOpen(false)} />}
    </AppShell>
  );
}
