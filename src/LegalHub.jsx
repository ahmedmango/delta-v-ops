import { useState, useRef, useEffect, useCallback } from "react";
import useIsMobile from "./useIsMobile.js";

// ─── DOCUMENT TEMPLATES ────────────────────────────────────────────────────
const DOC_TEMPLATES = [
  {
    id: "lpa",
    category: "fund",
    title: "Limited Partnership Agreement (LPA)",
    icon: "📜",
    priority: "CRITICAL",
    when: "Before first close",
    purpose: "Master contract governing the entire GP/LP relationship — economics, governance, investment restrictions, reporting, and wind-down.",
    sections: [
      {
        name: "Definitions & Interpretation",
        sample: `"Commitment" means the aggregate amount a Limited Partner agrees to contribute.\n"Carried Interest" means 20% of Net Profits above the Hurdle Rate.\n"Investment Period" means the 3-year period from First Close during which the Fund may make new investments.\n"SAFE" means a Simple Agreement for Future Equity, as adapted for Bahrain jurisdiction.`,
      },
      {
        name: "Capital Commitments & Drawdowns",
        sample: `Each LP commits a minimum of $25,000. The GP shall deliver Capital Call Notices at least 10 business days prior to the drawdown date. No single Capital Call shall exceed 25% of an LP's total Commitment without 30 days' notice. Failure to fund within 5 business days of the deadline triggers default provisions.`,
      },
      {
        name: "Management Fee & Carry",
        sample: `Management Fee: 2% per annum of total Commitments during the Investment Period; 2% of invested capital thereafter.\nCarried Interest: 20% of Net Profits, subject to an 8% preferred return (compounded annually) and a 100% GP catch-up.\nClawback: At wind-down, the GP shall return any excess Carried Interest so that cumulative distributions reflect the agreed waterfall.`,
      },
      {
        name: "Investment Restrictions",
        sample: `No single investment shall exceed 25% of total Fund capital.\nThe Fund shall invest exclusively via post-money SAFE instruments at the pre-seed stage.\nNo investments in entities affiliated with the GP or its principals without LPAC approval.\n20-30% of Fund capital shall be reserved for follow-on investments.`,
      },
      {
        name: "Governance & LP Protections",
        sample: `An LP Advisory Committee (LPAC) of the 2-3 largest LPs shall be constituted within 30 days of First Close.\nKey Person: If Ahmed Al-Haffadh ceases active involvement, the Fund shall suspend new investments pending LP vote.\nNo-Fault Removal: 75%+ LP vote (by committed capital) may remove the GP.\nConflicts: GP shall not co-invest personally in any opportunity presented to or passed on by the Fund without LPAC consent.`,
      },
      {
        name: "Reporting & Audit",
        sample: `Quarterly reports within 45 days of quarter-end: portfolio status, NAV, company metrics.\nAnnual audited financials within 90 days of fiscal year-end.\nAnnual LP meeting (in-person or virtual).\nImmediate notification of Material Events: founder departure, company shut-down, pivot, or follow-on raise.`,
      },
      {
        name: "Term & Wind-Down",
        sample: `Fund Term: 7 years from First Close, with two optional 1-year extensions (LP majority vote required).\nWind-Down: GP shall use commercially reasonable efforts to liquidate remaining positions. Distributions in-kind permitted with LPAC approval.\nFinal audit and distribution within 12 months of termination date.`,
      },
    ],
  },
  {
    id: "om",
    category: "fund",
    title: "Offering Memorandum (OM)",
    icon: "📋",
    priority: "CRITICAL",
    when: "Before LP outreach",
    purpose: "The sales document AND legal disclosure — investment thesis, strategy, risks, team, fee structure. Must be accurate; material misrepresentations create liability.",
    sections: [
      {
        name: "Executive Summary",
        sample: `Delta V Fund I ("the Fund") is a $500K–$1M pre-seed venture fund domiciled in Bahrain. The Fund invests $25K–$50K via post-money SAFEs into 3–5 startups per cohort, supported by a 12-week accelerator program.\n\nTarget returns: 5–10x gross over a 7–10 year fund life.\nGeneral Partner: Delta V Management Co. W.L.L.\nMinimum LP commitment: $25,000.`,
      },
      {
        name: "Investment Thesis",
        sample: `Bahrain and the broader MENA region have an emerging but underserved pre-seed ecosystem. The Fund targets founders with exceptional execution speed and domain insight, regardless of sector.\n\nOur edge: (1) founder-first selection optimized for grit and speed, (2) a structured 12-week program that compresses 6 months of learning, (3) deep local networks for distribution and follow-on.`,
      },
      {
        name: "Risk Factors",
        sample: `• Venture capital investments are highly illiquid and speculative.\n• Pre-seed stage companies have a high failure rate (estimated 70–90%).\n• The Fund is a first-time fund with no prior track record.\n• Bahrain's startup ecosystem is nascent — exit pathways are limited.\n• Currency risk is minimal (BHD/USD peg) but regional instability is possible.\n• The GP is a key person — loss of the GP could materially impact Fund performance.`,
      },
      {
        name: "Use of Proceeds",
        sample: `65–70% → Direct startup investments (SAFEs)\n20–30% → Follow-on reserve\n0–2% → Management fee (or waived in Fund I)\nRemaining → Fund operating expenses (legal, audit, admin)`,
      },
    ],
  },
  {
    id: "safe",
    category: "portfolio",
    title: "Post-Money SAFE Agreement",
    icon: "📝",
    priority: "CRITICAL",
    when: "At founder onboarding (Week 1)",
    purpose: "The investment instrument. Post-money SAFE means you know your exact ownership % at signing. Based on YC standard, adapted for Bahrain law.",
    sections: [
      {
        name: "Core Terms",
        sample: `Investment Amount: $[25,000–50,000]\nPost-Money Valuation Cap: $[1,000,000–2,500,000]\nDiscount Rate: [None / 20%]\n\nConversion triggers:\n(a) Equity Financing of $250,000+ → converts at the lower of the cap or discount\n(b) Liquidity Event → investor receives the greater of (i) purchase amount or (ii) conversion shares\n(c) Dissolution → investor receives purchase amount before any distribution to common holders`,
      },
      {
        name: "Pro-Rata Rights",
        sample: `The Investor shall have the right (but not the obligation) to participate in the next Equity Financing round on a pro-rata basis, calculated as the ratio of the Investor's converted shares to fully-diluted capitalization.\n\nThis right is transferable to the Fund's successor vehicles.`,
      },
      {
        name: "Information Rights",
        sample: `The Company shall provide:\n- Monthly financial updates (burn rate, revenue, runway)\n- Quarterly cap table snapshot\n- Immediate notification of: (a) new financing, (b) acquisition offers, (c) material pivots, (d) key personnel changes\n- Access to annual financial statements (audited if revenue exceeds $1M)`,
      },
      {
        name: "Bahrain Adaptation Clauses",
        sample: `Governing Law: Kingdom of Bahrain.\nDispute Resolution: Bahrain Chamber for Dispute Resolution (BCDR).\nCurrency: All amounts denominated in USD; payments accepted in BHD at the prevailing CBB exchange rate.\nRegulatory: This instrument is offered pursuant to CBB's Exempt CIU framework and is available only to accredited investors.`,
      },
    ],
  },
  {
    id: "subscription",
    category: "fund",
    title: "Subscription Agreement",
    icon: "✍️",
    priority: "HIGH",
    when: "At LP commitment",
    purpose: "The form each LP signs to commit capital. Includes accredited investor verification, AML/KYC, and commitment amount.",
    sections: [
      {
        name: "LP Commitment",
        sample: `I, [Name], hereby commit to contribute $[Amount] to Delta V Fund I.\n\nPayment Schedule: Capital shall be drawn down via Capital Call Notices over the Investment Period.\nI acknowledge that my Commitment is irrevocable once accepted by the GP.\nMinimum Commitment: $25,000.`,
      },
      {
        name: "Accredited Investor Declaration",
        sample: `I represent and warrant that I qualify as an "Accredited Investor" under CBB regulations:\n☐ Individual net worth (or joint with spouse) exceeds $1,000,000 excluding primary residence\n☐ Individual income exceeded $200,000 in each of the past two years ($300,000 jointly)\n☐ I am a Qualified Institutional Buyer\n☐ I am a licensed financial institution or regulated entity`,
      },
      {
        name: "AML/KYC",
        sample: `Required documentation:\n- Government-issued photo ID (passport or national ID)\n- Proof of address (utility bill or bank statement, dated within 3 months)\n- Source of funds declaration\n- For entities: Certificate of incorporation, beneficial ownership register, board resolution authorizing investment`,
      },
    ],
  },
  {
    id: "founder-agreement",
    category: "portfolio",
    title: "Founder Participation Agreement",
    icon: "🤝",
    priority: "HIGH",
    when: "Before Cohort start",
    purpose: "Sets expectations for the 12-week program — attendance, milestones, equity, and what founders commit to in exchange for the investment + program.",
    sections: [
      {
        name: "Program Commitments",
        sample: `The Founder agrees to:\n- Participate full-time in the 12-week Delta V program\n- Attend all weekly group sessions and 1-on-1 office hours\n- Submit weekly progress updates by Friday 6PM\n- Present at Demo Day (Week 12)\n- Remain based in Bahrain for the duration of the program\n\nFailure to meet commitments may result in termination from the program (investment terms remain in effect).`,
      },
      {
        name: "Milestone Framework",
        sample: `Weeks 1–3 (Foundation): Problem validation, 20+ customer interviews completed\nWeeks 4–6 (Build): MVP/prototype launched, first users acquired\nWeeks 7–9 (Traction): Measurable growth metric identified and tracked\nWeeks 10–12 (Launch): Pitch refined, follow-on fundraising strategy defined\n\nMilestones are directional — pivots are expected and encouraged if data supports them.`,
      },
      {
        name: "IP & Equity",
        sample: `The Founder confirms:\n- All intellectual property developed during the program is owned by the Company (not personally)\n- No pre-existing IP conflicts exist\n- Standard 4-year vesting with 1-year cliff applies to all founders\n- The Company's cap table is accurate and complete as of the program start date`,
      },
    ],
  },
  {
    id: "cbb-notification",
    category: "regulatory",
    title: "CBB Exempt CIU Notification",
    icon: "🏛️",
    priority: "CRITICAL",
    when: "Before accepting any LP capital",
    purpose: "The filing that makes your fund legal in Bahrain. Exempt CIU status means light regulation — notify CBB, wait 5 days, then you can accept investors.",
    sections: [
      {
        name: "Fund Details",
        sample: `Fund Name: Delta V Fund I\nFund Type: Exempt Collective Investment Undertaking (CIU)\nDomicile: Kingdom of Bahrain\nOperator: Delta V Management Co. W.L.L.\nExternal Auditor: [Bahrain-based audit firm]\nTarget Size: $500,000–$1,000,000\nInvestor Type: Accredited investors only (minimum $25,000 commitment)`,
      },
      {
        name: "Investment Strategy",
        sample: `The Fund will make pre-seed investments of $25,000–$50,000 via post-money SAFE agreements into early-stage technology companies.\nInvestments will be made through a structured 12-week accelerator program.\nTarget portfolio: 6–10 companies per year across 1–2 cohorts.\nFollow-on reserve: 20–30% of committed capital.`,
      },
      {
        name: "Compliance Commitments",
        sample: `The Fund commits to:\n- Appointing a Bahrain-based external auditor within 30 days of First Close\n- Filing annual reports within 4 months of fiscal year-end\n- Maintaining all fund administration records in Bahrain\n- Complying with CBB AML/CFT requirements for all LP onboarding\n- Reporting quarterly NAV to CBB`,
      },
    ],
  },
  {
    id: "side-letter",
    category: "fund",
    title: "Side Letter Template",
    icon: "📎",
    priority: "MEDIUM",
    when: "Negotiated with specific LPs",
    purpose: "Custom terms for individual LPs — fee discounts, co-invest rights, advisory roles. Use sparingly in Fund I to avoid complexity.",
    sections: [
      {
        name: "Common Provisions",
        sample: `Management Fee Reduction: LP shall pay [1.5%/1.0%/0%] management fee in lieu of the standard 2%.\nCo-Investment Rights: LP shall have first right to co-invest in any deal exceeding the Fund's single-company concentration limit.\nAdvisory Role: LP shall serve on the LP Advisory Committee (LPAC).\nMFN Clause: LP shall receive the benefit of any more favorable terms granted to other LPs via side letter.`,
      },
    ],
  },
  {
    id: "quarterly-report",
    category: "reporting",
    title: "Quarterly LP Report Template",
    icon: "📊",
    priority: "HIGH",
    when: "Every quarter after First Close",
    purpose: "The regular touchpoint that builds or destroys LP trust. Over-communicate in Year 1. Structure it so LPs can scan in 2 minutes or read deeply.",
    sections: [
      {
        name: "Report Structure",
        sample: `1. EXECUTIVE SUMMARY (1 paragraph)\n   Fund status, capital deployed, key wins/challenges this quarter.\n\n2. PORTFOLIO OVERVIEW\n   Company | Investment | Valuation Cap | Status | Key Metric\n   --------|-----------|--------------|--------|----------\n   Co. A   | $35K SAFE | $1.5M        | Active | 200 users\n   Co. B   | $50K SAFE | $2.0M        | Active | $8K MRR\n\n3. PROGRAM UPDATE\n   Cohort progress, mentor sessions completed, upcoming Demo Day.\n\n4. FUND FINANCIALS\n   Capital called to date | Capital deployed | Management fees | Cash on hand\n\n5. OUTLOOK & NEXT STEPS\n   What's coming next quarter, any asks of LPs.`,
      },
    ],
  },
];

