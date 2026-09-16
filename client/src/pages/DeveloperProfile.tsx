import { ArrowLeft, ArrowRight, Check, Clock3, MapPin, MessageCircle, RotateCcw, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Link, useRoute } from "wouter";
import AppShell from "../components/AppShell";
import { findDeveloper } from "../services/collaboration";
import { acceptCollaborationRequest, cancelCollaborationRequest, loadCollaborationRequest, rejectCollaborationRequest, resetCollaborationRequest, sendCollaborationRequest, RequestStatus } from "../services/requests";

const statusCopy: Record<RequestStatus, string> = { idle: "Not requested", pending: "Awaiting response", accepted: "Collaboration accepted", rejected: "Request declined", cancelled: "Request cancelled" };
export default function DeveloperProfile() {
  const [, params] = useRoute("/developers/:id");
  const developer = findDeveloper(params?.id || "");
  const [request, setRequest] = useState(() => loadCollaborationRequest());
  const status = request.developerId === developer.id ? request.status : "idle";
  const update = (next: RequestStatus) => { const result = next === "pending" ? sendCollaborationRequest(developer.id, developer.name) : next === "accepted" ? acceptCollaborationRequest() : next === "rejected" ? rejectCollaborationRequest() : next === "cancelled" ? cancelCollaborationRequest() : resetCollaborationRequest(); setRequest(result); };
  return <AppShell><div className="profile-page"><Link href="/developers" className="back-link"><ArrowLeft size={15} /> Back to discovery</Link><section className="profile-hero"><div className={`profile-avatar ${developer.accent}`}>{developer.initials}</div><div className="profile-identity"><p className="eyebrow"><span className="signal-dot" /> Developer profile</p><h1>{developer.name}</h1><p className="profile-role">{developer.role}</p><div className="profile-location"><MapPin size={13} /> {developer.location}</div></div><div className="profile-actions"><RequestAction status={status} onUpdate={update} /><Link href="/rover" className="button button-quiet"><Sparkles size={15} /> Ask Rover</Link></div></section><section className="profile-body"><div className="profile-main"><p className="eyebrow">A little context</p><h2>{developer.bio}</h2><div className="profile-section"><h3>Signals and skills</h3><div className="profile-skills">{developer.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="profile-section"><h3>How this could fit</h3><p>Based on the current idea signal, {developer.name.split(" ")[0]} brings a useful balance of execution and perspective. A first conversation could test the shape before either of you commits to the full build.</p></div></div><aside className="profile-aside"><div className="fit-card"><span className="fit-ring">{developer.match}%</span><p className="eyebrow">Rover's fit signal</p><h3>Strong overlap</h3><p>Shared interest in practical tools that help people coordinate and act.</p></div><div className="profile-availability"><Clock3 size={15} /><div><b>{developer.availability}</b><span>Usually replies within 2 days</span></div></div><div className={`request-state-card ${status}`}><span>{statusCopy[status]}</span>{status === "pending" && <small>Your request is in the developer's queue.</small>}{status === "accepted" && <small>Review the agreement before entering the workspace.</small>}{status === "rejected" && <small>You can revise the idea or try another collaborator.</small>}</div>{status === "accepted" && <Link href="/agreements" className="text-link">Review the agreement <ArrowRight size={15} /></Link>}</aside></section></div></AppShell>;
}

function RequestAction({ status, onUpdate }: { status: RequestStatus; onUpdate: (status: RequestStatus) => void }) {
  if (status === "pending") return <button className="button button-quiet" onClick={() => onUpdate("cancelled")}><X size={15} /> Cancel request</button>;
  if (status === "accepted") return <span className="request-sent"><Check size={15} /> Accepted</span>;
  if (status === "rejected") return <button className="button button-primary" onClick={() => onUpdate("pending")}><RotateCcw size={15} /> Send again</button>;
  if (status === "cancelled") return <button className="button button-primary" onClick={() => onUpdate("pending")}><MessageCircle size={15} /> Request collaboration</button>;
  return <button className="button button-primary" onClick={() => onUpdate("pending")}><MessageCircle size={15} /> Request collaboration</button>;
}
