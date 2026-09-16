import { ArrowLeft, ArrowRight, Check, CircleHelp, LoaderCircle, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import AppShell from "../components/AppShell";
import RoverPanel from "../components/RoverPanel";
import { createIdea, emptyIdea, IdeaDraft, loadDraft, saveDraft, validateIdea } from "../services/ideas";

const fields: { key: keyof IdeaDraft; label: string; placeholder: string; hint: string }[] = [
  { key: "title", label: "Working title", placeholder: "Give the thought a name…", hint: "It can change later." },
  { key: "description", label: "The thought", placeholder: "Tell us what you keep coming back to…", hint: "Write it as it is in your head. No pitch needed." },
  { key: "problem", label: "The tension", placeholder: "What feels broken, missing, or possible?", hint: "Optional for now — Rover can help surface this." },
  { key: "targetUsers", label: "Who is this for?", placeholder: "The people who would feel the difference…", hint: "Be specific or stay broad. Both are useful." },
  { key: "domain", label: "Where does it live?", placeholder: "Climate, health, culture, tools…", hint: "A signal, not a constraint." },
];

type Errors = Partial<Record<keyof IdeaDraft, string>>;

export default function IdeaCreation() {
  const [draft, setDraft] = useState<IdeaDraft>(() => loadDraft());
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [success, setSuccess] = useState(false);
  const [roverOpen, setRoverOpen] = useState(false);
  const field = fields[step];

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(draft);
      setSaved(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [draft]);

  const update = (value: string) => {
    setDraft((current) => ({ ...current, [field.key]: value }));
    setErrors((current) => ({ ...current, [field.key]: undefined }));
    setSaved(false);
  };

  const submit = async () => {
    const found = validateIdea(draft);
    if (Object.keys(found).length) {
      setErrors(found);
      setStep(found.title ? 1 : 0);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);
    setSaving(true);
    try {
      await createIdea(draft, controller.signal);
      setSuccess(true);
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === "TimeoutError";
      setErrors({ description: timedOut ? "The field took too long to respond. Try entering it again." : "The idea needs a little more signal before it can enter the field." });
    } finally {
      window.clearTimeout(timeout);
      setSaving(false);
    }
  };

  const next = () => {
    if (field.key === "title" && !draft.title.trim()) {
      setErrors((current) => ({ ...current, title: "Give this idea a working title." }));
      return;
    }
    if (step < fields.length - 1) setStep((current) => current + 1);
    else void submit();
  };

  if (success) {
    return <AppShell><div className="idea-success"><div className="success-core"><Check size={28} /></div><p className="eyebrow"><span className="signal-dot" /> Signal received</p><h1>{draft.title}<br /><em>is now in motion.</em></h1><p>Your idea has entered the pipeline. The next step is understanding what it could become.</p><div className="success-actions"><Link href="/dashboard" className="button button-primary">View the pipeline <ArrowRight size={16} /></Link><button className="text-link" onClick={() => { setSuccess(false); setStep(0); setDraft(emptyIdea); }}>Start another idea</button></div></div></AppShell>;
  }

  return <AppShell><div className="idea-page"><header className="idea-header"><Link href="/dashboard" className="back-link"><ArrowLeft size={15} /> Back to overview</Link><div className="idea-save-state">{saved ? <><Save size={13} /> Draft saved</> : "Saving…"}</div><button className="rover-trigger" onClick={() => setRoverOpen((open) => !open)}><Sparkles size={15} /> Rover</button></header><div className="idea-progress"><span>NEW IDEA</span><div>{fields.map((item, i) => <i key={item.key} className={i <= step ? "active" : ""} />)}</div><span>{String(step + 1).padStart(2, "0")} / 05</span></div><section className="idea-editor"><div className="idea-intro"><p className="eyebrow">{step === 0 ? "Start anywhere" : `Layer ${String(step + 1).padStart(2, "0")}`}</p><h1>{step === 0 ? <>What are you<br /><em>thinking about?</em></> : <>{field.label}<br /><em>let it take shape.</em></>}</h1><p>{step === 0 ? "There is no wrong way in. Give the unfinished thought a place to land." : field.hint}</p><button className="rover-inline" onClick={() => setRoverOpen(true)}><span>✦</span>{step === 0 ? "Rover is listening quietly" : "Ask Rover for a nudge"}<CircleHelp size={14} /></button></div><div className="idea-input-area"><label htmlFor={`idea-${field.key}`}>{field.label}</label>{field.key === "description" || field.key === "problem" ? <textarea id={`idea-${field.key}`} autoFocus value={draft[field.key]} onChange={(event) => update(event.target.value)} placeholder={field.placeholder} rows={5} /> : <input id={`idea-${field.key}`} autoFocus value={draft[field.key]} onChange={(event) => update(event.target.value)} placeholder={field.placeholder} />}{errors[field.key] && <span className="field-error">{errors[field.key]}</span>}<div className="idea-actions"><button className="button button-quiet" onClick={() => step > 0 && setStep((current) => current - 1)} disabled={step === 0}><ArrowLeft size={15} /> Previous</button><button className="button button-primary" onClick={next} disabled={saving}>{saving ? <><LoaderCircle size={15} className="spin" /> Saving…</> : <>{step === fields.length - 1 ? "Enter the field" : "Continue"} <ArrowRight size={15} /></>}</button></div></div></section></div>{roverOpen && <RoverPanel context={draft} onClose={() => setRoverOpen(false)} />}</AppShell>;
}