// ─── DECISION TREE ─────────────────────────────────────────────────────────
const DECISION_NODES = [
  // Layer 0: Start
  {
    id: "start",
    label: "Delta V\nFund Launch",
    type: "start",
    x: 450,
    y: 30,
    layer: 0,
  },
  // Layer 1: First gate
  {
    id: "entity",
    label: "Register\nEntity",
    type: "action",
    x: 450,
    y: 120,
    layer: 1,
    detail: "Register Delta V Management Co. W.L.L. in Bahrain + open bank accounts",
  },
  // Layer 2: Structure decision
  {
    id: "structure_q",
    label: "Fund structure\ndecision?",
    type: "decision",
    x: 450,
    y: 220,
    layer: 2,
    detail: "Choose based on LP pipeline confidence and regulatory appetite",
  },
  {
    id: "exempt_ciu",
    label: "Exempt CIU\n(Recommended)",
    type: "action",
    x: 250,
    y: 330,
    layer: 3,
    detail: "Notify CBB → 5-day wait → operational. Lightest regulation.",
  },
  {
    id: "ilp",
    label: "Investment\nLtd Partnership",
    type: "action",
    x: 450,
    y: 330,
    layer: 3,
    detail: "GP/LP structure. More setup but familiar to institutional LPs.",
  },
  {
    id: "spv",
    label: "Deal-by-Deal\nSPV (Fallback)",
    type: "action",
    x: 650,
    y: 330,
    layer: 3,
    detail: "No blind pool. Each deal separate. Use if fund raise stalls.",
  },
  // Layer 4: Fund docs
  {
    id: "fund_docs",
    label: "Prepare\nFund Docs",
    type: "action",
    x: 350,
    y: 430,
    layer: 4,
    detail: "LPA + OM + Subscription Agreement + SAFE template. Engage fund lawyer.",
  },
  {
    id: "spv_docs",
    label: "Prepare\nSPV Docs",
    type: "action",
    x: 650,
    y: 430,
    layer: 4,
    detail: "Per-deal subscription docs. Simpler but repetitive per investment.",
  },
  // Layer 5: LP Raise
  {
    id: "lp_raise",
    label: "LP\nFundraising",
    type: "action",
    x: 350,
    y: 530,
    layer: 5,
    detail: "Target 30 LPs. Prioritize warm intros. Run 15–20 meetings in 4 weeks.",
  },
  // Layer 6: Raise outcome
  {
    id: "raise_q",
    label: "First close\nresult?",
    type: "decision",
    x: 350,
    y: 630,
    layer: 6,
  },
  {
    id: "strong_close",
    label: "$250K+\nClosed",
    type: "success",
    x: 150,
    y: 740,
    layer: 7,
    detail: "Green light for full Cohort 1. Deploy capital into 3–5 startups.",
  },
  {
    id: "weak_close",
    label: "$100K–$250K\nPartial",
    type: "warning",
    x: 350,
    y: 740,
    layer: 7,
    detail: "Run smaller cohort (2–3 startups). Keep raising in parallel.",
  },
  {
    id: "stalled",
    label: "Under $100K\nStalled",
    type: "danger",
    x: 550,
    y: 740,
    layer: 7,
    detail: "Pivot to bootstrapped pilot or SPV model. Don't stop — adapt.",
  },
  // Layer 8: Program paths
  {
    id: "full_cohort",
    label: "Full Cohort 1\n3–5 Startups",
    type: "action",
    x: 150,
    y: 850,
    layer: 8,
    detail: "12-week program. SAFEs signed. Mentors activated. Weekly cadence.",
  },
  {
    id: "small_cohort",
    label: "Mini Cohort\n1–2 Startups",
    type: "action",
    x: 350,
    y: 850,
    layer: 8,
    detail: "Prove the model with fewer startups. Use as case study for LPs.",
  },
  {
    id: "pivot_spv",
    label: "Pivot → SPV\nDeal-by-Deal",
    type: "pivot",
    x: 550,
    y: 850,
    layer: 8,
    detail: "Restructure as deal-by-deal. Each investor opts into specific startups.",
  },
  {
    id: "bootstrap",
    label: "Bootstrap\nPersonal $$$",
    type: "pivot",
    x: 720,
    y: 850,
    layer: 8,
    detail: "Invest personal money in 1–2 founders. Build track record for Fund II.",
  },
  // Layer 9: Demo Day
  {
    id: "demo_day_q",
    label: "Demo Day\noutcome?",
    type: "decision",
    x: 250,
    y: 960,
    layer: 9,
  },
  {
    id: "demo_hot",
    label: "🔥 Buzz\nFollow-on interest",
    type: "success",
    x: 100,
    y: 1070,
    layer: 10,
    detail: "Press coverage. Investors reach out. Cohort 2 apps flood in.",
  },
  {
    id: "demo_warm",
    label: "👍 Solid\nModest interest",
    type: "warning",
    x: 280,
    y: 1070,
    layer: 10,
    detail: "30–50 attendees. Some follow-on interest. Need to keep pushing.",
  },
  {
    id: "demo_flat",
    label: "😐 Flat\nLow turnout",
    type: "danger",
    x: 460,
    y: 1070,
    layer: 10,
    detail: "Premature or poorly timed. Document learnings. Regroup.",
  },
  // Layer 11: Year-end
  {
    id: "fund_close_q",
    label: "Year-end\nfund status?",
    type: "decision",
    x: 250,
    y: 1170,
    layer: 11,
  },
  {
    id: "full_close",
    label: "Fund Closed\n$500K–$1M",
    type: "success",
    x: 80,
    y: 1280,
    layer: 12,
    detail: "Fund I complete. Begin Cohort 2 planning. Start thinking Fund II.",
  },
  {
    id: "partial_close",
    label: "Partial\n$300K–$500K",
    type: "warning",
    x: 260,
    y: 1280,
    layer: 12,
    detail: "Extend raise into Q1 2027. Use Cohort 1 results as proof points.",
  },
  {
    id: "restructure",
    label: "Restructure\nor Wind Down",
    type: "danger",
    x: 440,
    y: 1280,
    layer: 12,
    detail: "Under $300K — consider restructuring terms or returning capital. Preserve relationships.",
  },
  // Final layer: 2027 paths
  {
    id: "fund_ii",
    label: "🚀 Fund II\nPlanning",
    type: "goal",
    x: 80,
    y: 1390,
    layer: 13,
    detail: "Target $3–5M. Institutional LPs. Proven model. 2027–2028 launch.",
  },
  {
    id: "cohort_2",
    label: "Cohort 2\nLaunch",
    type: "goal",
    x: 260,
    y: 1390,
    layer: 13,
    detail: "Apply Cohort 1 learnings. Expand sourcing. Target 50+ applications.",
  },
  {
    id: "relaunch",
    label: "Relaunch\n2027",
    type: "pivot",
    x: 440,
    y: 1390,
    layer: 13,
    detail: "New structure, refined thesis, preserved LP relationships. Try again smarter.",
  },
];

