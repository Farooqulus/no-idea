export type RequestStatus = "idle" | "pending" | "accepted" | "rejected" | "cancelled";
export type CollaborationRequest = {
  developerId: string;
  developerName: string;
  status: RequestStatus;
  createdAt?: string;
  updatedAt?: string;
};

const REQUEST_KEY = "noidea-collaboration-request";
const defaultRequest: CollaborationRequest = { developerId: "maya-chen", developerName: "Maya Chen", status: "idle" };

export function loadCollaborationRequest(): CollaborationRequest {
  try { return { ...defaultRequest, ...JSON.parse(localStorage.getItem(REQUEST_KEY) || "{}") }; } catch { return defaultRequest; }
}

function save(status: RequestStatus, current = loadCollaborationRequest()) {
  const next = { ...current, status, updatedAt: new Date().toISOString(), ...(status === "pending" ? { createdAt: current.createdAt || new Date().toISOString() } : {}) };
  localStorage.setItem(REQUEST_KEY, JSON.stringify(next));
  return next;
}

export function sendCollaborationRequest(developerId: string, developerName: string) { return save("pending", { ...loadCollaborationRequest(), developerId, developerName }); }
export function cancelCollaborationRequest() { return save("cancelled"); }
export function acceptCollaborationRequest() { return save("accepted"); }
export function rejectCollaborationRequest() { return save("rejected"); }
export function resetCollaborationRequest() { localStorage.removeItem(REQUEST_KEY); return defaultRequest; }
