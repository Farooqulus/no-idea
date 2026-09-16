export type Developer = {
  id: string;
  name: string;
  initials: string;
  role: string;
  location: string;
  availability: string;
  bio: string;
  skills: string[];
  match: number;
  accent: "amber" | "ice" | "green";
};

export type WorkspaceTask = {
  id: string;
  title: string;
  owner: string;
  due: string;
  done: boolean;
  priority: "now" | "next" | "later";
};

export type WorkspaceFile = {
  name: string;
  type: string;
  size: string;
  updated: string;
};

export type WorkspaceMessage = {
  id: string;
  author: string;
  initials: string;
  text: string;
  timestamp: string;
  tone: "amber" | "ice" | "green";
};

export const developers: Developer[] = [
  { id: "maya-chen", name: "Maya Chen", initials: "MC", role: "Product engineer", location: "Singapore · UTC+8", availability: "Open to one more project", bio: "Builds calm, useful systems for communities and the people who keep them moving.", skills: ["React", "TypeScript", "Systems thinking"], match: 94, accent: "amber" },
  { id: "samir-khan", name: "Samir Khan", initials: "SK", role: "Civic technologist", location: "London · UTC+0", availability: "Available in October", bio: "Turns complex public-facing workflows into tools people can actually understand.", skills: ["Python", "Data products", "Research"], match: 88, accent: "ice" },
  { id: "elena-rossi", name: "Elena Rossi", initials: "ER", role: "Full-stack developer", location: "Milan · UTC+1", availability: "Open to collaboration", bio: "Ships thoughtful MVPs at the intersection of climate, culture, and participation.", skills: ["Next.js", "AI tooling", "UX prototyping"], match: 82, accent: "green" },
  { id: "jules-okafor", name: "Jules Okafor", initials: "JO", role: "Mobile engineer", location: "Lagos · UTC+1", availability: "Open to a conversation", bio: "Designs mobile-first experiences that make small actions feel possible and shared.", skills: ["React Native", "Offline-first", "Product"], match: 79, accent: "amber" },
];

const defaultTasks: WorkspaceTask[] = [
  { id: "task-1", title: "Clarify the first repair-circle use case", owner: "You", due: "Today", done: false, priority: "now" },
  { id: "task-2", title: "Map the tool-lending flow", owner: "Maya", due: "Tomorrow", done: false, priority: "next" },
  { id: "task-3", title: "Collect five neighborhood interviews", owner: "You", due: "Fri, 18 Sep", done: true, priority: "next" },
  { id: "task-4", title: "Draft the first mobile wireframe", owner: "Maya", due: "Mon, 21 Sep", done: false, priority: "later" },
];

const defaultFiles: WorkspaceFile[] = [
  { name: "idea-brief.md", type: "Brief", size: "8 KB", updated: "12 min ago" },
  { name: "repair-circle-notes.pdf", type: "Research", size: "1.4 MB", updated: "Yesterday" },
  { name: "flow-sketch-v1.fig", type: "Design", size: "2.8 MB", updated: "Yesterday" },
];

const defaultMessages: WorkspaceMessage[] = [
  { id: "message-1", author: "Maya Chen", initials: "MC", text: "I can take the first pass at the tool-lending flow. The neighborhood context is a strong starting point.", timestamp: "10:42", tone: "amber" },
  { id: "message-2", author: "You", initials: "A", text: "Perfect. I will focus on the interview questions and what makes someone return.", timestamp: "10:51", tone: "ice" },
];

const TASKS_KEY = "noidea-workspace-tasks";
export function loadWorkspaceTasks(): WorkspaceTask[] {
  try { return JSON.parse(localStorage.getItem(TASKS_KEY) || "null") || defaultTasks; } catch { return defaultTasks; }
}
export function saveWorkspaceTasks(tasks: WorkspaceTask[]) { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); }
export function loadWorkspaceFiles() { return defaultFiles; }
export function loadWorkspaceMessages() { return defaultMessages; }
export function findDeveloper(id: string) { return developers.find((developer) => developer.id === id) || developers[0]; }