const DECISION_EDGES = [
  { from: "start", to: "entity" },
  { from: "entity", to: "structure_q" },
  { from: "structure_q", to: "exempt_ciu", label: "Best for Fund I" },
  { from: "structure_q", to: "ilp", label: "Institutional" },
  { from: "structure_q", to: "spv", label: "If raise fails" },
  { from: "exempt_ciu", to: "fund_docs" },
  { from: "ilp", to: "fund_docs" },
  { from: "spv", to: "spv_docs" },
  { from: "fund_docs", to: "lp_raise" },
  { from: "lp_raise", to: "raise_q" },
  { from: "raise_q", to: "strong_close", label: "Strong" },
  { from: "raise_q", to: "weak_close", label: "Partial" },
  { from: "raise_q", to: "stalled", label: "Stalled" },
  { from: "strong_close", to: "full_cohort" },
  { from: "weak_close", to: "small_cohort" },
  { from: "stalled", to: "pivot_spv", label: "Pivot A" },
  { from: "stalled", to: "bootstrap", label: "Pivot B" },
  { from: "full_cohort", to: "demo_day_q" },
  { from: "small_cohort", to: "demo_day_q" },
  { from: "demo_day_q", to: "demo_hot", label: "Hot" },
  { from: "demo_day_q", to: "demo_warm", label: "Warm" },
  { from: "demo_day_q", to: "demo_flat", label: "Flat" },
  { from: "demo_hot", to: "fund_close_q" },
  { from: "demo_warm", to: "fund_close_q" },
  { from: "demo_flat", to: "fund_close_q" },
  { from: "fund_close_q", to: "full_close", label: "Closed" },
  { from: "fund_close_q", to: "partial_close", label: "Partial" },
  { from: "fund_close_q", to: "restructure", label: "Under $300K" },
  { from: "full_close", to: "fund_ii" },
  { from: "full_close", to: "cohort_2" },
  { from: "partial_close", to: "cohort_2" },
  { from: "restructure", to: "relaunch" },
  // Cross-links for pivots
  { from: "pivot_spv", to: "demo_day_q", label: "Still run program", dashed: true },
  { from: "bootstrap", to: "demo_day_q", label: "Proof of concept", dashed: true },
  { from: "spv_docs", to: "lp_raise", label: "Per-deal raise", dashed: true },
];

