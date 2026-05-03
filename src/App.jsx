import { useState, useEffect, useRef, useCallback } from "react";

const NAV_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shivabasava-matur/", icon: "in" },
  { label: "GitHub",   href: "https://github.com/ShivabasavaM",                icon: "gh" },
  { label: "Mail",     href: "mailto:shivabasavamatur@gmail.com",               icon: "✉"  },
  { label: "Contact",  href: null, icon: "◎", isContact: true },
];

const ABOUT_SENTENCES = [
  "Hi, I’m Shivabasava — an engineer who enjoys building systems that solve real-world problems by understanding data and turning it into something useful.",
  "I’m particularly interested in how ideas evolve from simple experiments into reliable, scalable solutions that work in practice.",
  "Most of what I build comes from curiosity — exploring how things work, where they break, and how they can be improved — feel free to connect, I’d be happy to catch up.",
  "If you want to dive deeper into my work, my AI assistant is available at the bottom of the page to answer your questions directly."
];

const PROJECTS = [
  {
    id: "aegis", 
    title: "Aegis-Audit", 
    subtitle: "Agentic Legal Compliance Engine", 
    color: "#00ffb4",
    desc: "A stateless, zero-data-retention compliance auditor utilizing a decoupled React/FastAPI architecture and Agentic RAG for 8-pillar statutory gap analysis.",
    github: "https://github.com/ShivabasavaM/Aegis-Audit-Agentic-RAG",
    metrics: [
      { label: "Data Retention", value: "Zero" }, 
      { label: "Architecture", value: "Decoupled" }, 
      { label: "Ingestion", value: "LlamaParse" }
    ],
    points: [
      "Architected a stateless microservices backend (FastAPI) and responsive SPA frontend (React/Tailwind), entirely eliminating previous local main-thread locking limitations.",
      "Engineered a zero-data-retention vector pipeline utilizing LlamaParse for complex PDF layout extraction and Pinecone with ephemeral session namespaces that automatically scrub upon session termination.",
      "Designed an agentic reasoning loop (Retrieve → Verify → Synthesize) powered by Gemini 2.5 Flash, paired with local HuggingFace embeddings to optimize cloud costs and entirely bypass API rate limits."
    ],
    tags: ["React", "FastAPI", "Pinecone", "LlamaParse", "Gemini 2.5 Flash", "Agentic RAG"],
  },
  {
    id: "oxguard", title: "0xGuard NIDS", subtitle: "Network Anomaly Detection Engine", color: "#ff6b35",
    desc: "Production-grade anomaly detection filtering complex network traffic with a locked 93% precision threshold.",
    github: "https://github.com/ShivabasavaM/0xGuard-Cloud-NIDS",
    metrics: [{ label: "Precision", value: "93%" }, { label: "Complexity", value: "O(n log n)" }, { label: "Infra", value: "EC2" }],
    points: [
      "Trained an unsupervised Isolation Forest model chosen for its O(n log n) time complexity to process massive tabular datasets without deep learning overhead.",
      "Engineered a validation script to dynamically scan the Precision-Recall curve and lock the decision threshold at exactly 93% precision — specifically mitigating alert fatigue for SOC analysts.",
      "Deployed as a stateless FastAPI container on AWS EC2 for rapid horizontal scalability.",
    ],
    tags: ["Isolation Forest", "FastAPI", "Docker", "AWS EC2"],
  },
  {
    id: "nutri", title: "Metabolic Health Coach", subtitle: "Biometric Orchestration Pipeline", color: "#a78bfa",
    desc: "Multimodal LLM routing with real-time Fitbit OAuth2 integration and vision-based calorie extraction.",
    github: "https://github.com/ShivabasavaM/Metabolic-Health-Coach",
    metrics: [{ label: "Auth", value: "OAuth2" }, { label: "Vision", value: "Flash 2.0" }, { label: "Uptime", value: "Zero" }],
    points: [
      "Integrated Fitbit's OAuth2 API to continuously ingest Calories Burned and Sleep Duration metrics to calculate a dynamic daily metabolic state.",
      "Architected custom middleware that intercepts API calls, checks expiry timestamps, and autonomously fetches/persists new cryptographic tokens for zero-downtime background syncing.",
      "Utilized Gemini 2.0 Flash's vision capabilities to process food images, extracting caloric estimates to recalculate remaining daily allowance.",
    ],
    tags: ["LangGraph", "OAuth 2.0", "Fitbit API", "SQLite"],
  },
  {
    id: "rescue", title: "Rescue AI Triage", subtitle: "Computer Vision Triage Microservice", color: "#f59e0b",
    desc: "Fine-tuned MobileNetV3 classifying canine injury severity on memory-constrained AWS Free Tier infrastructure.",
    github: "https://github.com/ShivabasavaM/Rescue-Ai-Triage",
    metrics: [{ label: "Arch", value: "MobileV3" }, { label: "Swap RAM", value: "2 GB" }, { label: "OOM", value: "0 crashes" }],
    points: [
      "Fine-tuned a PyTorch MobileNetV3 architecture (optimized for CPU deployment) to classify canine injuries and generate severity confidence scores.",
      "Bypassed AWS Free Tier hardware limitations (1 GB RAM) by configuring 2 GB of Linux Swap Memory as emergency RAM — preventing OOM crashes.",
      "Utilized torch.no_grad() during inference to disable gradient calculation, significantly reducing memory consumption.",
    ],
    tags: ["PyTorch", "MobileNetV3", "FastAPI", "Linux"],
  },
];

