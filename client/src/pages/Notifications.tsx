import { Bell, Check, CircleAlert, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { getNotifications, markAllNotificationsRead, markNotificationRead, Notification } from "../services/notifications";

const icons = { collaboration: MessageCircle, workspace: CircleAlert, rover: Sparkles, system: Bell };
export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getNotifications().then((next) => { setItems(next); setLoading(false); }); }, []);
  const unread = items.filter((item) => !item.read).length;
  return <AppShell><div className="notifications-page"><header className="page-topline"><div><p className="eyebrow"><Bell size={12} /> Field signals</p><h1>Keep the thread<br /><em>within reach.</em></h1><p className="page-lede">The useful nudges from your ideas, collaborators, workspace, and Rover.</p></div><button className="button button-quiet" onClick={() => { void markAllNotificationsRead().then(setItems); }} disabled={!unread}>{unread ? `Mark ${unread} as read` : "All caught up"}</button></header><section className="notification-list">{loading ? <div className="service-state">Loading notifications…</div> : items.length === 0 ? <div className="service-state">Nothing has arrived yet.</div> : items.map((item) => { const Icon = icons[item.kind]; return <article className={`notification-row ${item.read ? "read" : "unread"}`} key={item.id}><span className="notification-icon"><Icon size={15} /></span><div><p className="notification-kind">{item.kind}</p><h2>{item.title}</h2><p>{item.detail}</p><small>{item.time}</small></div>{item.read ? <Check size={14} className="notification-check" /> : <button className="notification-read" onClick={() => { void markNotificationRead(item.id).then(setItems); }}>Mark read</button>}</article>; })}</section></div></AppShell>;
}
