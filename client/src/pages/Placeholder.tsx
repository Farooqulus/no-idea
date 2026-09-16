import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";
import AppShell from "../components/AppShell";
export default function Placeholder({ title }: { title: string }) { return <AppShell><div className="placeholder-page"><Sparkles size={24} /><p className="eyebrow">Coming into focus</p><h1>{title}<br /><em>is next.</em></h1><p>This part of the field is being shaped now. Your navigation is ready for it.</p><Link href="/dashboard" className="text-link"><ArrowLeft size={15} /> Return to overview</Link></div></AppShell>; }