// ─── PIVOT STRATEGY ENGINE ─────────────────────────────────────────────────
const PIVOT_SCENARIOS = [
  {
    id: "lp_slow",
    trigger: "LP fundraising under $100K by June",
    icon: "💸",
    color: "#f59e0b",
    urgency: "HIGH",
    detection: "Track commitments weekly. If under $50K by April, this trigger is live.",
    pivots: [
      {
        name: "Compress & Bootstrap",
        speed: 95,
        risk: 30,
        description: "Invest $25K–$50K of personal capital into 1–2 founders. Run a lean 8-week program. Use results as proof-of-concept for LPs.",
        steps: [
          "Stop broad LP outreach — focus on 3–5 highest-probability LPs only",
          "Select 1–2 founders from existing pipeline immediately",
          "Sign SAFEs with personal capital ($25K each)",
          "Run compressed 8-week program",
          "Demo Day becomes your LP pitch event",
          "Convert results into Fund I marketing material",
        ],
        endState: "You have a portfolio, a story, and proof. Fund I raise restarts from strength.",
      },
      {
        name: "SPV Pivot",
        speed: 80,
        risk: 40,
        description: "Restructure from blind-pool fund to deal-by-deal SPV model. Each LP chooses which startups to invest in. Lower commitment barrier.",
        steps: [
          "Notify existing LP pipeline of structure change",
          "Prepare per-deal SPV documentation (simpler than fund docs)",
          "Source 2–3 strong founders for the first SPV deals",
          "Offer LPs $10K minimum per deal (vs. $25K fund minimum)",
          "Run the accelerator program regardless of structure",
          "Track each SPV independently; aggregate reporting for your brand",
        ],
        endState: "Multiple SPVs = portfolio. Convert to Fund II after proving deal quality.",
      },
      {
        name: "Strategic Delay",
        speed: 40,
        risk: 60,
        description: "Pause Fund I. Spend 6 months building brand, network, and LP pipeline. Relaunch in Q1 2027 with stronger positioning.",
        steps: [
          "Communicate transparently with existing LP pipeline — don't burn bridges",
          "Spend 6 months speaking at events, publishing content, mentoring founders",
          "Build 3–5 advisor relationships with successful fund managers",
          "Refine thesis based on market feedback",
          "Relaunch with a larger LP target list (50+) and stronger brand",
          "Consider bringing on a co-GP with complementary network",
        ],
        endState: "Stronger relaunch. But 6 months lost. Only choose if pipeline is truly dead.",
      },
    ],
  },
  {
    id: "founder_dry",
    trigger: "Can't find founders who meet your bar",
    icon: "🔍",
    color: "#8b5cf6",
    urgency: "MEDIUM",
    detection: "If under 10 applications by April 15, or fewer than 2 qualified candidates after interviews.",
    pivots: [
      {
        name: "Lower the Bar Strategically",
        speed: 85,
        risk: 50,
        description: "Redefine 'quality' — focus on coachability and speed rather than prior experience. Many great founders don't look like founders yet.",
        steps: [
          "Rewrite application to focus on mindset questions, not resume",
          "Add a 48-hour mini-challenge as part of selection (execution test)",
          "Expand to adjacent geographies (UAE, KSA, Oman, Jordan)",
          "Accept solo founders — don't require teams",
          "Consider pre-idea founders with exceptional backgrounds",
          "Run selection as a weekend bootcamp — watch them work, not just pitch",
        ],
        endState: "Wider funnel, different signal. You may find diamonds in unexpected places.",
      },
      {
        name: "EIR Program",
        speed: 60,
        risk: 35,
        description: "Instead of investing in existing startups, recruit exceptional people and help them find ideas. Entrepreneur-in-Residence model.",
        steps: [
          "Identify 3–5 exceptional operators from your network",
          "Offer small stipend ($2K–$5K/month for 3 months) to explore ideas",
          "Provide structure: weekly idea validation sprints",
          "EIRs who find product-market fit convert to standard SAFE investment",
          "Those who don't — you've built relationships and reputation",
          "Adjust fund terms if needed (LPAC approval for EIR structure)",
        ],
        endState: "You're building founders, not just finding them. Higher effort, potentially higher quality.",
      },
      {
        name: "Geographic Expansion",
        speed: 70,
        risk: 25,
        description: "Source beyond Bahrain. Run the program remotely or bring founders to Bahrain for the cohort.",
        steps: [
          "Partner with 2–3 accelerators/ecosystems in KSA, UAE, Egypt, Jordan",
          "Offer relocation stipend for non-Bahrain founders",
          "Run first 4 weeks remote, last 8 weeks in-person in Bahrain",
          "Leverage regional networks for sourcing (Flat6Labs alumni, etc.)",
          "Position Bahrain as a launchpad, not a limitation",
          "Adjust marketing: 'MENA's pre-seed accelerator, based in Bahrain'",
        ],
        endState: "10x the addressable founder pool. Bahrain becomes a feature, not a constraint.",
      },
    ],
  },
  {
    id: "cohort_fail",
    trigger: "Cohort 1 produces no traction by Demo Day",
    icon: "📉",
    color: "#ef4444",
    urgency: "HIGH",
    detection: "Week 8 check: if zero startups have users, revenue, or clear PMF signal.",
    pivots: [
      {
        name: "Honest Demo Day",
        speed: 90,
        risk: 45,
        description: "Don't fake results. Present what you learned, what the founders built, and what you'd do differently. Authenticity builds more trust than false success.",
        steps: [
          "Reframe Demo Day as 'Lessons from Cohort 1' — not a pitch event",
          "Each founder presents: problem explored, experiments run, what they learned",
          "You present: what the program got right, what changes for Cohort 2",
          "Invite LPs to see the process, not just the outcomes",
          "Publish a transparent retrospective publicly",
          "Use the honesty as a brand differentiator — 'we don't fake traction'",
        ],
        endState: "You lose the sizzle but gain massive credibility. Smart LPs respect honesty.",
      },
      {
        name: "Extended Program",
        speed: 50,
        risk: 55,
        description: "Don't end at Week 12 if startups need more time. Extend support for promising teams. Kill the rest cleanly.",
        steps: [
          "Week 8 review: rank startups by potential, not current traction",
          "Top 1–2 get 8-week extension with continued mentorship",
          "Bottom startups: honest conversation, clean wind-down support",
          "Delay Demo Day by 8 weeks for extended teams",
          "Use extension period for intensive customer development",
          "Communicate timeline change to LPs with clear rationale",
        ],
        endState: "More time might be what they need. But don't throw good money after bad.",
      },
      {
        name: "Salvage & Reposition",
        speed: 70,
        risk: 60,
        description: "If the startups aren't working, focus on what IS working: the program, the network, the brand. These are assets.",
        steps: [
          "Document the program methodology in detail — it's IP",
          "Turn mentor relationships into Cohort 2 pipeline advantages",
          "Write up each startup's journey as a case study",
          "Approach successful regional accelerators about partnerships",
          "Consider licensing your program to other ecosystems",
          "Reposition: 'Fund I was R&D. Fund II is production.'",
        ],
        endState: "Even failure produces assets. The question is whether you capture them.",
      },
    ],
  },
  {
    id: "key_person",
    trigger: "You burn out or face personal crisis",
    icon: "🧠",
    color: "#06b6d4",
    urgency: "CRITICAL",
    detection: "Self-awareness. If you're working 80+ hours and dreading the work, this is live.",
    pivots: [
      {
        name: "Co-GP Recruit",
        speed: 60,
        risk: 40,
        description: "Bring on a co-founder for the fund. Split the load. This is the strongest long-term move but takes time to find the right person.",
        steps: [
          "Identify 3–5 people who complement your skills (ops if you're sales, or vice versa)",
          "Have honest conversations about the workload and the opportunity",
          "Structure: equal carry split, defined responsibilities, kill clause if it doesn't work",
          "Transition LP relationships gradually — warm introductions",
          "Update fund docs to reflect new key person provisions",
          "Budget 2–3 months for this process — don't rush",
        ],
        endState: "A partner makes this sustainable. Solo GP is heroic but fragile.",
      },
      {
        name: "Reduce Scope",
        speed: 90,
        risk: 30,
        description: "Cut everything non-essential. 2 startups instead of 5. No events. No content. Just invest and support founders.",
        steps: [
          "Pause all LP fundraising beyond current commitments",
          "Reduce cohort to 2 startups maximum",
          "Cancel all speaking, content, and community activities",
          "Focus 100% on: supporting portfolio founders + self-care",
          "Hire a part-time admin ($1K–$2K/month) for LP reporting",
          "Set a 90-day check-in: reassess capacity and restart what you can",
        ],
        endState: "Sustainable pace > burnout. A small cohort done well beats a big one done badly.",
      },
    ],
  },
  {
    id: "regulatory",
    trigger: "CBB changes rules or blocks Exempt CIU",
    icon: "⚖️",
    color: "#64748b",
    urgency: "MEDIUM",
    detection: "Monitor CBB regulatory updates. Engage lawyer for quarterly check-ins.",
    pivots: [
      {
        name: "ILP Conversion",
        speed: 50,
        risk: 30,
        description: "Convert from Exempt CIU to full Investment Limited Partnership. More paperwork but fully compliant.",
        steps: [
          "Engage fund formation lawyer immediately",
          "Draft ILP constitutive documents",
          "Notify existing LPs of structure change (should not affect their terms)",
          "Re-register with CBB under ILP framework",
          "Budget $10K–$20K for legal conversion costs",
          "Timeline: 6–8 weeks for full conversion",
        ],
        endState: "Legally secure. ILP is the 'grown-up' structure for larger funds anyway.",
      },
      {
        name: "Offshore Restructure",
        speed: 30,
        risk: 50,
        description: "Move fund domicile to ADGM, DIFC, or Cayman. Nuclear option. Expensive but proven jurisdictions.",
        steps: [
          "Evaluate ADGM (Abu Dhabi) vs DIFC (Dubai) vs Cayman",
          "ADGM is most cost-effective for small funds (~$5K–$15K setup)",
          "Re-domicile fund entity and update all LP agreements",
          "Maintain Bahrain operating presence for program delivery",
          "Budget $20K–$40K total for restructure",
          "This is a 3–6 month process — plan accordingly",
        ],
        endState: "Jurisdiction risk eliminated. But added complexity and cost.",
      },
    ],
  },
];