const SKILLS_DATA = [
  { label: "AI / ML",     items: ["Langchain","LangGraph", "Agentic Workflows", "RAG", "PyTorch", "Scikit-learn", "Fine-tuning", "Prompt Engineering"] },
  { label: "Backend",     items: ["FastAPI", "Python", "SQL", "Microservices", "REST APIs","Postman"] },
  { label: "MLOps",       items: ["Docker", "AWS EC2", "CI/CD", "Model Monitoring", "Pinecone", "ChromaDB"] },
  { label: "Engineering", items: ["System Design Principles", "Data Structures", "OOP", "Git", "Linux"] },
];

const CERTS = [
  { title: "Azure Data Fundamentals", issuer: "Microsoft Certified", tags: ["Azure", "Data"], href: "https://learn.microsoft.com/en-us/users/shivabasavamatur-9193/credentials/fd685e272368c255" },
  { title: "Azure AI Fundamentals",   issuer: "Microsoft Certified", tags: ["Azure", "AI"],   href: "https://learn.microsoft.com/en-us/users/shivabasavamatur-9193/credentials/391a87eba54c8be" },
  { title: "Rocking System Design",   issuer: "Udemy",               tags: ["System Design"], href: "https://www.udemy.com/certificate/UC-dacd18fb-0645-494a-b884-a42a2a2df6ed/" },
  { title: "Best Project Award 2025 🏆", issuer: "DSCE Open Day — 1st Place", tags: ["Award"] },
  { title: "2× Ideation Pitching Finalist", issuer: "College Recognition",      tags: ["Award"] },
];

const EXPERIENCE = [
  {
    role: "SDE-I(ServiceNow)", company: "Verizon India", period: "Jul 2025 – Present",
    points: [
      "Developed a supervised binary classification model on 29K historical ITIL records — achieving 92% True Positive Rate for incident detection.",
      "Integrated a real-time predictive symptom recommendation model across 12 routing points to streamline user submissions.",
      "Architected a reusable, scalable, low-latency async REST API framework based on event-driven architecture with secure authentication for integration across multiple systems.",
      "Automated zero-touch provisioning workflows — eliminated ~12 hours of manual effort per cycle."
    ],
    tags: ["ML", "NLP", "Event-Driven", "Automation"],
  },
  {
    role: "SDE Intern", company: "Verizon India", period: "Jan – Jul 2025",
    points: [
      "Executed NLP clustering on 9K virtual incident records to extract 196 refined utterances, significantly enhancing chatbot accuracy in mapping the right intents.",
      "Designed and implemented a POC assignment group prediction model to classify incoming Incident records and enable agents to route incidents to the appropriate queues accurately and efficiently."
    ],
    tags: ["NLP", "ML", "Agile"],
  },
  {
    role: "ML Intern", company: "SP4 Ameya Innovation Labs", period: "Sep – Dec 2024",
    points: [
      "Conducted research-driven implementation of a photonic crystal–based drug detection approach by simulating ring resonators in OptiFDTD, generating synthetic high-dimensional optical transmission spectra for analysis.",
      "Translated research findings into a working pipeline by analyzing the generated data and applying Euclidean distance–based methods to classify drug types; built a Streamlit interface to demonstrate the end-to-end workflow.",
      "Contributed to a Foot Pressure Analyzer project, and designing an application wireframe to design and develop the user interface."
    ],
    tags: ["ML", "Photonics", "Streamlit"],
  },
];

const VOLUNTEERING = [
  {
    role: "Team Lead", org: "Mudita — Social Responsibility Cell",
    points: [
      "Worked alongside a diverse team to coordinate social initiatives and sustainability-focused activities across multiple sub-teams.",
      "Contributed to organizing initiatives such as collection drives, awareness programs, and efforts promoting sustainable practices during campus events.",
      "Collaborated with volunteers to support community outreach, including awareness campaigns and initiatives focused on social and environmental impact."
    ],
    tags: ["Jun 2024 – May 2025", "Social Services"],
  },
  {
    role: "Accounts Lead", org: "Mudita",
    points: [
      "Handled budgeting and financial planning for events over two years, ensuring resources were used effectively and responsibly.",
      "Worked closely with teams to align financial decisions with event needs and support smooth execution of activities.",
      "Guided and supported a small team in managing budgeting, procurement, and coordination for various initiatives."
    ],
    tags: ["May 2023 – Jun 2024", "Finance"],
  },
  {
    role: "Core member", org: "Aventus 2.0 & Anokhya",
    points: [
      "Core member of the organizing committee for a national-level AI Hackathon and Anokhya Tech Fest, contributing to end-to-end planning and execution.",
      "Secured sponsorships and collaborated with multiple clubs and external partners, ensuring smooth coordination, clear communication, and seamless financial transactions.",
      "Played a key role in successfully launching Anokhya as a first-time event, executing it efficiently and setting a strong benchmark for future editions."
    ],
    tags: ["Leadership", "Hackathon"],
  },
];

const QUICK_METRICS = [
  { value: 4,  suffix: "+",  label: "Production Systems" },
  { value: 92, suffix: "%",  label: "Model TPR @ Verizon" },
  { value: 93, suffix: "%",  label: "Precision (0xGuard)" },
  { value: 29, suffix: "K",  label: "ITIL Records Trained" },
  { value: 12, suffix: "h",  label: "Manual Work Automated" },
];

