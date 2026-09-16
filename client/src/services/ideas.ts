export type IdeaDraft = { title: string; description: string; problem: string; targetUsers: string; domain: string; updatedAt?: string };
export type IdeaRecord = IdeaDraft & { id: string; stage: "IDEA"; progress: number; createdAt: string };

const KEY = "noidea-draft";
const SAVED_KEY = "noidea-ideas";
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const emptyIdea: IdeaDraft = { title: "", description: "", problem: "", targetUsers: "", domain: "" };
export function loadDraft(): IdeaDraft { try { return { ...emptyIdea, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return emptyIdea; } }
export function saveDraft(draft: IdeaDraft) { localStorage.setItem(KEY, JSON.stringify({ ...draft, updatedAt: new Date().toISOString() })); }
export function validateIdea(draft: IdeaDraft) { const errors: Partial<Record<keyof IdeaDraft, string>> = {}; if (!draft.title.trim()) errors.title = "Give this idea a working title."; if (draft.description.trim().length < 20) errors.description = "Add a little more signal — 20 characters is enough."; return errors; }
export async function createIdea(draft: IdeaDraft, signal?: AbortSignal): Promise<IdeaRecord> { await wait(650); if (signal?.aborted) throw new DOMException("Timed out", "TimeoutError"); const errors = validateIdea(draft); if (Object.keys(errors).length) throw new Error("Please complete the highlighted fields."); const idea: IdeaRecord = { ...draft, id: `idea-${Date.now()}`, stage: "IDEA", progress: 12, createdAt: new Date().toISOString() }; localStorage.setItem(SAVED_KEY, JSON.stringify(idea)); localStorage.removeItem(KEY); return idea; }
export function loadSavedIdea(): IdeaRecord | null { try { const value = localStorage.getItem(SAVED_KEY); return value ? JSON.parse(value) : null; } catch { return null; } }
