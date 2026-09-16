import { ArrowRight, ArrowUpRight, Lightbulb, Plus } from "lucide-react";
import { Link } from "wouter";
import AppShell from "../components/AppShell";
import { loadSavedIdea } from "../services/ideas";

export default function Ideas() {
  const idea = loadSavedIdea();
  return (
    <AppShell>
      <div className="dashboard-page ideas-page">
        <header className="page-topline">
          <div><p className="eyebrow">Your field notes</p><h1>My <em>ideas.</em></h1></div>
          <Link href="/ideas/new" className="button button-primary"><Plus size={15} /> Start an idea</Link>
        </header>
        {idea ? <section className="idea-library-card"><div className="idea-library-signal"><span>◌</span><p className="eyebrow">Idea / 01 · {idea.stage}</p></div><h2>{idea.title}</h2><p>{idea.description}</p><div className="story-meta"><span><b>Domain</b>{idea.domain || "Unassigned"}</span><span><b>Target users</b>{idea.targetUsers || "Still forming"}</span><span><b>Progress</b>{idea.progress}% formed</span></div><Link href="/dashboard" className="text-link">Open in the pipeline <ArrowUpRight size={15} /></Link></section> : <section className="empty-project empty-project-large ideas-empty"><Lightbulb size={26} /><p className="eyebrow">No signals saved yet</p><h2>The field is<br /><em>quiet.</em></h2><p>Start with the thought you keep returning to. It does not need to be ready.</p><Link href="/ideas/new" className="button button-primary">Give it a place to land <ArrowRight size={15} /></Link></section>}
      </div>
    </AppShell>
  );
}