const SECTION_BTNS = [
  { key: "Projects",                label: "Projects" },
  { key: "Skills",                  label: "Skills" },
  { key: "Certifications & Awards", label: "Certs & Awards" },
  { key: "Professional Experience", label: "Experience" },
  { key: "Schooling",               label: "Schooling" },
  { key: "Leadership",              label: "Leadership" }, // Key updated
];

// ── Shared UI Components (AIML Gestures) ──────────────────────────────────────

function AnimatedList({ items, delayOffset = 0 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20, textAlign: "left", width: "100%" }}>
      {items.map((pt, k) => (
        <div key={k} style={{ 
          display: "flex", alignItems: "flex-start", 
          opacity: 0, animation: `cascadeIn 0.5s ease forwards ${delayOffset + (k * 0.12)}s` 
        }}>
          <span style={{ color: "#00ffb4", fontFamily: "'IBM Plex Mono', monospace", marginRight: 12, fontSize: 14, marginTop: 2 }}>▹</span>
          <span style={{ color: "#c0ddd6", fontSize: 13.5, lineHeight: 1.7, fontFamily: "sans-serif" }}>{pt}</span>
        </div>
      ))}
    </div>
  );
}

// ── Background & Utils ────────────────────────────────────────────────────────
function NeuralBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const nodes = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    for (let i = 0; i < 44; i++) nodes.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32, r: Math.random() * 1.6 + 0.7, pulse: Math.random() * Math.PI * 2 });
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => { n.x += n.vx; n.y += n.vy; n.pulse += 0.015; if (n.x < 0 || n.x > canvas.width) n.vx *= -1; if (n.y < 0 || n.y > canvas.height) n.vy *= -1; });
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach(b => {
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 175) { ctx.beginPath(); ctx.strokeStyle = `rgba(0,255,180,${(1 - d / 175) * 0.14})`; ctx.lineWidth = 0.4; ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        });
        const g = 0.5 + 0.5 * Math.sin(a.pulse);
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r + g * 0.7, 0, Math.PI * 2); ctx.fillStyle = `rgba(0,255,180,${0.22 + g * 0.3})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.38 }} />;
}

function CustomCursor() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, cx = mx, cy = my;
    const move = e => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", move);
    const loop = () => { cx += (mx - cx) * 0.13; cy += (my - cy) * 0.13; el.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`; requestAnimationFrame(loop); };
    loop();
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} style={{ position: "fixed", top: 0, left: 0, width: 26, height: 26, borderRadius: "50%", pointerEvents: "none", zIndex: 9999, background: "radial-gradient(circle, rgba(0,255,180,0.3) 0%, transparent 70%)", mixBlendMode: "screen" }} />;
}

