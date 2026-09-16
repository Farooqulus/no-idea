export type SimilarIdea = { id: string; title: string; insight: string; similarity: number; domain: string };

const relatedIdeas: SimilarIdea[] = [
  { id: "similar-1", title: "Tool libraries for apartment blocks", insight: "Trust grows when borrowing is visible and local.", similarity: 84, domain: "Social impact" },
  { id: "similar-2", title: "Repair circles for shared neighborhoods", insight: "A small recurring ritual can make contribution feel natural.", similarity: 77, domain: "Civic technology" },
  { id: "similar-3", title: "Borrowing networks for underused equipment", insight: "Availability matters as much as discovery.", similarity: 69, domain: "Circular economy" },
];

export async function getSimilarIdeas(_ideaId?: string): Promise<SimilarIdea[]> {
  // The UI consumes this contract without knowing whether results come from embeddings or vector search.
  return relatedIdeas;
}
