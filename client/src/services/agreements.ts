export type AgreementState = {
  status: "pending" | "accepted";
  acceptedAt?: string;
  project: string;
  parties: string[];
  scope: string;
  termsVersion: string;
};

const AGREEMENT_KEY = "noidea-agreement";
const defaultAgreement: AgreementState = {
  status: "pending",
  project: "Neighborhood repair circles",
  parties: ["You", "Maya Chen"],
  scope: "Prototype the first tool-lending and repair-circle experience together.",
  termsVersion: "NO IDEA collaboration terms v1.0",
};

export function loadAgreement(): AgreementState {
  try { return { ...defaultAgreement, ...JSON.parse(localStorage.getItem(AGREEMENT_KEY) || "{}") }; } catch { return defaultAgreement; }
}

export function hasAcceptedAgreement() { return loadAgreement().status === "accepted"; }

export async function acceptAgreement(): Promise<AgreementState> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const accepted = { ...defaultAgreement, status: "accepted" as const, acceptedAt: new Date().toISOString() };
  localStorage.setItem(AGREEMENT_KEY, JSON.stringify(accepted));
  return accepted;
}
