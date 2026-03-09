import { useState } from "react";
import LegalHub from "./LegalHub.jsx";
import useIsMobile from "./useIsMobile.js";

const WORKSTREAMS = [
  {
    id: "fund",
    label: "LP Fund",
    icon: "💰",
    color: "#E94560",
    tagline: "Raise the capital",
    phases: [
      {
        name: "Prepare",
        timeline: "Mar",
        tasks: [
          "Define fund terms (target size, carry, management fee)",
          "Engage fund formation lawyer in Bahrain",
          "Build LP deck (10–15 slides: thesis, team, model, ask)",
          "Create LP one-pager for easy forwarding",
          "Set up data room (terms, projections, team bios)",
        ],
        output: "LP deck + data room ready",
      },
      {
        name: "First Close",
        timeline: "Apr–May",
        tasks: [
          "Map 30 target LPs (name, connection, likely check)",
          "Prioritize warm intros — start with closest relationships",
          "Run 15–20 LP meetings in 4 weeks",
          "Handle due diligence questions and follow-ups",
          "Close first $250K–$400K to greenlight Cohort 1",
        ],
        output: "First close secured",
      },
      {
        name: "Continue Raise",
        timeline: "Jun–Sep",
        tasks: [
          "Use Cohort 1 traction as live proof point",
          "Share founder progress updates with prospective LPs",
          "Expand LP pipeline beyond warm network",
          "Approach institutional supporters (Tamkeen, EDB)",
        ],
        output: "Pipeline growing with momentum",
      },
      {
        name: "Final Close",
        timeline: "Oct–Dec",
        tasks: [
          "Push for final close using Demo Day results",
          "Send LP update with portfolio metrics",
          "Lock fund at target ($500K–$1M)",
          "Set up reporting cadence for LPs (quarterly updates)",
        ],
        output: "Fund I fully closed",
      },
    ],
  },
  {
    id: "source",
    label: "Founder Sourcing",
    icon: "🔍",
    color: "#0F3460",
    tagline: "Find the right people",
    phases: [
      {
        name: "Network Tap",
        timeline: "Mar–Apr",
        tasks: [
          "List every founder/builder in your personal network",
          "Ask each to refer one other strong founder",
          "Reach out to university entrepreneurship programs",
          "Attend 2–3 startup events in Bahrain/GCC",
          "Post about Delta V on LinkedIn and X — be specific about who you're looking for",
        ],
        output: "20–30 warm leads",
      },
      {
        name: "Application & Selection",
        timeline: "Apr",
        tasks: [
          "Open simple application form (Typeform or Google Form)",
          "Screen applications: look for grit, speed, insight",
          "Run 15–20 founder interviews (30 min each)",
          "Score on: resilience, execution speed, coachability, market insight",
          "Select 3–5 founders for Cohort 1",
        ],
        output: "Cohort 1 selected",
      },
      {
        name: "Pipeline Building",
        timeline: "May–Sep",
        tasks: [
          "Keep sourcing even while running the program",
          "Build a CRM of founders for Cohort 2 pipeline",
          "Ask Cohort 1 founders for referrals",
          "Speak at events, write content, stay visible",
        ],
        output: "Cohort 2 pipeline started",
      },
      {
        name: "Cohort 2 Prep",
        timeline: "Oct–Dec",
        tasks: [
          "Open Cohort 2 applications",
          "Refine selection process based on Cohort 1 learnings",
          "Expand sourcing to regional universities & ecosystems",
          "Target 50+ applications for 3–5 spots",
        ],
        output: "Cohort 2 applications open",
      },
    ],
  },
  {
    id: "program",
    label: "Program Ops",
    icon: "⚡",
    color: "#E94560",
    tagline: "Run the accelerator",
    phases: [
      {
        name: "Design",
        timeline: "Mar–Apr",
        tasks: [
          "Finalize 12-week program structure (Foundation → Build → Launch → Demo Day)",
          "Define weekly cadence: office hours, group sessions, founder dinners",
          "Create founder handbook (expectations, milestones, resources)",
          "Secure physical space or co-working arrangement",
          "Set up tools: Slack, Notion, shared drive",
        ],
        output: "Program blueprint locked",
      },
      {
        name: "Cohort 1 Execution",
        timeline: "May–Jul",
        tasks: [
          "Onboard founders: sign SAFEs, kick off Week 1",
          "Run weekly 1-on-1 office hours with each team",
          "Facilitate mentor sessions (2–3 per week across cohort)",
          "Host weekly founder dinners (informal, trust-building)",
          "Track progress: weekly updates from each startup",
          "Pressure-test ideas in Weeks 1–3 — kill what's not working",
        ],
        output: "12 weeks executed",
      },
      {
        name: "Demo Day",
        timeline: "Jul",
        tasks: [
          "Coach founders on pitch (multiple rehearsals)",
          "Curate invite list: 50–100 investors, press, ecosystem leaders",
          "Handle event logistics: venue, AV, livestream",
          "Coordinate investor meetings post-Demo Day",
        ],
        output: "Demo Day delivered",
      },
      {
        name: "Retrospective",
        timeline: "Aug–Sep",
        tasks: [
          "Run founder feedback surveys (anonymous + 1-on-1)",
          "Document what worked and what didn't",
          "Identify program improvements for Cohort 2",
          "Continue supporting Cohort 1 founders post-program",
        ],
        output: "Playbook v2 drafted",
      },
    ],
  },
  {
    id: "brand",
    label: "Brand & Community",
    icon: "📣",
    color: "#0F3460",
    tagline: "Build the reputation",
    phases: [
      {
        name: "Foundation",
        timeline: "Mar–Apr",
        tasks: [
          "Launch website: thesis, team, application link",
          "Set up social accounts (LinkedIn, X/Twitter)",
          "Write and publish your founding story — why Delta V, why Bahrain, why now",
          "Design brand identity: logo, colors, tone of voice",
        ],
        output: "Digital presence live",
      },
      {
        name: "Build in Public",
        timeline: "Apr–Jul",
        tasks: [
          "Weekly posts sharing the journey (highs and lows)",
          "Share founder wins (with permission) as social proof",
          "Engage with MENA startup ecosystem on social",
          "Write 1–2 longer pieces on your thesis or founder philosophy",
        ],
        output: "Growing audience & credibility",
      },
      {
        name: "Demo Day PR",
        timeline: "Jul–Aug",
        tasks: [
          "Pre-Demo Day: teaser content about the cohort",
          "Demo Day: live coverage, clips, founder spotlights",
          "Post-Demo Day: press outreach, recap content",
          "Collect testimonials from founders and mentors",
        ],
        output: "Delta V on the map",
      },
      {
        name: "Ecosystem",
        timeline: "Sep–Dec",
        tasks: [
          "Host a monthly founder meetup (open to anyone, not just cohort)",
          "Partner with other MENA ecosystem players",
          "Publish annual report: portfolio, learnings, thesis evolution",
          "Position for Cohort 2 launch with strong inbound interest",
        ],
        output: "Community flywheel spinning",
      },
    ],
  },
  {
    id: "mentor",
    label: "Mentor Network",
    icon: "🤝",
    color: "#E94560",
    tagline: "Curate the village",
    phases: [
      {
        name: "Identify",
        timeline: "Mar–Apr",
        tasks: [
          "List 20–30 potential mentors: operators, founders, investors, domain experts",
          "Prioritize people who've built things (not just advisors)",
          "Look across GCC, MENA, and global diaspora",
          "Map expertise gaps: technical, GTM, fundraising, legal, hiring",
        ],
        output: "Target mentor list ready",
      },
      {
        name: "Recruit",
        timeline: "Apr–May",
        tasks: [
          "Personal outreach — explain the mission, the time commitment, what's in it for them",
          "Ask for 2–4 sessions per cohort (low commitment, high impact)",
          "Offer: deal flow visibility, community, early access to startups",
          "Secure 10–15 committed mentors for Cohort 1",
        ],
        output: "10–15 mentors committed",
      },
      {
        name: "Activate",
        timeline: "May–Jul",
        tasks: [
          "Match mentors to founders based on needs, not just availability",
          "Brief mentors on each startup before sessions",
          "Collect feedback from both sides after each session",
          "Invite top mentors to Demo Day as VIPs",
        ],
        output: "Mentor program running",
      },
      {
        name: "Grow",
        timeline: "Aug–Dec",
        tasks: [
          "Ask Cohort 1 mentors for referrals to expand network",
          "Invite standout Cohort 1 founders to mentor Cohort 2",
          "Build a mentor directory with expertise tags",
          "Target 20+ mentors for Cohort 2",
        ],
        output: "Network expanding organically",
      },
    ],
  },
  {
    id: "legal",
    label: "Legal & Finance",
    icon: "📋",
    color: "#0F3460",
    tagline: "Build the foundation",
    phases: [
      {
        name: "Entity Setup",
        timeline: "Mar",
        tasks: [
          "Register fund vehicle (Exempt CIU or ILP in Bahrain)",
          "Engage fund formation lawyer",
          "Draft LPA or constitutive documents",
          "Set up bank accounts for fund operations",
          "File CBB notification for Exempt CIU status",
        ],
        output: "Legal entity operational",
      },
      {
        name: "Fund Docs",
        timeline: "Apr",
        tasks: [
          "Finalize Offering Memorandum and subscription docs",
          "Prepare standard SAFE template for portfolio companies",
          "Create founder participation agreement",
          "Appoint Bahrain-based external auditor",
          "Set up AML/KYC onboarding process for LPs",
        ],
        output: "All docs ready to deploy",
      },
      {
        name: "Deploy",
        timeline: "May–Jul",
        tasks: [
          "Execute SAFEs with Cohort 1 founders",
          "Wire investment capital to portfolio companies",
          "Track cap tables for each investment",
          "Manage program operating expenses",
        ],
        output: "Capital deployed, clean records",
      },
      {
        name: "Reporting",
        timeline: "Aug–Dec",
        tasks: [
          "Send first quarterly LP update (portfolio status, metrics, learnings)",
          "Prepare fund financials for year-end",
          "File annual report within 4 months of fiscal year-end (CBB requirement)",
          "Track portfolio company milestones and follow-on raises",
        ],
        output: "LP reporting cadence established",
      },
    ],
  },
];

