import { IdeaDraft } from "./ideas";

export type RoverContext = { page?: string; stage?: string; idea?: IdeaDraft | null; requirements?: string[] };
export type RoverReply = { message: string; nextAction: string; relatedSignal?: string };
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function askRover(context: RoverContext, message: string): Promise<RoverReply> {
  await wait(420);
  const hasIdea = Boolean(context.idea?.title || context.idea?.description);
  if (message.toLowerCase().includes("similar")) return { message: "I can surface related signals without treating them as a verdict.", nextAction: "Compare the neighboring ideas and keep the useful tension.", relatedSignal: "Borrowing becomes easier when availability is visible." };
  if (!hasIdea) return { message: "Start with the unfinished version. A frustration, observation, or strange connection is enough.", nextAction: "Write one sentence about what feels unresolved." };
  if (message.toLowerCase().includes("tension") || message.toLowerCase().includes("clarify")) return { message: "The signal is present, but the tension is still broad.", nextAction: "Name who feels the problem most often and what changes for them." };
  return { message: `I’m holding onto “${context.idea?.title || "this idea"}”. Let’s make the next question smaller rather than jumping to a solution.`, nextAction: "Describe the first useful outcome someone should experience." };
}

export function getRoverSuggestions(context: RoverContext) {
  return context.idea?.title || context.idea?.description ? ["Help me find the tension", "Show similar ideas", "What should I clarify?"] : ["Give me a place to start", "How does this work?", "Show an example idea"];
}
