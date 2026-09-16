export type NotificationKind = "collaboration" | "workspace" | "rover" | "system";
export type Notification = { id: string; kind: NotificationKind; title: string; detail: string; time: string; read: boolean };

const NOTIFICATIONS_KEY = "noidea-notifications";
const defaults: Notification[] = [
  { id: "notification-1", kind: "collaboration", title: "Maya responded to the project signal", detail: "Your collaboration request is ready for review.", time: "12 min ago", read: false },
  { id: "notification-2", kind: "workspace", title: "A requirement needs attention", detail: "The mobile interaction constraint is still open.", time: "Yesterday", read: false },
  { id: "notification-3", kind: "rover", title: "Rover found a useful question", detail: "What would make someone return to the repair circle?", time: "Yesterday", read: true },
];

export async function getNotifications(): Promise<Notification[]> {
  try { return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "null") || defaults; } catch { return defaults; }
}
export async function markNotificationRead(id: string): Promise<Notification[]> {
  const next = (await getNotifications()).map((item) => item.id === id ? { ...item, read: true } : item);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
  return next;
}
export async function markAllNotificationsRead(): Promise<Notification[]> {
  const next = (await getNotifications()).map((item) => ({ ...item, read: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
  return next;
}
export async function getUnreadNotificationCount() { return (await getNotifications()).filter((item) => !item.read).length; }
