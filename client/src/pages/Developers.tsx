import { ArrowDownAZ, ArrowRight, Filter, MapPin, Search, Sparkles, SlidersHorizontal, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import AppShell from "../components/AppShell";
import { developers } from "../services/collaboration";

const filters = ["All signals", "Product", "AI & data", "Mobile"];
const skillOptions = ["Any skill", "React", "TypeScript", "Python", "AI tooling", "React Native", "Research"];
const availabilityOptions = ["Any availability", "Open now", "October", "Conversation"];
const regionOptions = ["Every region", "Asia Pacific", "Europe", "Africa"];

export default function Developers() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All signals");
  const [skill, setSkill] = useState("Any skill");
  const [availability, setAvailability] = useState("Any availability");
  const [region, setRegion] = useState("Every region");
  const [minimumMatch, setMinimumMatch] = useState(0);
  const [sort, setSort] = useState("match-desc");
  const [advanced, setAdvanced] = useState(false);

  const visible = useMemo(() => developers.filter((developer) => {
    const haystack = `${developer.name} ${developer.role} ${developer.skills.join(" ")}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    const matchesFilter = filter === "All signals" || (filter === "Product" && developer.skills.includes("Product")) || (filter === "AI & data" && developer.skills.some((item) => item.toLowerCase().includes("ai") || item.toLowerCase().includes("data"))) || (filter === "Mobile" && developer.skills.some((item) => item.toLowerCase().includes("mobile") || item.toLowerCase().includes("native")));
    const matchesSkill = skill === "Any skill" || developer.skills.includes(skill);
    const matchesAvailability = availability === "Any availability" || (availability === "Open now" && developer.availability.toLowerCase().includes("open")) || (availability === "October" && developer.availability.includes("October")) || (availability === "Conversation" && developer.availability.includes("conversation"));
    const matchesRegion = region === "Every region" || (region === "Asia Pacific" && developer.location.includes("Singapore")) || (region === "Europe" && developer.location.match(/London|Milan/)) || (region === "Africa" && developer.location.includes("Lagos"));
    return matchesQuery && matchesFilter && matchesSkill && matchesAvailability && matchesRegion && developer.match >= minimumMatch;
  }).sort((a, b) => sort === "match-desc" ? b.match - a.match : sort === "match-asc" ? a.match - b.match : a.name.localeCompare(b.name)), [availability, filter, minimumMatch, query, region, skill, sort]);

  return <AppShell><div className="discovery-page"><header className="page-topline"><div><p className="eyebrow"><span className="signal-dot" /> People around the idea</p><h1>Find the right<br /><em>kind of curious.</em></h1><p className="page-lede">Rover has translated your early signal into a constellation of people who might help it move.</p></div><div className="discovery-count"><Users size={17} /><strong>{visible.length}</strong><span>nearby signals</span></div></header><div className="discovery-toolbar"><label className="discovery-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills, people, or disciplines" aria-label="Search developers" /></label><div className="discovery-actions"><button className={`filter-toggle ${advanced ? "selected" : ""}`} onClick={() => setAdvanced((open) => !open)}><SlidersHorizontal size={14} /> Advanced filters</button><label className="sort-control"><ArrowDownAZ size={14} /><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort developers"><option value="match-desc">Best match</option><option value="match-asc">Lowest match</option><option value="name">Name A–Z</option></select></label></div></div><div className="filter-pills" role="group" aria-label="Filter developers">{filters.map((item) => <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>{advanced && <section className="advanced-filter-panel" aria-label="Advanced developer filters"><div className="advanced-filter-heading"><div><p className="eyebrow"><Filter size={12} /> Refine the constellation</p><span>Use several signals together to narrow the people around this idea.</span></div><button onClick={() => { setSkill("Any skill"); setAvailability("Any availability"); setRegion("Every region"); setMinimumMatch(0); }}>Clear all</button></div><label>Skill<select value={skill} onChange={(event) => setSkill(event.target.value)}>{skillOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label>Availability<select value={availability} onChange={(event) => setAvailability(event.target.value)}>{availabilityOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label>Region<select value={region} onChange={(event) => setRegion(event.target.value)}>{regionOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label className="match-range">Minimum match <output>{minimumMatch}%</output><input type="range" min="0" max="95" step="5" value={minimumMatch} onChange={(event) => setMinimumMatch(Number(event.target.value))} /></label></section>}<section className="developer-grid" aria-label="Developer recommendations">{visible.map((developer) => <article className="developer-card" key={developer.id}><div className={`developer-avatar ${developer.accent}`}>{developer.initials}</div><div className="developer-card-top"><span className="match-label"><Sparkles size={12} /> {developer.match}% match</span><span className="availability-dot" /></div><h2>{developer.name}</h2><p className="developer-role">{developer.role}</p><p className="developer-bio">{developer.bio}</p><div className="developer-location"><MapPin size={13} /> {developer.location}</div><div className="skill-list">{developer.skills.map((item) => <span key={item}>{item}</span>)}</div><Link href={`/developers/${developer.id}`} className="developer-card-link">View profile <ArrowRight size={14} /></Link></article>)}{visible.length === 0 && <div className="discovery-empty"><Sparkles size={20} /><h2>No close signals yet.</h2><p>Try a broader search or lower the match threshold.</p></div>}</section></div></AppShell>;
}