// ─── NODE COLORS ───────────────────────────────────────────────────────────
const NODE_STYLES = {
  start: { bg: "#E94560", border: "#E94560", text: "#fff" },
  action: { bg: "rgba(15,52,96,0.6)", border: "#0F3460", text: "#8bb4e0" },
  decision: { bg: "rgba(233,69,96,0.15)", border: "#E94560", text: "#E94560" },
  success: { bg: "rgba(34,197,94,0.15)", border: "#22c55e", text: "#22c55e" },
  warning: { bg: "rgba(245,158,11,0.15)", border: "#f59e0b", text: "#f59e0b" },
  danger: { bg: "rgba(239,68,68,0.15)", border: "#ef4444", text: "#ef4444" },
  pivot: { bg: "rgba(139,92,246,0.15)", border: "#8b5cf6", text: "#8b5cf6" },
  goal: { bg: "rgba(34,197,94,0.25)", border: "#22c55e", text: "#fff" },
};

// ─── CANVAS FLOW DIAGRAM ──────────────────────────────────────────────────
function FlowDiagram() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const [scale, setScale] = useState(isMobile ? 0.45 : 0.85);

  const W = 900;
  const H = 1480;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    // Draw edges
    DECISION_EDGES.forEach((edge) => {
      const from = DECISION_NODES.find((n) => n.id === edge.from);
      const to = DECISION_NODES.find((n) => n.id === edge.to);
      if (!from || !to) return;

      ctx.beginPath();
      ctx.strokeStyle = edge.dashed
        ? "rgba(139,92,246,0.3)"
        : "rgba(233,69,96,0.25)";
      ctx.lineWidth = edge.dashed ? 1 : 1.5;
      if (edge.dashed) ctx.setLineDash([4, 4]);
      else ctx.setLineDash([]);

      const fx = from.x + 50;
      const fy = from.y + 35;
      const tx = to.x + 50;
      const ty = to.y;

      ctx.moveTo(fx, fy);
      const midY = (fy + ty) / 2;
      ctx.bezierCurveTo(fx, midY, tx, midY, tx, ty);
      ctx.stroke();

      // Edge label
      if (edge.label) {
        const lx = (fx + tx) / 2;
        const ly = (fy + ty) / 2 - 4;
        ctx.font = "9px 'Space Mono', monospace";
        ctx.fillStyle = edge.dashed
          ? "rgba(139,92,246,0.5)"
          : "rgba(233,69,96,0.5)";
        ctx.textAlign = "center";
        ctx.fillText(edge.label, lx, ly);
      }
    });

    // Draw nodes
    DECISION_NODES.forEach((node) => {
      const style = NODE_STYLES[node.type];
      const isHovered = hoveredNode === node.id;
      const nw = 100;
      const nh = node.type === "decision" ? 45 : 35;
      const x = node.x;
      const y = node.y;

      ctx.save();
      if (isHovered) {
        ctx.shadowColor = style.border;
        ctx.shadowBlur = 12;
      }

      // Node shape
      if (node.type === "decision") {
        // Diamond-ish rounded rect
        ctx.beginPath();
        const r = 8;
        ctx.roundRect(x, y, nw, nh, r);
        ctx.fillStyle = isHovered
          ? style.border + "30"
          : style.bg;
        ctx.fill();
        ctx.strokeStyle = style.border;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.beginPath();
        ctx.roundRect(x, y, nw, nh, 6);
        ctx.fillStyle = isHovered
          ? style.border + "30"
          : style.bg;
        ctx.fill();
        ctx.strokeStyle = style.border;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();
      }

      ctx.restore();

      // Text
      const lines = node.label.split("\n");
      ctx.font =
        node.type === "start"
          ? "bold 10px 'Space Mono', monospace"
          : "9px 'DM Sans', sans-serif";
      ctx.fillStyle = style.text;
      ctx.textAlign = "center";
      lines.forEach((line, i) => {
        const ly =
          y + (nh / 2 - ((lines.length - 1) * 6) / 2) + i * 12;
        ctx.fillText(line, x + nw / 2, ly);
      });
    });
  }, [hoveredNode]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      dragStart.current = { x: e.clientX, y: e.clientY };
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / scale;
    const my = (e.clientY - rect.top) / scale;

    let found = null;
    for (const node of DECISION_NODES) {
      const nw = 100;
      const nh = node.type === "decision" ? 45 : 35;
      if (
        mx >= node.x &&
        mx <= node.x + nw &&
        my >= node.y &&
        my <= node.y + nh
      ) {
        found = node.id;
        break;
      }
    }
    setHoveredNode(found);
  };

  const handleMouseDown = (e) => {
    if (!hoveredNode) {
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => setDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.max(0.3, Math.min(2, s - e.deltaY * 0.001)));
  };

  const hovNode = hoveredNode
    ? DECISION_NODES.find((n) => n.id === hoveredNode)
    : null;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        {[
          { type: "action", label: "Action" },
          { type: "decision", label: "Decision Gate" },
          { type: "success", label: "Strong Outcome" },
          { type: "warning", label: "Partial" },
          { type: "danger", label: "Risk" },
          { type: "pivot", label: "Pivot" },
          { type: "goal", label: "End Goal" },
        ].map((l) => (
          <div
            key={l.type}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "9px",
              color: "#666",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background: NODE_STYLES[l.type].border,
                opacity: 0.7,
              }}
            />
            {l.label}
          </div>
        ))}
      </div>

      <div
        ref={containerRef}
        style={{
          overflow: "hidden",
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.3)",
          cursor: dragging ? "grabbing" : hoveredNode ? "pointer" : "grab",
          position: "relative",
          height: isMobile ? "380px" : "520px",
          touchAction: "none",
        }}
        onWheel={handleWheel}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            setDragging(true);
            dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }
        }}
        onTouchMove={(e) => {
          if (dragging && e.touches.length === 1) {
            const dx = e.touches[0].clientX - dragStart.current.x;
            const dy = e.touches[0].clientY - dragStart.current.y;
            setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
            dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }
        }}
        onTouchEnd={() => setDragging(false)}
      >
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ width: W, height: H }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setHoveredNode(null);
              setDragging(false);
            }}
          />
        </div>

        {/* Zoom controls */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            display: "flex",
            gap: "4px",
          }}
        >
          <button
            onClick={() => setScale((s) => Math.min(2, s + 0.15))}
            style={{
              width: "28px",
              height: "28px",
              background: "rgba(233,69,96,0.2)",
              border: "1px solid rgba(233,69,96,0.4)",
              borderRadius: "6px",
              color: "#E94560",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
          <button
            onClick={() => setScale((s) => Math.max(0.3, s - 0.15))}
            style={{
              width: "28px",
              height: "28px",
              background: "rgba(233,69,96,0.2)",
              border: "1px solid rgba(233,69,96,0.4)",
              borderRadius: "6px",
              color: "#E94560",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            −
          </button>
          <button
            onClick={() => {
              setScale(isMobile ? 0.45 : 0.85);
              setOffset({ x: 0, y: 0 });
            }}
            style={{
              height: "28px",
              padding: "0 8px",
              background: "rgba(233,69,96,0.2)",
              border: "1px solid rgba(233,69,96,0.4)",
              borderRadius: "6px",
              color: "#E94560",
              cursor: "pointer",
              fontSize: "9px",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Hover detail */}
      {hovNode && hovNode.detail && (
        <div
          style={{
            marginTop: "10px",
            padding: "12px 16px",
            background: `${NODE_STYLES[hovNode.type].border}10`,
            border: `1px solid ${NODE_STYLES[hovNode.type].border}30`,
            borderRadius: "8px",
            fontSize: "11px",
            color: "#bbb",
            lineHeight: 1.6,
          }}
        >
          <span
            style={{
              fontSize: "9px",
              fontFamily: "'Space Mono', monospace",
              color: NODE_STYLES[hovNode.type].border,
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            {hovNode.label.replace("\n", " ")} →
          </span>{" "}
          {hovNode.detail}
        </div>
      )}
    </div>
  );
}

// ─── MAIN LEGAL HUB COMPONENT ──────────────────────────────────────────────
export default function LegalHub() {
  const [subTab, setSubTab] = useState("docs");
  const [activeDoc, setActiveDoc] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePivotScenario, setActivePivotScenario] = useState(null);
  const [activePivotOption, setActivePivotOption] = useState(null);
  const isMobile = useIsMobile();

  const subTabs = [
    { id: "docs", label: "Document Vault", icon: "📄" },
    { id: "tree", label: "Decision Tree", icon: "🌳" },
    { id: "pivots", label: "Pivot Engine", icon: "⚡" },
  ];

  const categories = [
    { id: "all", label: "All" },
    { id: "fund", label: "Fund Formation" },
    { id: "portfolio", label: "Portfolio" },
    { id: "regulatory", label: "Regulatory" },
    { id: "reporting", label: "Reporting" },
  ];

  const filteredDocs =
    activeCategory === "all"
      ? DOC_TEMPLATES
      : DOC_TEMPLATES.filter((d) => d.category === activeCategory);

  const selectedDoc = DOC_TEMPLATES.find((d) => d.id === activeDoc);

  return (
    <div style={{ padding: "0" }}>
      {/* Sub-navigation */}
      <div
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        {subTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSubTab(t.id);
              setActiveDoc(null);
              setActiveSection(null);
              setActivePivotScenario(null);
              setActivePivotOption(null);
            }}
            style={{
              flex: 1,
              padding: isMobile ? "9px 4px" : "10px 8px",
              background:
                subTab === t.id ? "rgba(233,69,96,0.08)" : "transparent",
              border: "none",
              borderBottom:
                subTab === t.id
                  ? "2px solid #E94560"
                  : "2px solid transparent",
              color: subTab === t.id ? "#E94560" : "#444",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: isMobile ? "8px" : "10px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              fontFamily: "'Space Mono', monospace",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isMobile ? "3px" : "5px",
            }}
          >
            <span style={{ fontSize: "13px" }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ DOCUMENT VAULT ═══ */}
      {subTab === "docs" && (
        <div style={{ padding: isMobile ? "14px 12px" : "20px 24px" }}>
          <p
            style={{
              color: "#666",
              fontSize: "11px",
              marginBottom: "16px",
              lineHeight: 1.6,
              maxWidth: "600px",
            }}
          >
            Every document you need to launch Delta V Fund I — with sample
            language for each section. Not legal advice. Have a Bahrain fund
            formation lawyer review and customize everything.
          </p>

          {/* Category filter */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCategory(c.id);
                  setActiveDoc(null);
                  setActiveSection(null);
                }}
                style={{
                  padding: "5px 12px",
                  background:
                    activeCategory === c.id
                      ? "rgba(233,69,96,0.15)"
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeCategory === c.id ? "#E94560" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "20px",
                  color: activeCategory === c.id ? "#E94560" : "#555",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontWeight: 600,
                  transition: "all 0.15s",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Doc cards */}
          {!selectedDoc ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "8px",
              }}
            >
              {filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDoc(doc.id)}
                  style={{
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(233,69,96,0.3)";
                    e.currentTarget.style.background = "rgba(233,69,96,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.06)";
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.02)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{doc.icon}</span>
                    <span
                      style={{
                        fontSize: "8px",
                        fontFamily: "'Space Mono', monospace",
                        padding: "2px 7px",
                        borderRadius: "10px",
                        background:
                          doc.priority === "CRITICAL"
                            ? "rgba(239,68,68,0.15)"
                            : doc.priority === "HIGH"
                              ? "rgba(245,158,11,0.15)"
                              : "rgba(100,116,139,0.15)",
                        color:
                          doc.priority === "CRITICAL"
                            ? "#ef4444"
                            : doc.priority === "HIGH"
                              ? "#f59e0b"
                              : "#64748b",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {doc.priority}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#ddd",
                    }}
                  >
                    {doc.title}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#555",
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {doc.sections.length} sections · {doc.when}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              {/* Back button */}
              <button
                onClick={() => {
                  setActiveDoc(null);
                  setActiveSection(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#E94560",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontFamily: "'Space Mono', monospace",
                  marginBottom: "12px",
                  padding: 0,
                }}
              >
                ← Back to documents
              </button>

              {/* Doc header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontSize: "28px" }}>{selectedDoc.icon}</span>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {selectedDoc.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "4px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "8px",
                        fontFamily: "'Space Mono', monospace",
                        padding: "2px 7px",
                        borderRadius: "10px",
                        background:
                          selectedDoc.priority === "CRITICAL"
                            ? "rgba(239,68,68,0.15)"
                            : "rgba(245,158,11,0.15)",
                        color:
                          selectedDoc.priority === "CRITICAL"
                            ? "#ef4444"
                            : "#f59e0b",
                        fontWeight: 700,
                      }}
                    >
                      {selectedDoc.priority}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        color: "#555",
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      {selectedDoc.when}
                    </span>
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: "11px",
                  color: "#888",
                  lineHeight: 1.7,
                  marginBottom: "18px",
                  maxWidth: "600px",
                }}
              >
                {selectedDoc.purpose}
              </p>

              {/* Sections */}
              {selectedDoc.sections.map((sec, idx) => {
                const isOpen = activeSection === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "6px",
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${isOpen ? "rgba(233,69,96,0.3)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: "9px",
                      overflow: "hidden",
                      transition: "border 0.2s",
                    }}
                  >
                    <button
                      onClick={() =>
                        setActiveSection(isOpen ? null : idx)
                      }
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "9px",
                            fontFamily: "'Space Mono', monospace",
                            color: "#E94560",
                            opacity: 0.5,
                            minWidth: "16px",
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: isOpen ? "#E94560" : "#ccc",
                          }}
                        >
                          {sec.name}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: isOpen ? "#E94560" : "#333",
                          transition: "transform 0.2s",
                          transform: isOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        ▾
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "0 16px 16px" }}>
                        <div
                          style={{
                            background: "rgba(0,0,0,0.3)",
                            border: "1px solid rgba(233,69,96,0.15)",
                            borderRadius: "8px",
                            padding: "14px 16px",
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "10px",
                            color: "#999",
                            lineHeight: 1.8,
                            whiteSpace: "pre-wrap",
                            overflowX: "auto",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "8px",
                              color: "#E94560",
                              fontWeight: 700,
                              letterSpacing: "1.5px",
                              marginBottom: "10px",
                              paddingBottom: "6px",
                              borderBottom:
                                "1px solid rgba(233,69,96,0.15)",
                            }}
                          >
                            SAMPLE LANGUAGE — ADAPT WITH YOUR LAWYER
                          </div>
                          {sec.sample}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div
                style={{
                  marginTop: "16px",
                  padding: "10px 14px",
                  background: "rgba(239,68,68,0.06)",
                  borderLeft: "3px solid #ef4444",
                  borderRadius: "0 7px 7px 0",
                  fontSize: "10px",
                  color: "#777",
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: "#ef4444" }}>Not legal advice.</strong>{" "}
                Sample language is directional only. Have a qualified Bahrain
                fund formation lawyer draft your actual documents.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ DECISION TREE ═══ */}
      {subTab === "tree" && (
        <div style={{ padding: isMobile ? "14px 12px" : "20px 24px" }}>
          <p
            style={{
              color: "#666",
              fontSize: "11px",
              marginBottom: "16px",
              lineHeight: 1.6,
              maxWidth: "600px",
            }}
          >
            Every fork in the road from launch to year-end. Decision gates
            (dashed borders) are where you choose. Solid lines = primary path.
            Purple dashed lines = pivot paths. Drag to pan, scroll to zoom,
            hover nodes for details.
          </p>
          <FlowDiagram />
        </div>
      )}

      {/* ═══ PIVOT ENGINE ═══ */}
      {subTab === "pivots" && (
        <div style={{ padding: isMobile ? "14px 12px" : "20px 24px" }}>
          <p
            style={{
              color: "#666",
              fontSize: "11px",
              marginBottom: "16px",
              lineHeight: 1.6,
              maxWidth: "600px",
            }}
          >
            Pre-computed pivot strategies for every major risk. Each trigger has
            detection criteria and multiple pivot options ranked by speed and
            risk. Know your moves before you need them.
          </p>

          {/* Scenario cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginBottom: "16px",
            }}
          >
            {PIVOT_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActivePivotScenario(
                    activePivotScenario === s.id ? null : s.id
                  );
                  setActivePivotOption(null);
                }}
                style={{
                  padding: "12px 16px",
                  background:
                    activePivotScenario === s.id
                      ? `${s.color}12`
                      : "rgba(255,255,255,0.02)",
                  border: `1px solid ${activePivotScenario === s.id ? `${s.color}40` : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "10px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "22px" }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color:
                        activePivotScenario === s.id ? s.color : "#ccc",
                    }}
                  >
                    {s.trigger}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#555",
                      fontFamily: "'Space Mono', monospace",
                      marginTop: "2px",
                    }}
                  >
                    {s.pivots.length} pivot options · Urgency: {s.urgency}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "8px",
                    fontFamily: "'Space Mono', monospace",
                    padding: "3px 8px",
                    borderRadius: "10px",
                    background:
                      s.urgency === "CRITICAL"
                        ? "rgba(239,68,68,0.15)"
                        : s.urgency === "HIGH"
                          ? "rgba(245,158,11,0.15)"
                          : "rgba(100,116,139,0.15)",
                    color:
                      s.urgency === "CRITICAL"
                        ? "#ef4444"
                        : s.urgency === "HIGH"
                          ? "#f59e0b"
                          : "#64748b",
                    fontWeight: 700,
                  }}
                >
                  {s.urgency}
                </span>
              </button>
            ))}
          </div>

          {/* Expanded scenario */}
          {activePivotScenario &&
            (() => {
              const s = PIVOT_SCENARIOS.find(
                (x) => x.id === activePivotScenario
              );
              return (
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${s.color}25`,
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  {/* Detection */}
                  <div
                    style={{
                      padding: "14px 18px",
                      borderBottom: `1px solid ${s.color}15`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        fontFamily: "'Space Mono', monospace",
                        color: s.color,
                        fontWeight: 700,
                        letterSpacing: "1px",
                        marginBottom: "6px",
                      }}
                    >
                      EARLY DETECTION
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        color: "#aaa",
                        lineHeight: 1.6,
                      }}
                    >
                      {s.detection}
                    </p>
                  </div>

                  {/* Pivot options */}
                  <div style={{ padding: "14px 18px" }}>
                    <div
                      style={{
                        fontSize: "9px",
                        fontFamily: "'Space Mono', monospace",
                        color: s.color,
                        fontWeight: 700,
                        letterSpacing: "1px",
                        marginBottom: "10px",
                      }}
                    >
                      PIVOT OPTIONS
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        marginBottom: "14px",
                        flexWrap: "wrap",
                      }}
                    >
                      {s.pivots.map((p, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            setActivePivotOption(
                              activePivotOption === i ? null : i
                            )
                          }
                          style={{
                            flex: isMobile ? "1 1 100%" : "1 1 160px",
                            padding: isMobile ? "8px 12px" : "10px 14px",
                            background:
                              activePivotOption === i
                                ? `${s.color}15`
                                : "rgba(255,255,255,0.02)",
                            border: `1px solid ${activePivotOption === i ? s.color : "rgba(255,255,255,0.06)"}`,
                            borderRadius: "8px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.15s",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color:
                                activePivotOption === i ? s.color : "#bbb",
                              marginBottom: "6px",
                            }}
                          >
                            {p.name}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "12px",
                              fontSize: "9px",
                              fontFamily: "'Space Mono', monospace",
                            }}
                          >
                            <span style={{ color: "#22c55e" }}>
                              Speed {p.speed}%
                            </span>
                            <span style={{ color: "#ef4444" }}>
                              Risk {p.risk}%
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Selected pivot detail */}
                    {activePivotOption !== null &&
                      (() => {
                        const p = s.pivots[activePivotOption];
                        return (
                          <div
                            style={{
                              background: "rgba(0,0,0,0.2)",
                              border: `1px solid ${s.color}20`,
                              borderRadius: "9px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                padding: "14px 18px",
                                borderBottom: `1px solid ${s.color}15`,
                              }}
                            >
                              <h4
                                style={{
                                  margin: 0,
                                  fontSize: "13px",
                                  fontWeight: 700,
                                  color: "#fff",
                                  marginBottom: "6px",
                                }}
                              >
                                {p.name}
                              </h4>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "11px",
                                  color: "#888",
                                  lineHeight: 1.6,
                                }}
                              >
                                {p.description}
                              </p>

                              {/* Speed/Risk bars */}
                              <div
                                style={{
                                  display: "flex",
                                  gap: "16px",
                                  marginTop: "12px",
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontSize: "8px",
                                      fontFamily:
                                        "'Space Mono', monospace",
                                      color: "#22c55e",
                                      marginBottom: "4px",
                                      fontWeight: 700,
                                      letterSpacing: "1px",
                                    }}
                                  >
                                    EXECUTION SPEED
                                  </div>
                                  <div
                                    style={{
                                      height: "4px",
                                      background: "rgba(34,197,94,0.15)",
                                      borderRadius: "2px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${p.speed}%`,
                                        height: "100%",
                                        background: "#22c55e",
                                        borderRadius: "2px",
                                        transition: "width 0.5s ease",
                                      }}
                                    />
                                  </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontSize: "8px",
                                      fontFamily:
                                        "'Space Mono', monospace",
                                      color: "#ef4444",
                                      marginBottom: "4px",
                                      fontWeight: 700,
                                      letterSpacing: "1px",
                                    }}
                                  >
                                    RISK LEVEL
                                  </div>
                                  <div
                                    style={{
                                      height: "4px",
                                      background: "rgba(239,68,68,0.15)",
                                      borderRadius: "2px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${p.risk}%`,
                                        height: "100%",
                                        background: "#ef4444",
                                        borderRadius: "2px",
                                        transition: "width 0.5s ease",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Steps */}
                            <div style={{ padding: "14px 18px" }}>
                              <div
                                style={{
                                  fontSize: "9px",
                                  fontFamily: "'Space Mono', monospace",
                                  color: s.color,
                                  fontWeight: 700,
                                  letterSpacing: "1px",
                                  marginBottom: "10px",
                                }}
                              >
                                EXECUTION STEPS
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "5px",
                                }}
                              >
                                {p.steps.map((step, si) => (
                                  <div
                                    key={si}
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      gap: "9px",
                                      padding: "6px 10px",
                                      background:
                                        "rgba(255,255,255,0.02)",
                                      borderRadius: "5px",
                                      borderLeft: `2px solid ${s.color}40`,
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "9px",
                                        fontFamily:
                                          "'Space Mono', monospace",
                                        color: s.color,
                                        minWidth: "14px",
                                        opacity: 0.6,
                                      }}
                                    >
                                      {String(si + 1).padStart(2, "0")}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        color: "#bbb",
                                        lineHeight: 1.5,
                                      }}
                                    >
                                      {step}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* End state */}
                              <div
                                style={{
                                  marginTop: "12px",
                                  padding: "10px 14px",
                                  background: `${s.color}08`,
                                  borderRadius: "7px",
                                  borderLeft: `3px solid ${s.color}`,
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "8px",
                                    fontFamily:
                                      "'Space Mono', monospace",
                                    color: s.color,
                                    fontWeight: 700,
                                    letterSpacing: "1px",
                                    marginBottom: "4px",
                                  }}
                                >
                                  END STATE →
                                </div>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "11px",
                                    color: "#ccc",
                                    lineHeight: 1.6,
                                    fontWeight: 500,
                                  }}
                                >
                                  {p.endState}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                  </div>
                </div>
              );
            })()}
        </div>
      )}
    </div>
  );
}