const QUARTERS = [
  { label: "MAR", month: 3 }, { label: "APR", month: 4 }, { label: "MAY", month: 5 },
  { label: "JUN", month: 6 }, { label: "JUL", month: 7 }, { label: "AUG", month: 8 },
  { label: "SEP", month: 9 }, { label: "OCT", month: 10 }, { label: "NOV", month: 11 },
  { label: "DEC", month: 12 },
];

const SCENARIOS = [
  {
    id: "best", label: "Best Case", icon: "🚀", color: "#22c55e",
    title: "Everything clicks — you become the reference accelerator",
    conditions: [
      "First close happens in April with $400K+ committed",
      "3–5 strong founders apply and get selected for Cohort 1",
      "At least 1 startup hits clear product-market fit or early revenue by Demo Day",
      "Demo Day generates buzz — press coverage, investor follow-on interest",
      "Fund fully closes at $750K–$1M by Q4",
      "Cohort 2 applications are oversubscribed heading into 2027",
    ],
    lp_outcome: "LPs see early traction and portfolio momentum. You have proof of concept for Fund II ($3–5M target). Al Waha or EDB express interest as institutional LP.",
    risk: "Overconfidence. Don't scale too fast. Stay at 3–5 startups per cohort until you've proven repeatable selection quality.",
    probability: "20–25%",
  },
  {
    id: "base", label: "Base Case", icon: "📊", color: "#3b82f6",
    title: "Solid start — building credibility one step at a time",
    conditions: [
      "First close is smaller than hoped — $150K–$300K by May",
      "You find 3 decent founders but selection pool is thinner than expected",
      "Program runs well, but no breakout startup in Cohort 1",
      "Demo Day is modest — 30–50 attendees, some investor interest",
      "Fund partially closes at $400K–$600K by year end",
      "Cohort 2 pipeline exists but needs more active sourcing",
    ],
    lp_outcome: "LPs see effort and structure but need Cohort 2 results before committing more. Quarterly updates are key to maintaining confidence.",
    risk: "Losing momentum between cohorts. Keep building in public, keep the LP pipeline warm, don't go quiet after Demo Day.",
    probability: "45–50%",
  },
  {
    id: "slow", label: "Slow Start", icon: "⏳", color: "#f59e0b",
    title: "Fundraising stalls — you need to pivot the approach",
    conditions: [
      "LP fundraising is much harder than expected — under $100K by June",
      "You struggle to find founders who meet your bar",
      "Cohort 1 launch delayed to Q3 or Q4",
      "You end up running a smaller pilot (1–2 startups) instead of a full cohort",
      "Demo Day happens but feels premature",
      "End of year: fund is under $300K, Cohort 2 uncertain",
    ],
    lp_outcome: "LPs are cautious. Some may want revised terms. Show extreme transparency and a clear path to improvement. Consider converting some LP relationships to advisory roles.",
    risk: "Burning through personal runway without enough fund capital deployed. Set a hard deadline: if under $150K by July, run bootstrapped with personal money for 1–2 startups as proof of concept.",
    probability: "20–25%",
  },
  {
    id: "worst", label: "Worst Case", icon: "🔴", color: "#ef4444",
    title: "It doesn't come together — but the learning is valuable",
    conditions: [
      "LP fundraising fails — under $50K committed after 6 months",
      "You can't find founders willing to join an unproven accelerator",
      "No cohort launches in 2026",
      "Personal financial strain from operating costs without fund capital",
      "Brand exists but has no portfolio to point to",
    ],
    lp_outcome: "No LP returns to report. Fund may need to return committed capital or restructure entirely. But relationships built with LPs and founders are assets for a second attempt.",
    risk: "The biggest risk is giving up entirely. If this happens, document everything, maintain relationships, and consider relaunching with a deal-by-deal SPV model instead of a fund.",
    probability: "10–15%",
  },
];

