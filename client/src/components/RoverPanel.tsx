import { ArrowRight, BrainCircuit, Clock3, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { IdeaDraft } from "../services/ideas";
import { askRover, getRoverSuggestions, RoverReply } from "../services/rover";

type Props = { context?: IdeaDraft; onClose: () => void };
export default function RoverPanel({ context, onClose }: Props) {
  const [reply, setReply] = useState<RoverReply | null>(null);
  const [loading, setLoading] = useState(false);
  const actions = getRoverSuggestions({ page: "rover", idea: context });
  const ask = async (prompt: string) => { setLoading(true); try { setReply(await askRover({ page: "rover", stage: "understand", idea: context }, prompt)); } finally { setLoading(false); } };
  return <aside className="rover-panel" aria-label="Rover assistant"><header><div className="rover-avatar"><Sparkles size={17} /></div><div><b>Rover</b><span><i /> Listening quietly</span></div><button onClick={onClose} aria-label="Close Rover"><X size={17} /></button></header><div className="rover-panel-body"><p className="eyebrow">{reply ? "A useful signal" : context?.title || context?.description ? "A little signal detected" : "No pressure"}</p><h3>{reply ? reply.message : context?.title || context?.description ? "There is something here." : "Start with the unfinished version."}</h3><p>{reply ? reply.nextAction : context?.title || context?.description ? "I can help you turn the first signal into a clearer question when you are ready." : "You do not need a pitch. A sentence, a frustration, or a strange connection is enough."}</p>{reply?.relatedSignal && <div className="rover-related-signal"><Search size={13} /><span>{reply.relatedSignal}</span></div>}<div className="rover-actions">{actions.map((action, i) => <button key={action} onClick={() => void ask(action)} disabled={loading}><span>{i === 0 ? <BrainCircuit size={14} /> : i === 1 ? <Search size={14} /> : <ArrowRight size={14} />}</span>{loading ? "Listening…" : action}<ArrowRight size={13} /></button>)}</div></div><footer><Clock3 size={12} /> Rover suggestions are contextual and optional</footer></aside>;
}
