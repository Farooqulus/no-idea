import { Bell, Compass, FolderKanban, Grid2X2, Lightbulb, LogOut, MessageSquare, Settings, Sparkles, Users, FileSignature, UserRound, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useRequireAuth } from "../App";

const primary = [
  { label: "Overview", href: "/dashboard", icon: Grid2X2 },
  { label: "My Ideas", href: "/ideas", icon: Lightbulb },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Developers", href: "/developers", icon: Users },
  { label: "Workspaces", href: "/workspaces", icon: FolderKanban },
  { label: "Agreements", href: "/agreements", icon: FileSignature },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const ready = useRequireAuth(); const [location, navigate] = useLocation(); const [collapsed, setCollapsed] = useState(false); const [mobileOpen, setMobileOpen] = useState(false);
  if (!ready) return <div className="loading-screen"><span className="signal-dot" /> Finding your field…</div>;
  const signOut = () => { localStorage.removeItem("noidea-session"); navigate("/"); };
  return <div className={`app-shell ${collapsed ? "shell-collapsed" : ""}`}>
      <div className={`mobile-scrim ${mobileOpen ? "visible" : ""}`} onClick={() => setMobileOpen(false)} aria-hidden="true" />
    <aside className={`app-rail ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="rail-top"><Link href="/" className="wordmark"><span className="mark">◌</span><span className="rail-wordmark">NO IDEA</span></Link><button className="rail-collapse" onClick={() => mobileOpen ? setMobileOpen(false) : setCollapsed(!collapsed)} aria-label={mobileOpen ? "Close navigation" : "Toggle sidebar"}>{collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}</button></div>
      <div className="rail-context"><span className="context-pulse" /> <span>FIELD / 01</span></div>
      <nav id="primary-navigation" className="app-nav" aria-label="Primary navigation">{primary.map(({ label, href, icon: Icon }) => <Link key={label} href={href} className={`app-nav-item ${location === href || (label === "My Ideas" && location.startsWith("/ideas")) || (label === "Developers" && location.startsWith("/developers")) || (label === "Workspaces" && location.startsWith("/workspaces")) ? "active" : ""}`} onClick={() => setMobileOpen(false)}><Icon size={16} /><span>{label}</span>{label === "Notifications" && <b>3</b>}</Link>)}</nav>
      <div className="rail-bottom"><div className="rail-divider" /><Link href="/rover" className="app-nav-item rover-nav"><Sparkles size={16} /><span>Rover AI</span><i /></Link><Link href="/profile" className="app-nav-item"><UserRound size={16} /><span>Profile</span></Link><Link href="/settings" className="app-nav-item"><Settings size={16} /><span>Settings</span></Link><button className="app-nav-item signout" onClick={signOut}><LogOut size={16} /><span>Sign out</span></button></div>
    </aside>
    <main className="app-main"><header className="mobile-header"><button onClick={() => setMobileOpen(true)} aria-label="Open navigation" aria-expanded={mobileOpen} aria-controls="primary-navigation"><PanelLeftOpen size={18} /></button><Link href="/" className="wordmark"><span className="mark">◌</span> NO IDEA</Link><Link href="/notifications" aria-label="Notifications"><Bell size={17} /></Link></header>{children}</main>
  </div>;
}