const LEGAL_SECTIONS = [
  {
    id: "vehicle", title: "Fund Vehicle Options", icon: "🏛️",
    items: [
      {
        heading: "Option A: Exempt CIU (Recommended)",
        desc: "The most practical structure for a small Bahrain-domiciled venture fund. Lightly regulated — only requires CBB notification (not full authorization). Can begin offering to investors just 5 days after filing. Only offered to accredited investors ($100K+ minimum or $1M+ in assets).",
        details: [
          "Notify CBB using prescribed template — operational within days",
          "Not subject to CBB's ongoing supervisory requirements",
          "Must appoint a Bahrain-based external auditor",
          "Fund administration must be conducted from Bahrain (can be by operator)",
          "Annual report required within 4 months of fiscal year-end",
          "Can be structured as contractual arrangement, trust, or corporate entity",
          "No restrictions on investment policy — flexibility to invest in pre-seed SAFEs",
        ],
      },
      {
        heading: "Option B: Investment Limited Partnership (ILP)",
        desc: "Bahrain's 2017 Investment Partnership Law enables LP/GP structures modeled on Cayman/Delaware standards. GP has management control; LPs are passive with limited liability. GP can be structured as an SPV to cap personal exposure.",
        details: [
          "GP (your management company) manages the fund with full control",
          "LPs are passive — cannot participate in management or lose liability protection",
          "GP can be an SPV/subsidiary to limit personal liability",
          "LPs' liability capped at committed capital",
          "LP may need to return profits paid within 6 months if fund becomes insolvent",
          "First GCC-native limited partnership law — well-recognized model",
          "Can be combined with Exempt CIU registration for dual coverage",
        ],
      },
      {
        heading: "Option C: Deal-by-Deal SPV (Fallback)",
        desc: "If the fund raise stalls, structure each investment as a standalone SPV. Investors co-invest per deal. Lower overhead, but no portfolio diversification and more paperwork per transaction.",
        details: [
          "Each startup investment is its own legal entity",
          "Investors opt into individual deals — no blind pool commitment",
          "Lower regulatory burden — may not need CBB registration",
          "Less attractive to LPs who want diversified exposure",
          "More legal paperwork per transaction",
          "Good fallback if fund model doesn't close — preserves optionality",
        ],
      },
    ],
  },
  {
    id: "promises", title: "What You Promise LPs", icon: "🤝",
    items: [
      {
        heading: "Investment Thesis & Strategy",
        desc: "Documented in the Offering Memorandum (OM). This is a binding commitment — material deviations require LP consent. Be precise so there's no ambiguity later.",
        details: [
          "Pre-seed stage investments via post-money SAFEs (YC standard)",
          "Sector-agnostic, founder-first selection criteria",
          "Check sizes: $25K–$50K per startup",
          "Target: 3–5 startups per cohort, 1–2 cohorts per year",
          "Geography: primarily Bahrain/MENA, open to global founders relocating",
          "20–30% of fund reserved for follow-on into top performers",
          "12-week accelerator program delivered as part of investment",
        ],
      },
      {
        heading: "Fund Economics",
        desc: "The financial terms LPs agree to. Transparency here builds trust. Hidden or unclear fees are the fastest way to lose LP confidence.",
        details: [
          "Management fee: 2% of committed capital/year (or 0% for Fund I — strong signal to LPs)",
          "Carried interest: 20% of net profits above the hurdle rate",
          "Hurdle rate: 8% preferred return — GPs earn no carry until LPs get 8% annually",
          "GP commit: personal capital invested alongside LPs ($10K–$25K minimum — skin in the game)",
          "Fund life: 7–10 years with optional 1–2 year extensions (venture is long-duration)",
          "Clawback provision: GP returns excess carry at fund wind-down if over-distributed",
          "No fund capital used for non-fund expenses — clean separation required",
        ],
      },
      {
        heading: "Reporting & Transparency",
        desc: "Where you build (or destroy) LP trust. Over-communicate in Year 1. Silence makes LPs nervous. Structure your updates and stick to the schedule.",
        details: [
          "Quarterly LP updates: portfolio status, company metrics, key milestones, next steps",
          "Annual audited financial statements (CBB requirement for exempt CIUs)",
          "Annual LP meeting or advisory committee call",
          "Capital call notices with 10–15 business days advance notice",
          "Distribution notices when exits or returns occur",
          "Full transparency on all fees, expenses, and any conflicts of interest",
          "Immediate notification of material events (founder departure, pivot, shut-down)",
        ],
      },
      {
        heading: "Governance & LP Protections",
        desc: "LPs need assurance their money is protected and that you can't act against their interests. These are standard institutional terms — having them in Fund I signals professionalism.",
        details: [
          "LP Advisory Committee (LPAC): 2–3 largest LPs advise on conflicts and co-investments",
          "Key person clause: if either founding partner leaves, fund pauses new investments",
          "No-fault termination: supermajority LP vote (75%+) can remove GP for cause",
          "Concentration limit: no single startup receives more than 25% of total fund capital",
          "Conflict of interest policy: GPs cannot invest personally in deals the fund passes on without LPAC approval",
          "No self-dealing: fund cannot invest in entities owned by or affiliated with the GPs",
          "Removal triggers: fraud, gross negligence, material breach of LPA, bankruptcy of GP",
        ],
      },
    ],
  },
  {
    id: "docs", title: "Key Documents", icon: "📄",
    items: [
      {
        heading: "Fund Formation Documents",
        desc: "Everything you need before accepting LP capital. Have these reviewed by a fund formation lawyer — template versions exist but need Bahrain-specific customization.",
        details: [
          "Limited Partnership Agreement (LPA) — master contract defining GP/LP relationship, economics, governance",
          "Offering Memorandum (OM) — investment thesis, strategy, risks, team, fee structure, conflicts policy",
          "Subscription Agreement — LP commitment form, accredited investor certification, AML/KYC declarations",
          "Capital Call & Distribution Notice templates — standardized for consistency",
          "Side Letter template — for any LP-specific customizations (use sparingly in Fund I)",
          "CBB Notification Form — required for exempt CIU registration",
        ],
      },
      {
        heading: "Portfolio Company Documents",
        desc: "Standardized investment and program documents for each startup in the cohort. Consistency protects both the fund and the founders.",
        details: [
          "Post-money SAFE agreement — based on YC standard, adapted for Bahrain jurisdiction",
          "Founder Participation Agreement — program terms, weekly commitments, milestone expectations",
          "Information Rights agreement — right to receive financial updates, cap table access",
          "Pro-rata Rights Letter — right to maintain ownership % in subsequent funding rounds",
          "IP Assignment Confirmation — founders certify all IP is owned by the company, not personally",
          "Board observer rights (for follow-on investments at priced rounds)",
        ],
      },
      {
        heading: "Bahrain Regulatory Requirements",
        desc: "Specific CBB and MOICT requirements for operating a fund in Bahrain. The regulatory environment is founder-friendly but has specific compliance needs.",
        details: [
          "CBB notification/registration for Exempt CIU — can offer to investors 5 days after filing",
          "Commercial Registration (CR) with Ministry of Industry, Commerce & Tourism",
          "Appointment of Bahrain-based independent external auditor",
          "Fund administration conducted from Bahrain (can be self-administered by operator)",
          "AML/CFT compliance under CBB framework — KYC on all LP onboarding",
          "Annual report to CBB within 4 months of fiscal year-end",
          "Quarterly NAV reporting to CBB (for monitoring purposes only)",
        ],
      },
    ],
  },
  {
    id: "tax", title: "Tax & Repatriation", icon: "💱",
    items: [
      {
        heading: "Bahrain Tax Advantages",
        desc: "One of the most tax-efficient fund domiciles in the MENA region. No income tax, no capital gains tax, and no restrictions on moving money in or out.",
        details: [
          "No income tax on fund returns or carried interest",
          "No capital gains tax on investment exits",
          "No withholding tax on distributions to LPs (domestic or foreign)",
          "VAT at 5% applies to management fees and advisory services — not to investment returns",
          "No restrictions on repatriation of profits or capital",
          "BHD pegged to USD at fixed rate (1 BHD = $2.659) — zero currency risk for USD investors",
          "No exchange controls, no parallel exchange rate, no black market",
          "U.S.-Bahrain Bilateral Investment Treaty provides additional protections for U.S. investors",
        ],
      },
      {
        heading: "LP Tax Considerations",
        desc: "While Bahrain itself is tax-neutral, LPs may have tax obligations in their home jurisdictions. This is their responsibility, but you should flag it.",
        details: [
          "Bahrain-resident individual LPs: no local tax implications on fund distributions",
          "GCC-resident LPs: generally no tax on venture fund returns across GCC",
          "U.S.-resident LPs: subject to U.S. tax on worldwide income — need K-1 equivalent reporting",
          "EU-resident LPs: may trigger CRS/FATCA reporting requirements",
          "Institutional LPs (sovereign funds, family offices): typically tax-exempt but may need structure confirmation",
          "Recommend each LP consult their own tax advisor for home-country obligations",
        ],
      },
    ],
  },
];

