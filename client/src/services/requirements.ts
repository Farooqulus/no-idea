export type RequirementStatus = "Approved" | "In review" | "Open";
export type Requirement = { id: string; title: string; status: RequirementStatus; owner: string; source?: string };

const REQUIREMENTS_KEY = "noidea-requirements";
const defaults: Requirement[] = [
  { id: "requirement-1", title: "Share a repair request with the neighborhood", status: "Approved", owner: "You", source: "Project understanding" },
  { id: "requirement-2", title: "Offer and discover tools available to lend", status: "In review", owner: "Maya", source: "Collaboration thread" },
  { id: "requirement-3", title: "Keep the first interaction lightweight on mobile", status: "Open", owner: "Team", source: "MVP constraint" },
];

export async function getRequirements(): Promise<Requirement[]> {
  try { return JSON.parse(localStorage.getItem(REQUIREMENTS_KEY) || "null") || defaults; } catch { return defaults; }
}
export async function saveRequirement(requirement: Requirement): Promise<Requirement> {
  const current = await getRequirements();
  const next = current.some((item) => item.id === requirement.id) ? current.map((item) => item.id === requirement.id ? requirement : item) : [...current, requirement];
  localStorage.setItem(REQUIREMENTS_KEY, JSON.stringify(next));
  return requirement;
}
export async function updateRequirementStatus(id: string, status: RequirementStatus): Promise<Requirement | null> {
  const current = await getRequirements();
  const found = current.find((item) => item.id === id);
  if (!found) return null;
  return saveRequirement({ ...found, status });
}
export function validateRequirementTitle(title: string) { return title.trim().length >= 8 ? "" : "Describe the requirement in at least 8 characters."; }