function StatCounter({ value, suffix = "", duration = 1400 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = parseFloat(value); let start = null; let started = false;
    const step = ts => { if (!start) start = ts; const p = Math.min((ts - start) / duration, 1); setCount(Math.round(p * num * 10) / 10); if (p < 1) requestAnimationFrame(step); };
    const obs = new IntersectionObserver(entries => { if (entries[0].isIntersecting && !started) { started = true; requestAnimationFrame(step); } }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Agentic Flow Graph (Visual DAG) ────────────────────────────────────────────
const FlowArrow = () => (
  <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: 28, flexShrink: 0 }}>
    <div style={{ height: 2, width: '100%', background: 'rgba(0,255,180,0.2)' }} />
    <div style={{ width: 6, height: 6, borderTop: '2px solid #00ffb4', borderRight: '2px solid #00ffb4', transform: 'rotate(45deg)', position: 'absolute', right: -2 }} />
    <div style={{
       position: 'absolute', top: -1, left: 0, width: 6, height: 4, background: '#00ffb4',
       borderRadius: 2, boxShadow: '0 0 8px #00ffb4', animation: 'flow-data 1.5s infinite linear'
    }} />
  </div>
);

function AgenticFlowGraph() {
  return (
    <div className="hide-scrollbar" style={{ display: "flex", alignItems: "center", justifyContent: "center", overflowX: "auto", padding: "10px 0 20px 0", marginBottom: 24, width: "100%" }}>
      <div className="node-glow" style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(0,255,180,.05)", border: "1px solid rgba(0,255,180,.3)", color: "#00ffb4", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 1, whiteSpace: "nowrap" }}>
        ML
      </div>
      <FlowArrow />
      <div className="node-glow" style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(0,255,180,.05)", border: "1px solid rgba(0,255,180,.3)", color: "#00ffb4", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 1, whiteSpace: "nowrap", animationDelay: "0.2s" }}>
        Agentic AI
      </div>
      <FlowArrow />
      <div className="node-glow" style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(0,255,180,.05)", border: "1px solid rgba(0,255,180,.3)", color: "#00ffb4", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 1, whiteSpace: "nowrap", animationDelay: "0.4s" }}>
        RAG Pipelines
      </div>
      <svg width="24" height="62" style={{ flexShrink: 0, overflow: 'visible', margin: '0 4px' }}>
         <path d="M 0 31 L 8 31 C 16 31 16 13 24 13" fill="transparent" stroke="rgba(0,255,180,0.3)" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash-flow 1s linear infinite" }} />
         <path d="M 0 31 L 8 31 C 16 31 16 49 24 49" fill="transparent" stroke="rgba(0,255,180,0.3)" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash-flow 1s linear infinite" }} />
         <circle cx="0" cy="31" r="3" fill="#00ffb4" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="node-glow" style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(0,255,180,.05)", border: "1px solid rgba(0,255,180,.3)", color: "#00ffb4", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 1, whiteSpace: "nowrap", animationDelay: "0.6s" }}>
          LangChain
        </div>
        <div className="node-glow" style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(0,255,180,.05)", border: "1px solid rgba(0,255,180,.3)", color: "#00ffb4", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 1, whiteSpace: "nowrap", animationDelay: "0.8s" }}>
          LangGraph
        </div>
      </div>
      <svg width="24" height="62" style={{ flexShrink: 0, overflow: 'visible', margin: '0 4px' }}>
         <path d="M 0 13 C 8 13 8 31 16 31 L 24 31" fill="transparent" stroke="rgba(0,255,180,0.3)" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash-flow 1s linear infinite" }} />
         <path d="M 0 49 C 8 49 8 31 16 31 L 24 31" fill="transparent" stroke="rgba(0,255,180,0.3)" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash-flow 1s linear infinite" }} />
         <polygon points="18,27 24,31 18,35" fill="#00ffb4" />
      </svg>
      <div className="node-glow" style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(0,255,180,.05)", border: "1px solid rgba(0,255,180,.3)", color: "#00ffb4", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 1, whiteSpace: "nowrap", animationDelay: "1.0s" }}>
        FastAPI
      </div>
    </div>
  );
}

// ── 3D Carousel ────────────────────────────────────────────────────────────────
function ProjectsCarousel() {
  const [cur, setCur] = useState(0);
  const total = PROJECTS.length;
  const next = () => setCur(p => (p + 1) % total);
  const prev = () => setCur(p => (p - 1 + total) % total);
  const startX = useRef(null);
  const onPD = e => { startX.current = e.clientX; };
  const onPU = e => { if (startX.current === null) return; const dx = e.clientX - startX.current; startX.current = null; if (dx < -40) next(); else if (dx > 40) prev(); };

  return (
    <div onPointerDown={onPD} onPointerUp={onPU} style={{ userSelect: "none", paddingBottom: 20 }}>
      <div style={{ perspective: 1400, position: "relative", height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {PROJECTS.map((p, i) => {
          let offset = i - cur;
          if (offset < -Math.floor(total / 2)) offset += total;
          if (offset > Math.floor(total / 2)) offset -= total;
          const isActive = offset === 0;
          return (
            <div key={p.id} onClick={() => !isActive && setCur(i)} style={{
              position: "absolute", width: "100%", maxWidth: 700,
              padding: isActive ? "32px 40px" : "24px 28px",
              borderRadius: 18,
              background: isActive ? "linear-gradient(145deg,rgba(4,14,10,0.98),rgba(6,18,14,0.95))" : "rgba(4,12,16,0.5)",
              border: isActive ? `1px solid ${p.color}50` : "1px solid rgba(255,255,255,0.04)",
              boxShadow: isActive ? `0 0 70px ${p.color}10, 0 24px 70px rgba(0,0,0,0.65)` : "none",
              transform: `translateX(${offset * 54}%) translateZ(${Math.abs(offset) * -165}px) rotateY(${offset * 36}deg)`,
              opacity: Math.max(0.18, 1 - Math.abs(offset) * 0.44),
              zIndex: 100 - Math.abs(offset),
              transition: "all 0.62s cubic-bezier(0.25,0.8,0.25,1)",
              cursor: isActive ? "default" : "pointer",
              willChange: "transform",
              textAlign: "center"
            }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono',monospace", color: p.color, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, opacity: isActive ? 1 : 0.5 }}>{p.subtitle}</div>
                <div style={{ fontSize: isActive ? 26 : 18, fontWeight: 700, color: "#e8f4f0", fontFamily: "'Syne',sans-serif", opacity: isActive ? 1 : 0.65, marginBottom: 12 }}>{p.title}</div>
                {isActive && (
                  <a href={p.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: p.color, textDecoration: "none", fontSize: 11, fontFamily: "'IBM Plex Mono',monospace", padding: "6px 14px", background: `${p.color}15`, borderRadius: 6, border: `1px solid ${p.color}30`, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                    ⌥ Source Code
                  </a>
                )}
              </div>

              {isActive ? (
                <>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12, margin: "18px 0", flexWrap: "wrap" }}>
                    {p.metrics.map((m, mi) => (
                      <div key={mi} style={{ padding: "8px 16px", borderRadius: 8, background: `${p.color}0e`, border: `1px solid ${p.color}28`, textAlign: "center" }}>
                        <div style={{ fontSize: 17, fontWeight: 700, color: p.color, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>{m.value}</div>
                        <div style={{ fontSize: 9, color: "#6a9a8a", fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1, marginTop: 4 }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <AnimatedList items={p.points} delayOffset={0.2} />

                  <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    {p.tags.map((t, j) => <span key={j} style={{ padding: "4px 12px", borderRadius: 20, background: `${p.color}0d`, border: `1px solid ${p.color}28`, color: p.color, fontSize: 10, fontFamily: "'IBM Plex Mono',monospace" }}>{t}</span>)}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: "#3a6a5a", marginTop: 6, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.6 }}>
                  {p.desc.slice(0, 64)}…
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 16 }}>
        <button className="carousel-btn" onClick={prev}>←</button>
        <div style={{ display: "flex", gap: 7 }}>
          {PROJECTS.map((p, i) => (
            <div key={i} onClick={() => setCur(i)} style={{ width: i === cur ? 26 : 7, height: 7, borderRadius: 4, cursor: "pointer", background: i === cur ? PROJECTS[cur].color : "rgba(255,255,255,0.1)", transition: "all 0.3s" }} />
          ))}
        </div>
        <button className="carousel-btn" onClick={next}>→</button>
      </div>
    </div>
  );
}

// ── Modal Shell ────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div className="modal-backdrop" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 800, background: "rgba(2,6,8,0.9)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(145deg,#060d0f,#04090b)", border: "1px solid rgba(0,255,180,0.2)", borderRadius: 18, width: "100%", maxWidth: 860, maxHeight: "88vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,180,0.45),transparent)" }} />
        <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(0,255,180,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="dot-indicator" />
            <h2 style={{ fontSize: 19, fontWeight: 700, color: "#e8f4f0", fontFamily: "'Syne',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{title}</h2>
          </div>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="custom-scrollbar" style={{ padding: 28, overflowY: "auto", flex: 1, width: "100%" }}>{children}</div>
      </div>
    </div>
  );
}

// ── Modal Contents ─────────────────────────────────────────────────────────────
function SkillsModal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {SKILLS_DATA.map((g, i) => (
        <div key={i} style={{ 
          padding: "24px 28px", borderRadius: 14, background: "rgba(0,255,180,0.02)", 
          border: "1px solid rgba(0,255,180,0.12)", position: "relative", overflow: "hidden",
          opacity: 0, animation: `cascadeIn 0.5s ease forwards ${i * 0.15 + 0.1}s` 
        }}>
          <div className="scanning-line" />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, background: "#00ffb4", borderRadius: "50%", boxShadow: "0 0 10px #00ffb4" }} />
            <div style={{ fontSize: 13, color: "#00ffb4", letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" }}>
              {g.label}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {g.items.map((item, j) => (
              <span key={j} className="skill-badge" style={{ opacity: 0, animation: `popIn 0.3s ease forwards ${(i * 0.1) + (j * 0.05) + 0.3}s` }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceModal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {EXPERIENCE.map((e, i) => (
        <div key={i} style={{ 
          padding: "28px 32px", borderRadius: 14, background: "rgba(0,255,180,0.025)", 
          border: "1px solid rgba(0,255,180,0.1)", position: "relative", overflow: "hidden",
          opacity: 0, animation: `cascadeIn 0.5s ease forwards ${i * 0.2 + 0.1}s`
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "linear-gradient(180deg,#00ffb4,transparent)" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#e8f4f0", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>{e.role}</div>
            <div style={{ fontSize: 13, color: "#00ffb4", fontFamily: "'IBM Plex Mono',monospace", marginBottom: 12 }}>{e.company}</div>
            <span style={{ fontSize: 11, color: "#4a8a7a", fontFamily: "'IBM Plex Mono',monospace", padding: "4px 12px", background: "rgba(0,255,180,0.05)", borderRadius: 6, border: "1px solid rgba(0,255,180,0.12)" }}>{e.period}</span>
          </div>
          <AnimatedList items={e.points} delayOffset={(i * 0.2) + 0.3} />
          <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {e.tags.map((t, j) => <span key={j} style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(0,255,180,0.05)", border: "1px solid rgba(0,255,180,0.15)", color: "#00ffb4", fontSize: 10, fontFamily: "'IBM Plex Mono',monospace" }}>{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function CertificationsModal({ items }) {
  return (
    <div className="certs-grid">
      {items.map((item, i) => {
        const isFullWidth = i === 2;
        return (
          <div key={i} className={isFullWidth ? "cert-card-full" : "cert-card-half"} style={{ 
            padding: "24px 28px", borderRadius: 12, background: "rgba(0,255,180,0.025)", border: "1px solid rgba(0,255,180,0.09)", 
            textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center",
            opacity: 0, animation: `popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${i * 0.1 + 0.1}s`
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#e8f4f0", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 12.5, color: "#6a9a8a", marginBottom: 16 }}>{item.issuer}</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {item.tags.map((t, j) => <span key={j} style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(0,255,180,0.05)", border: "1px solid rgba(0,255,180,0.14)", color: "#00ffb4", fontSize: 10, fontFamily: "'IBM Plex Mono',monospace" }}>{t}</span>)}
              {item.href && <a href={item.href} target="_blank" rel="noreferrer" style={{ color: "#00ffb4", textDecoration: "none", fontSize: 10, fontFamily: "'IBM Plex Mono',monospace", padding: "3px 10px", background: "rgba(0,255,180,0.07)", borderRadius: 4, border: "1px solid rgba(0,255,180,0.18)" }}>↗ View Credentials</a>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GenericModal({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {items.map((item, i) => (
        <div key={i} style={{ 
          padding: "24px 28px", borderRadius: 12, background: "rgba(0,255,180,0.025)", 
          border: "1px solid rgba(0,255,180,0.09)", textAlign: "center",
          opacity: 0, animation: `cascadeIn 0.5s ease forwards ${i * 0.2 + 0.1}s`
        }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#e8f4f0", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>{item.title || item.role}</div>
          <div style={{ fontSize: 12.5, color: "#00ffb4", fontFamily: "'IBM Plex Mono',monospace", marginBottom: 16 }}>{item.issuer || item.org}</div>
          <AnimatedList items={item.points} delayOffset={(i * 0.2) + 0.3} />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            {item.tags.map((t, j) => <span key={j} style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(0,255,180,0.05)", border: "1px solid rgba(0,255,180,0.14)", color: "#00ffb4", fontSize: 10, fontFamily: "'IBM Plex Mono',monospace" }}>{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function SchoolingModal() {
  return (
    <div style={{ 
      padding: "50px 40px", borderRadius: 16, background: "rgba(0,255,180,0.025)", border: "1px solid rgba(0,255,180,0.15)", textAlign: "center",
      opacity: 0, animation: `popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.1s`
    }}>
      <div style={{ fontSize: 11, color: "#00ffb4", fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>2021 – 2025</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#e8f4f0", fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>B.E. in Artificial Intelligence & Machine Learning</div>
      <div style={{ fontSize: 16, color: "#6a9a8a", marginBottom: 36 }}>Dayananda Sagar College of Engineering</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "18px 40px", borderRadius: 14, background: "rgba(0,255,180,0.07)", border: "1px solid rgba(0,255,180,0.25)", boxShadow: "0 0 40px rgba(0,255,180,0.05)" }}>
        <span style={{ fontSize: 42, fontWeight: 800, color: "#00ffb4", fontFamily: "'Syne',sans-serif" }}><StatCounter value={8.86} suffix="" duration={1200} /></span>
        <span style={{ fontSize: 14, color: "#6a9a8a", fontFamily: "'IBM Plex Mono',monospace" }}>Cumulative<br/>GPA</span>
      </div>
    </div>
  );
}

// ── Contact Popup ──────────────────────────────────────────────────────────────
function ContactPopup({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(135deg,#080f14,#0a150f)", border: "1px solid rgba(0,255,180,0.28)", borderRadius: 18, padding: "38px 46px", maxWidth: 400, width: "90%", boxShadow: "0 0 80px rgba(0,255,180,0.08)", position: "relative", textAlign: "center" }}>
        <button onClick={onClose} className="close-btn" style={{ position: "absolute", top: 16, right: 18 }}>✕</button>
        <div style={{ fontSize: 10, color: "#00ffb4", letterSpacing: 4, marginBottom: 10, fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" }}>// reach_out()</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#e8f4f0", marginBottom: 26, fontFamily: "'Syne',sans-serif" }}>Let's Connect</div>
        <a href="tel:6362533984" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "15px 18px", borderRadius: 11, background: "rgba(0,255,180,0.05)", border: "1px solid rgba(0,255,180,0.18)", color: "#e8f4f0", textDecoration: "none", fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, letterSpacing: 2, marginBottom: 12 }}>
          <span style={{ color: "#00ffb4" }}>◎</span> +91 6362 533 984
        </a>
        <a href="mailto:shivabasavamatur@gmail.com" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "14px 18px", borderRadius: 11, background: "rgba(0,255,180,0.05)", border: "1px solid rgba(0,255,180,0.18)", color: "#e8f4f0", textDecoration: "none", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, letterSpacing: 1 }}>
          <span style={{ color: "#00ffb4" }}>✉</span> shivabasavamatur@gmail.com
        </a>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [aboutIdx, setAboutIdx] = useState(0);
  const [fadeState, setFadeState] = useState("in");
  const [activeSection, setActiveSection] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [showAd, setShowAd] = useState(false);
  
  // Chat State
  const [chatMsg, setChatMsg] = useState("");
  const [chatPlaceholder, setChatPlaceholder] = useState("Ask about projects, system design, or engineering decisions...");

  useEffect(() => {
    const t = setInterval(() => {
      setFadeState("out");
      setTimeout(() => { setAboutIdx(i => (i + 1) % ABOUT_SENTENCES.length); setFadeState("in"); }, 400);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const adTimer = setTimeout(() => setShowAd(true), 3000);
    return () => clearTimeout(adTimer);
  }, []);

  const openSection = useCallback(key => {
    setActiveSection(key);
  }, []);

  const scrollToChat = () => {
    setShowAd(false);
    document.getElementById("chat-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleChatSubmit = () => {
    if (!chatMsg.trim()) return;
    setChatMsg("");
    setChatPlaceholder("Agentic Backend deploying soon. Please connect via LinkedIn.");
    setTimeout(() => {
      setChatPlaceholder("Ask about projects, system design, or engineering decisions...");
    }, 4000);
  };

  const renderModal = () => {
    if (!activeSection) return null;
    const map = {
      "Projects": <ProjectsCarousel />,
      "Skills": <SkillsModal />,
      "Certifications & Awards": <CertificationsModal items={CERTS} />,
      "Professional Experience": <ExperienceModal />,
      "Schooling": <SchoolingModal />,
      "Leadership": <GenericModal items={VOLUNTEERING} />, // Hooked to Leadership
    };
    return <Modal title={activeSection} onClose={() => setActiveSection(null)}>{map[activeSection]}</Modal>;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth} body{background:#040c10;overflow-x:hidden}
        
        @keyframes cascadeIn {
          from { opacity: 0; transform: translateX(-15px); filter: blur(4px); }
          to { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        .scanning-line {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,255,180,0.05), transparent);
          transform: skewX(-20deg); animation: scan 4s infinite linear; pointer-events: none;
        }
        @keyframes scan { 0% { left: -100%; } 100% { left: 200%; } }
        
        .skill-badge {
          padding: 6px 14px; borderRadius: 6px; background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.08); color: #c0ddd6; 
          font-family: 'IBM Plex Mono',monospace; font-size: 11.5px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .skill-badge:hover {
          background: rgba(0,255,180,0.1); border-color: rgba(0,255,180,0.4); 
          color: #00ffb4; transform: translateY(-2px) scale(1.05);
          box-shadow: 0 4px 12px rgba(0,255,180,0.1);
        }

        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse-dot{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,255,180,0.4)}50%{opacity:.6;box-shadow:0 0 0 6px rgba(0,255,180,0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{from{opacity:0;transform:scale(.9) translateY(22px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        
        @keyframes dash-flow { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
        @keyframes flow-data { 0% { left: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
        .node-glow { animation: pulse-border 2.5s infinite alternate; }
        @keyframes pulse-border { 0% { box-shadow: 0 0 4px rgba(0,255,180,0.1); border-color: rgba(0,255,180,0.15); } 100% { box-shadow: 0 0 16px rgba(0,255,180,0.4); border-color: rgba(0,255,180,0.6); } }

        @keyframes adSlideIn { from { opacity: 0; transform: translateX(50px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }

        .certs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .cert-card-half { grid-column: span 1; }
        .cert-card-full { grid-column: 1 / -1; }
        @media(max-width: 768px) { .certs-grid { grid-template-columns: 1fr; } .cert-card-half, .cert-card-full { grid-column: span 1; } }

        .dot-indicator{width:7px;height:7px;border-radius:50%;background:#00ffb4;animation:pulse-dot 2s ease-in-out infinite;flex-shrink:0}
        .nav-link{color:#7aada0;text-decoration:none;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:8px 14px;border-radius:6px;border:1px solid transparent;transition:all .2s;background:transparent;cursor:pointer; text-align:center;}
        .nav-link:hover{color:#00ffb4;border-color:rgba(0,255,180,.22);background:rgba(0,255,180,.04)}
        .section-btn{padding:11px 22px;border-radius:8px;border:1px solid rgba(0,255,180,.16);background:rgba(0,255,180,.04);color:#6a9a8a;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .28s;white-space:nowrap;flex-shrink:0;text-align:center;}
        .section-btn:hover,.section-btn.active{background:rgba(0,255,180,.11);border-color:rgba(0,255,180,.42);color:#00ffb4;box-shadow:0 0 16px rgba(0,255,180,.1);transform:translateY(-2px)}
        .carousel-btn{background:rgba(0,255,180,.07);border:1px solid rgba(0,255,180,.22);color:#00ffb4;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .2s}
        .carousel-btn:hover{background:rgba(0,255,180,.16);transform:scale(1.1);box-shadow:0 0 12px rgba(0,255,180,.18)}
        .chat-input{flex:1;background:transparent;border:none;outline:none;color:#e8f4f0;font-family:'IBM Plex Mono',monospace;font-size:13px;letter-spacing:.5px; text-align:center; transition: all 0.3s;}
        .chat-input::placeholder{color:rgba(106,154,138,.45);}
        .chat-send{width:38px;height:38px;border-radius:9px;background:rgba(0,255,180,.1);border:1px solid rgba(0,255,180,.28);color:#00ffb4;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;transition:all .2s;flex-shrink:0}
        .chat-send:hover{background:rgba(0,255,180,.2);transform:translateY(-1px)}
        .close-btn{background:rgba(0,255,180,.06);border:1px solid rgba(0,255,180,.18);color:#00ffb4;cursor:pointer;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .2s}
        .close-btn:hover{background:rgba(0,255,180,.15)}
        .modal-backdrop{animation:fadeIn .28s ease}
        .modal-content{animation:popIn .38s cubic-bezier(.175,.885,.32,1.275)}
        .custom-scrollbar::-webkit-scrollbar{width:6px}
        .custom-scrollbar::-webkit-scrollbar-track{background:rgba(0,0,0,0.2); border-radius:3px}
        .custom-scrollbar::-webkit-scrollbar-thumb{background:rgba(0,255,180,.22);border-radius:3px}
        .hide-scrollbar::-webkit-scrollbar{display:none}
        .hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
        .about-text{transition:opacity .42s ease,transform .42s ease}
        .about-fade-in{opacity:1;transform:translateY(0)}
        .about-fade-out{opacity:0;transform:translateY(10px)}
        @media(max-width:640px){.metrics-row{grid-template-columns:repeat(3,1fr)!important}}
      `}</style>

      <CustomCursor />
      <NeuralBg />
      {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
      {renderModal()}

      {/* Floating AI Agent "Ad" Toast */}
      {showAd && (
        <div style={{
          position: "fixed", bottom: 30, right: 30, zIndex: 900,
          background: "linear-gradient(135deg, rgba(6,16,20,0.95), rgba(4,10,12,0.98))",
          border: "1px solid rgba(0,255,180,0.3)", borderRadius: 14,
          padding: "20px 24px", maxWidth: 320,
          boxShadow: "0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,255,180,0.1)",
          backdropFilter: "blur(10px)",
          animation: "adSlideIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          textAlign: "center"
        }}>
          <button onClick={() => setShowAd(false)} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", color: "#4a8a7a", cursor: "pointer", fontSize: 16 }}>✕</button>
          <div style={{ fontSize: 10, color: "#00ffb4", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 2, textTransform: "uppercase" }}>Sponsored / AI</div>
          <div style={{ fontSize: 14, color: "#e8f4f0", marginBottom: 18, lineHeight: 1.6, fontFamily: "'Syne', sans-serif" }}>
            Want to dive deeper? An AI Assistant is ready to answer all questions regarding Shivabasava's experience and systems.
          </div>
          <button onClick={scrollToChat} style={{
            background: "rgba(0,255,180,0.1)", border: "1px solid rgba(0,255,180,0.5)", color: "#00ffb4",
            padding: "10px 20px", borderRadius: 8, cursor: "pointer", width: "100%",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1,
            transition: "all 0.2s"
          }} onMouseOver={e => e.currentTarget.style.background = "rgba(0,255,180,0.2)"} onMouseOut={e => e.currentTarget.style.background = "rgba(0,255,180,0.1)"}>
            Chat Now
          </button>
        </div>
      )}

      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,rgba(4,12,16,.93),rgba(5,10,8,.93))", position: "relative", zIndex: 1, fontFamily: "'Syne',sans-serif", color: "#e8f4f0" }}>

        <header style={{ position: "sticky", top: 0, zIndex: 200, borderBottom: "1px solid rgba(0,255,180,.06)", background: "rgba(4,12,16,.9)", backdropFilter: "blur(24px)", padding: "10px 40px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="dot-indicator" style={{ width: 6, height: 6 }} />
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, fontWeight: 700, color: "#00ffb4", letterSpacing: 2, textTransform: "uppercase", textAlign: "left" }}>Shivabasava Matur</span>
              </div>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#8aada0", letterSpacing: 2, marginTop: 4, paddingLeft: 14 }}>AIML Engineer</span>
            </div>
            <nav style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {NAV_LINKS.map(l => l.isContact
                ? <button key={l.label} className="nav-link" onClick={() => setShowContact(true)}>{l.icon} {l.label}</button>
                : <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="nav-link">{l.icon} {l.label}</a>
              )}
            </nav>
          </div>
        </header>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px 100px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

          <section style={{ marginBottom: 48, animation: "slideUp .6s ease", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <AgenticFlowGraph />
          </section>

          <section style={{ marginBottom: 64, animation: "slideUp .6s ease", width: "100%", maxWidth: 860 }}>
            <div style={{ padding: "36px 40px", background: "rgba(0,255,180,.02)", border: "1px solid rgba(0,255,180,.09)", borderRadius: 15, position: "relative", overflow: "hidden", minHeight: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono',monospace", color: "#00ffb4", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, opacity: .8 }}>// core_focus</div>
              <p className={`about-text ${fadeState === "in" ? "about-fade-in" : "about-fade-out"}`} style={{ fontSize: "clamp(15px, 1.8vw, 18px)", lineHeight: 1.8, color: "#e8f4f0", fontFamily: "'IBM Plex Mono', monospace", maxWidth: 700, margin: "0 auto" }}>
                {ABOUT_SENTENCES[aboutIdx]}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                {ABOUT_SENTENCES.map((_, i) => (
                  <button key={i} onClick={() => { setAboutIdx(i); setFadeState("in"); }} style={{ width: 8, height: 8, borderRadius: "50%", background: i === aboutIdx ? "#00ffb4" : "rgba(0,255,180,.16)", border: "none", cursor: "pointer", transition: "background .4s", padding: 0 }} />
                ))}
              </div>
            </div>
          </section>

          <div className="metrics-row" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 64, width: "100%" }}>
            {QUICK_METRICS.map((m, i) => (
              <div key={i} style={{ padding: "16px 10px", borderRadius: 10, background: "rgba(0,255,180,.025)", border: "1px solid rgba(0,255,180,.09)", textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#00ffb4", fontFamily: "'Syne',sans-serif", lineHeight: 1 }}><StatCounter value={m.value} suffix={m.suffix} /></div>
                <div style={{ fontSize: 9, color: "#3a6a55", fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1, textTransform: "uppercase", marginTop: 8, lineHeight: 1.4 }}>{m.label}</div>
              </div>
            ))}
          </div>

          <section style={{ marginBottom: 64, width: "100%" }}>
            <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono',monospace", color: "#2a5a45", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>// execute_module</div>
            <div className="hide-scrollbar" style={{ display: "flex", justifyContent: "center", gap: 12, overflowX: "auto", paddingBottom: 6, flexWrap: "wrap" }}>
              {SECTION_BTNS.map(s => (
                <button key={s.key} className={`section-btn${activeSection === s.key ? " active" : ""}`} onClick={() => openSection(s.key)}>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{ height: 1, background: "linear-gradient(90deg,transparent, rgba(0,255,180,.3), transparent)", marginTop: 16, width: "100%", maxWidth: 600, margin: "16px auto 0" }} />
          </section>

          <section id="chat-section" style={{ width: "100%", maxWidth: 700 }}>
            <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono',monospace", color: "#2a5a45", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>// ask_shivabasava()</div>
            <div style={{ padding: "14px 18px", background: "rgba(0,255,180,.03)", border: "1px solid rgba(0,255,180,.16)", borderRadius: 13, display: "flex", alignItems: "center", gap: 14 }}>
              <div className="dot-indicator" style={{ width: 7, height: 7 }} />
              <input 
                className="chat-input" 
                placeholder={chatPlaceholder} 
                value={chatMsg} 
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChatSubmit()}
              />
              <button className="chat-send" onClick={handleChatSubmit}>↑</button>
            </div>
            <div style={{ marginTop: 10, fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "rgba(42,90,69,.55)", letterSpacing: 2, textAlign: "center" }}>AI-POWERED · COMING SOON</div>
          </section>

        </main>

        <footer style={{ borderTop: "1px solid rgba(0,255,180,.05)", padding: "24px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "rgba(42,90,69,.5)", letterSpacing: 2, textAlign: "center" }}>SHIVABASAVA MATUR · HYDERABAD · AIML ENGINEER</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "rgba(0,255,180,.35)", letterSpacing: 2 }}>©2026</span>
        </footer>
      </div>
    </>
  );
}