const monthMap = {
  Mar: [3], Apr: [4], May: [5], Jun: [6], Jul: [7], Aug: [8],
  Sep: [9], Oct: [10], Nov: [11], Dec: [12],
  "Mar–Apr": [3, 4], "Apr–May": [4, 5], "May–Jul": [5, 6, 7],
  "Jun–Sep": [6, 7, 8, 9], "Jul–Aug": [7, 8], "Aug–Sep": [8, 9],
  "Aug–Dec": [8, 9, 10, 11, 12], "Sep–Dec": [9, 10, 11, 12],
  "Oct–Dec": [10, 11, 12], "Apr–Jul": [4, 5, 6, 7],
};

export default function DeltaVWorkstreams() {
  const [activeTab, setActiveTab] = useState("workstreams");
  const [activeStream, setActiveStream] = useState(null);
  const [activePhase, setActivePhase] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);
  const [activeLegalSection, setActiveLegalSection] = useState(null);
  const [activeLegalItem, setActiveLegalItem] = useState(null);
  const isMobile = useIsMobile();

  const selected = WORKSTREAMS.find((w) => w.id === activeStream);
  const selectedPhase = selected && activePhase !== null ? selected.phases[activePhase] : null;

  const tabs = [
    { id: "workstreams", label: "Workstreams", icon: "⚙️" },
    { id: "scenarios", label: "Scenarios", icon: "🎯" },
    { id: "legal", label: "Legal & LP Terms", icon: "📋" },
    { id: "legalhub", label: "Docs & Pivots", icon: "🧭" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a12", color: "#e8e8e8", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: isMobile ? "16px 16px 12px" : "24px 28px 14px", borderBottom: "1px solid rgba(233,69,96,0.2)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: isMobile ? "8px" : "10px", marginBottom: "3px" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: isMobile ? "20px" : "24px", fontWeight: 700, color: "#E94560" }}>ΔV</span>
          <span style={{ fontSize: isMobile ? "14px" : "18px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#fff" }}>Operations Map</span>
        </div>
        <p style={{ color: "#555", fontSize: isMobile ? "9px" : "11px", fontFamily: "'Space Mono', monospace", margin: 0 }}>
          {isMobile ? "6 workstreams · 4 scenarios · legal · pivots · 2026" : "6 workstreams · 4 scenarios · full legal structure · pivot engine · 2026"}
        </p>
      </div>

      {/* Main tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setActiveStream(null); setActivePhase(null); setActiveScenario(null); setActiveLegalSection(null); setActiveLegalItem(null); }}
            style={{
              flex: 1, padding: isMobile ? "10px 4px" : "12px 12px", background: activeTab === t.id ? "rgba(233,69,96,0.1)" : "transparent",
              border: "none", borderBottom: activeTab === t.id ? "2px solid #E94560" : "2px solid transparent",
              color: activeTab === t.id ? "#E94560" : "#555", cursor: "pointer", transition: "all 0.2s",
              fontSize: isMobile ? "8px" : "11px", fontWeight: 700, letterSpacing: isMobile ? "0.5px" : "1px", textTransform: "uppercase",
              fontFamily: "'Space Mono', monospace", display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? "3px" : "6px",
            }}>
            <span style={{ fontSize: isMobile ? "13px" : "14px" }}>{t.icon}</span>{isMobile ? t.label.split(" ")[0] : t.label}
          </button>
        ))}
      </div>

      {/* WORKSTREAMS */}
      {activeTab === "workstreams" && (
        <div>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.06)", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            {WORKSTREAMS.map((w) => (
              <button key={w.id} onClick={() => { setActiveStream(activeStream === w.id ? null : w.id); setActivePhase(null); }}
                style={{
                  flex: isMobile ? "0 0 auto" : "1 1 0", minWidth: isMobile ? "64px" : "90px", padding: isMobile ? "10px 8px" : "12px 6px",
                  background: activeStream === w.id ? `${w.color}18` : "transparent",
                  border: "none", borderBottom: activeStream === w.id ? `2px solid ${w.color}` : "2px solid transparent",
                  color: activeStream === w.id ? w.color : "#555", cursor: "pointer", transition: "all 0.2s",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                }}>
                <span style={{ fontSize: isMobile ? "14px" : "16px" }}>{w.icon}</span>
                <span style={{ fontSize: isMobile ? "7px" : "9px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>{isMobile ? w.label.split(" ")[0] : w.label}</span>
              </button>
            ))}
          </div>

          {!selected ? (
            <div style={{ padding: isMobile ? "16px 12px" : "24px 28px" }}>
              <p style={{ color: "#777", fontSize: isMobile ? "11px" : "12px", marginBottom: isMobile ? "16px" : "24px", lineHeight: 1.6, maxWidth: "560px" }}>
                Six parallel workstreams. Tap any one to see phase-by-phase breakdown with tasks and deliverables.
              </p>
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <div style={{ display: "grid", gridTemplateColumns: `${isMobile ? "100px" : "140px"} repeat(10, ${isMobile ? "44px" : "1fr"})`, gap: 0, marginBottom: "2px", minWidth: isMobile ? "540px" : "auto" }}>
                  <div />
                  {QUARTERS.map((q) => (
                    <div key={q.label} style={{ textAlign: "center", fontSize: "9px", fontFamily: "'Space Mono', monospace", color: "#444", letterSpacing: "1px", padding: "5px 0" }}>{q.label}</div>
                  ))}
                </div>
                {WORKSTREAMS.map((w) => (
                  <div key={w.id} onClick={() => { setActiveStream(w.id); setActivePhase(null); }}
                    style={{ display: "grid", gridTemplateColumns: `${isMobile ? "100px" : "140px"} repeat(10, ${isMobile ? "44px" : "1fr"})`, gap: 0, marginBottom: "2px", cursor: "pointer", borderRadius: "3px", minWidth: isMobile ? "540px" : "auto" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 4px" }}>
                      <span style={{ fontSize: "13px" }}>{w.icon}</span>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: w.color }}>{w.label}</div>
                        <div style={{ fontSize: "8px", color: "#444", fontFamily: "'Space Mono', monospace" }}>{w.tagline}</div>
                      </div>
                    </div>
                    {QUARTERS.map((q) => {
                      const ap = w.phases.filter((p) => (monthMap[p.timeline] || []).includes(q.month));
                      const phase = ap[0];
                      let isS = false, isE = false;
                      if (phase) { const m = monthMap[phase.timeline] || []; isS = q.month === m[0]; isE = q.month === m[m.length - 1]; }
                      return (
                        <div key={q.label} style={{ padding: "8px 1px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {phase ? (
                            <div style={{ width: "100%", height: "22px", background: `${w.color}30`, borderRadius: `${isS ? "11px" : 0} ${isE ? "11px" : 0} ${isE ? "11px" : 0} ${isS ? "11px" : 0}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {isS && <span style={{ fontSize: "7px", color: w.color, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 3px" }}>{phase.name}</span>}
                            </div>
                          ) : <div style={{ width: "100%", height: "22px", borderBottom: "1px solid rgba(255,255,255,0.03)" }} />}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: isMobile ? "16px 12px" : "22px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: isMobile ? "18px" : "22px" }}>{selected.icon}</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: selected.color }}>{selected.label}</h2>
                  <p style={{ margin: 0, fontSize: "11px", color: "#555", fontFamily: "'Space Mono', monospace" }}>{selected.tagline}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "5px", marginTop: "14px", marginBottom: "18px", flexWrap: "wrap" }}>
                {selected.phases.map((phase, i) => (
                  <button key={i} onClick={() => setActivePhase(activePhase === i ? null : i)}
                    style={{
                      padding: isMobile ? "6px 10px" : "7px 12px", background: activePhase === i ? selected.color : "rgba(255,255,255,0.04)",
                      border: `1px solid ${activePhase === i ? selected.color : "rgba(255,255,255,0.08)"}`, borderRadius: "7px",
                      color: activePhase === i ? "#fff" : "#777", cursor: "pointer", transition: "all 0.2s",
                      display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1px", flex: isMobile ? "1 1 calc(50% - 4px)" : "1 1 110px", minWidth: isMobile ? "0" : "110px",
                    }}>
                    <span style={{ fontSize: "11px", fontWeight: 700 }}>{phase.name}</span>
                    <span style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace", opacity: 0.7 }}>{phase.timeline}</span>
                  </button>
                ))}
              </div>
              {selectedPhase ? (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "9px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff" }}>{selectedPhase.name}</h3>
                    <span style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace", color: selected.color, background: `${selected.color}15`, padding: "3px 8px", borderRadius: "16px" }}>{selectedPhase.timeline} 2026</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                    {selectedPhase.tasks.map((task, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "9px", padding: "7px 10px", background: "rgba(255,255,255,0.02)", borderRadius: "5px", borderLeft: `2px solid ${selected.color}40` }}>
                        <span style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace", color: selected.color, minWidth: "16px", opacity: 0.6 }}>{String(i + 1).padStart(2, "0")}</span>
                        <span style={{ fontSize: "11px", color: "#ccc", lineHeight: 1.5 }}>{task}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "10px 12px", background: `${selected.color}10`, borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace", color: selected.color, fontWeight: 700, letterSpacing: "1px" }}>OUTPUT →</span>
                    <span style={{ fontSize: "11px", color: "#fff", fontWeight: 500 }}>{selectedPhase.output}</span>
                  </div>
                </div>
              ) : (
                <div style={{ color: "#333", fontSize: "11px", fontFamily: "'Space Mono', monospace", padding: "28px 0", textAlign: "center" }}>↑ Select a phase</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SCENARIOS */}
      {activeTab === "scenarios" && (
        <div style={{ padding: isMobile ? "16px 12px" : "24px 28px" }}>
          <p style={{ color: "#777", fontSize: isMobile ? "11px" : "12px", marginBottom: isMobile ? "14px" : "20px", lineHeight: 1.6, maxWidth: "580px" }}>
            Four scenarios for 2026. Each maps conditions, LP outcome, key risk, and estimated probability. Plan for base case. Prepare for slow start.
          </p>
          <div style={{ display: "flex", gap: "6px", marginBottom: isMobile ? "14px" : "20px", flexWrap: "wrap" }}>
            {SCENARIOS.map((s) => (
              <button key={s.id} onClick={() => setActiveScenario(activeScenario === s.id ? null : s.id)}
                style={{
                  flex: isMobile ? "1 1 calc(50% - 4px)" : "1 1 130px", minWidth: isMobile ? "0" : "130px", padding: isMobile ? "8px 10px" : "10px 14px",
                  background: activeScenario === s.id ? `${s.color}20` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeScenario === s.id ? s.color : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "9px", cursor: "pointer", transition: "all 0.2s",
                  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "3px",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "16px" }}>{s.icon}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: activeScenario === s.id ? s.color : "#888" }}>{s.label}</span>
                </div>
                <span style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace", color: activeScenario === s.id ? s.color : "#444" }}>{s.probability}</span>
              </button>
            ))}
          </div>

          {activeScenario && (() => {
            const s = SCENARIOS.find((x) => x.id === activeScenario);
            return (
              <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${s.color}30`, borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${s.color}20` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff" }}>{s.title}</h3>
                    <span style={{ fontSize: "10px", fontFamily: "'Space Mono', monospace", color: s.color, background: `${s.color}15`, padding: "3px 9px", borderRadius: "16px" }}>{s.probability}</span>
                  </div>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace", color: s.color, fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>WHAT HAPPENS</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {s.conditions.map((c, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "5px 9px", background: "rgba(255,255,255,0.02)", borderRadius: "5px" }}>
                          <span style={{ fontSize: "9px", color: s.color, fontFamily: "'Space Mono', monospace", minWidth: "14px" }}>{String(i + 1).padStart(2, "0")}</span>
                          <span style={{ fontSize: "11px", color: "#ccc", lineHeight: 1.5 }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px" }}>
                    <div style={{ padding: isMobile ? "10px 12px" : "12px 14px", background: `${s.color}08`, borderRadius: "7px", borderLeft: `3px solid ${s.color}` }}>
                      <div style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace", color: s.color, fontWeight: 700, letterSpacing: "1px", marginBottom: "6px" }}>LP OUTCOME</div>
                      <p style={{ margin: 0, fontSize: "11px", color: "#aaa", lineHeight: 1.6 }}>{s.lp_outcome}</p>
                    </div>
                    <div style={{ padding: "12px 14px", background: "rgba(239,68,68,0.06)", borderRadius: "7px", borderLeft: "3px solid #ef4444" }}>
                      <div style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace", color: "#ef4444", fontWeight: 700, letterSpacing: "1px", marginBottom: "6px" }}>KEY RISK</div>
                      <p style={{ margin: 0, fontSize: "11px", color: "#aaa", lineHeight: 1.6 }}>{s.risk}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {!activeScenario && <div style={{ color: "#333", fontSize: "11px", fontFamily: "'Space Mono', monospace", padding: "36px 0", textAlign: "center" }}>↑ Select a scenario to explore</div>}
        </div>
      )}

      {/* LEGAL */}
      {activeTab === "legal" && (
        <div style={{ padding: isMobile ? "16px 12px" : "24px 28px" }}>
          <p style={{ color: "#777", fontSize: isMobile ? "11px" : "12px", marginBottom: isMobile ? "14px" : "20px", lineHeight: 1.6, maxWidth: "600px" }}>
            Fund vehicle options under CBB regulations, LP commitments, required documents, and tax structure. Informed by Bahrain's regulatory framework — not legal advice.
          </p>
          <div style={{ display: "flex", gap: "5px", marginBottom: isMobile ? "14px" : "20px", flexWrap: "wrap" }}>
            {LEGAL_SECTIONS.map((sec) => (
              <button key={sec.id} onClick={() => { setActiveLegalSection(activeLegalSection === sec.id ? null : sec.id); setActiveLegalItem(null); }}
                style={{
                  flex: isMobile ? "1 1 calc(50% - 4px)" : "1 1 140px", minWidth: isMobile ? "0" : "140px", padding: isMobile ? "8px 10px" : "10px 14px",
                  background: activeLegalSection === sec.id ? "rgba(233,69,96,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeLegalSection === sec.id ? "#E94560" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "9px", cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                <span style={{ fontSize: "16px" }}>{sec.icon}</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: activeLegalSection === sec.id ? "#E94560" : "#777" }}>{sec.title}</span>
              </button>
            ))}
          </div>

          {activeLegalSection && (() => {
            const sec = LEGAL_SECTIONS.find((s) => s.id === activeLegalSection);
            return (
              <div>
                {sec.items.map((item, idx) => {
                  const isOpen = activeLegalItem === idx;
                  return (
                    <div key={idx} style={{ marginBottom: "6px", background: "rgba(255,255,255,0.02)", border: `1px solid ${isOpen ? "rgba(233,69,96,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: "9px", overflow: "hidden", transition: "border 0.2s" }}>
                      <button onClick={() => setActiveLegalItem(isOpen ? null : idx)}
                        style={{ width: "100%", padding: isMobile ? "12px 14px" : "14px 18px", background: "transparent", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ margin: 0, fontSize: isMobile ? "12px" : "13px", fontWeight: 700, color: isOpen ? "#E94560" : "#ddd" }}>{item.heading}</h4>
                          <p style={{ margin: "3px 0 0", fontSize: "10px", color: "#555", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isMobile ? "normal" : "nowrap" }}>{item.desc}</p>
                        </div>
                        <span style={{ fontSize: "16px", color: isOpen ? "#E94560" : "#333", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", marginLeft: "12px", flexShrink: 0 }}>▾</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: "0 18px 16px" }}>
                          <p style={{ fontSize: "11px", color: "#999", lineHeight: 1.7, marginBottom: "14px", marginTop: 0 }}>{item.desc}</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            {item.details.map((d, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "9px", padding: "7px 10px", background: "rgba(255,255,255,0.02)", borderRadius: "5px", borderLeft: "2px solid rgba(233,69,96,0.3)" }}>
                                <span style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace", color: "#E94560", minWidth: "14px", opacity: 0.6 }}>{String(i + 1).padStart(2, "0")}</span>
                                <span style={{ fontSize: "11px", color: "#ccc", lineHeight: 1.5 }}>{d}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {!activeLegalSection && <div style={{ color: "#333", fontSize: "11px", fontFamily: "'Space Mono', monospace", padding: "36px 0", textAlign: "center" }}>↑ Select a section to explore</div>}

          <div style={{ marginTop: "20px", padding: "12px 16px", background: "rgba(239,68,68,0.06)", borderLeft: "3px solid #ef4444", borderRadius: "0 7px 7px 0", fontSize: "10px", color: "#777", lineHeight: 1.6 }}>
            <strong style={{ color: "#ef4444" }}>Not legal advice.</strong> Fund formation requires a qualified Bahrain lawyer familiar with CBB regulations. Terms should be tailored to your situation and negotiated with LPs.
          </div>
        </div>
      )}

      {/* LEGAL HUB — DOCS, TREE, PIVOTS */}
      {activeTab === "legalhub" && <LegalHub />}
    </div>
  );
}
