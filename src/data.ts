import type { CustomerScenario } from "./types";

export const scenarios: CustomerScenario[] = [
  {
    id: "seller-ops",
    name: "Seller onboarding to first value",
    customer: "Marketplace operations team",
    stakeholder: "Ops lead",
    problem:
      "New sellers submit incomplete data across forms, spreadsheets, and support threads. The team needs a guided app that spots missing fields, explains blockers, and produces a launch-ready checklist.",
    workflow:
      "Intake seller data, map it to a canonical schema, flag missing evidence, route uncertain records to human review, and generate a first-value launch pack.",
    firstValue: "Reduce manual onboarding triage from 45 minutes to 12 minutes per seller without removing human sign-off.",
    constraints: [
      "Must handle incomplete CSV uploads",
      "Must explain each blocked launch decision",
      "Must keep human review for high-risk records",
      "Must produce a shareable launch checklist",
    ],
    prototype: {
      appName: "Seller Launch Desk",
      scope: "Working slice for CSV intake, schema mapping, validation, review queue, and launch brief.",
      dataInputs: ["seller_profile.csv", "product_feed.csv", "support_notes.txt"],
      acceptanceCriteria: [
        "Map 95%+ of known fields to canonical schema",
        "Escalate uncertain compliance answers below 0.74 confidence",
        "Generate launch checklist with every blocker linked to source evidence",
      ],
    },
    stages: [
      { id: "discover", label: "Discovery", owner: "Solutions", status: "ready", evidence: "Workflow map agreed with Ops lead" },
      { id: "prototype", label: "Prototype", owner: "Solutions + customer", status: "ready", evidence: "CSV intake and launch brief live" },
      { id: "integrate", label: "Integrations", owner: "Engineering", status: "review", evidence: "Schema drift on product_feed.category" },
      { id: "evaluate", label: "Evaluation", owner: "Product", status: "ready", evidence: "18/20 eval cases pass" },
      { id: "review", label: "Human review", owner: "Ops", status: "review", evidence: "6 records queued for sign-off" },
      { id: "product", label: "Product feedback", owner: "PM", status: "ready", evidence: "3 platform asks logged" },
    ],
    integrations: [
      { id: "csv", system: "CSV upload", check: "Header and type validation", status: "ready", detail: "All required seller fields present", latencyMs: 210 },
      { id: "notes", system: "Support notes", check: "Entity extraction", status: "ready", detail: "Seller IDs matched in 17/18 notes", latencyMs: 420 },
      { id: "schema", system: "Product feed", check: "Schema evolution", status: "review", detail: "New category field needs mapping approval", latencyMs: 390 },
      { id: "export", system: "Launch brief", check: "Checklist export", status: "ready", detail: "Brief export simulated", latencyMs: 160 },
    ],
    evalCases: [
      { id: "E01", input: "Missing insurance document but strong profile match", expected: "Escalate to review", actual: "Escalate to review", confidence: 0.81, severity: "high", status: "pass" },
      { id: "E02", input: "Unknown category in product feed", expected: "Block launch", actual: "Escalate to review", confidence: 0.63, severity: "medium", status: "review" },
      { id: "E03", input: "Duplicate seller ID in support notes", expected: "Merge and flag", actual: "Merge and flag", confidence: 0.88, severity: "medium", status: "pass" },
      { id: "E04", input: "Unsupported fulfilment region", expected: "Block launch", actual: "Block launch", confidence: 0.92, severity: "high", status: "pass" },
    ],
    reviewQueue: [
      { id: "R01", user: "Ops lead", issue: "Category remap needs policy approval", decision: "Approve temporary mapping and log product gap", risk: "medium" },
      { id: "R02", user: "Compliance reviewer", issue: "Insurance evidence confidence 0.69", decision: "Hold launch until document uploaded", risk: "high" },
      { id: "R03", user: "Seller success", issue: "Support note contradicts seller form", decision: "Request clarification from seller", risk: "medium" },
    ],
    productSignals: [
      { id: "P01", signal: "Customers need reusable schema drift handling", evidence: "2/4 integration checks hit category drift", roadmapAction: "Add connector field-mapping review surface", impact: 88 },
      { id: "P02", signal: "Human review should be first-class", evidence: "High-risk records require auditable sign-off", roadmapAction: "Ship review queue primitive with decision log", impact: 82 },
      { id: "P03", signal: "First-value artifact matters", evidence: "Ops lead wanted shareable launch checklist", roadmapAction: "Add exportable implementation brief template", impact: 74 },
    ],
  },
  {
    id: "sales-followup",
    name: "Enterprise follow-up copilot",
    customer: "B2B revenue team",
    stakeholder: "Sales operations",
    problem:
      "Account executives need a post-call app that turns transcripts into next steps, CRM updates, risk flags, and manager-review items without hallucinated commitments.",
    workflow:
      "Ingest transcript, extract commitments, compare against account plan, draft CRM update, and route uncertain claims to manager review.",
    firstValue: "Cut post-call admin from 25 minutes to 7 minutes while keeping account-risk review intact.",
    constraints: [
      "No invented commitments",
      "Every next step must cite source transcript lines",
      "Risk flags must route to manager review",
      "CRM fields must pass contract checks",
    ],
    prototype: {
      appName: "Account Follow-up Desk",
      scope: "Working slice for transcript ingestion, commitment extraction, CRM validation, review queue, and follow-up brief.",
      dataInputs: ["call_transcript.txt", "account_plan.json", "crm_schema.json"],
      acceptanceCriteria: [
        "Cite every extracted commitment",
        "Escalate unsupported next steps below 0.8 confidence",
        "Produce CRM-ready fields that pass schema checks",
      ],
    },
    stages: [
      { id: "discover", label: "Discovery", owner: "Solutions", status: "ready", evidence: "AE and sales ops workflow mapped" },
      { id: "prototype", label: "Prototype", owner: "Product", status: "ready", evidence: "Transcript-to-CRM slice complete" },
      { id: "integrate", label: "Integrations", owner: "Engineering", status: "ready", evidence: "CRM schema checks pass" },
      { id: "evaluate", label: "Evaluation", owner: "Product", status: "review", evidence: "Unsupported commitment case needs threshold change" },
      { id: "review", label: "Human review", owner: "Sales manager", status: "ready", evidence: "Risk queue produces manager decisions" },
      { id: "product", label: "Product feedback", owner: "PM", status: "ready", evidence: "Citation and review primitives logged" },
    ],
    integrations: [
      { id: "transcript", system: "Transcript import", check: "Speaker and timestamp parsing", status: "ready", detail: "8 speakers normalised", latencyMs: 280 },
      { id: "crm", system: "CRM schema", check: "Required field validation", status: "ready", detail: "Opportunity fields valid", latencyMs: 180 },
      { id: "account-plan", system: "Account plan", check: "Plan comparison", status: "ready", detail: "3 commitments matched to goals", latencyMs: 240 },
      { id: "citation", system: "Citation engine", check: "Source-line coverage", status: "review", detail: "One follow-up lacks source line", latencyMs: 340 },
    ],
    evalCases: [
      { id: "E01", input: "Customer asks for security doc next week", expected: "Create cited follow-up", actual: "Create cited follow-up", confidence: 0.9, severity: "medium", status: "pass" },
      { id: "E02", input: "AE says maybe pricing changes", expected: "Do not create firm commitment", actual: "Create tentative commitment", confidence: 0.62, severity: "high", status: "fail" },
      { id: "E03", input: "Customer raises migration risk", expected: "Route to manager review", actual: "Route to manager review", confidence: 0.84, severity: "high", status: "pass" },
      { id: "E04", input: "Next meeting scheduled verbally", expected: "Update CRM date", actual: "Update CRM date", confidence: 0.87, severity: "low", status: "pass" },
    ],
    reviewQueue: [
      { id: "R01", user: "Sales manager", issue: "Pricing comment lacks firm buyer commitment", decision: "Remove from CRM, keep as note", risk: "high" },
      { id: "R02", user: "AE", issue: "Migration concern needs owner", decision: "Assign solutions engineer follow-up", risk: "medium" },
      { id: "R03", user: "RevOps", issue: "Missing source citation", decision: "Require transcript line before export", risk: "medium" },
    ],
    productSignals: [
      { id: "P01", signal: "Citation coverage is a platform requirement", evidence: "Unsupported commitment case failed", roadmapAction: "Add citation-required output type", impact: 91 },
      { id: "P02", signal: "Manager review loop matters", evidence: "High-risk revenue claims need approval", roadmapAction: "Add approval routing primitive", impact: 78 },
      { id: "P03", signal: "CRM schema checks reduce support burden", evidence: "Schema pass/fail is easy to explain", roadmapAction: "Connector contract-test templates", impact: 72 },
    ],
  },
  {
    id: "support-triage",
    name: "Support triage to product signal",
    customer: "Customer success team",
    stakeholder: "Head of support",
    problem:
      "Support leaders need a workflow that clusters tickets into root causes, separates product bugs from education issues, and turns repeated customer pain into roadmap evidence.",
    workflow:
      "Classify support tickets, detect repeated failure modes, route low-confidence items to review, and create a PM-ready product brief.",
    firstValue: "Turn 500 tickets into a prioritised product brief in one review session rather than a week of manual tagging.",
    constraints: [
      "Keep examples anonymised",
      "Expose confidence and review thresholds",
      "Separate product defects from training needs",
      "Produce PM-ready evidence, not just tags",
    ],
    prototype: {
      appName: "Support Signal Desk",
      scope: "Working slice for ticket classification, confidence review, root-cause clusters, and PM brief generation.",
      dataInputs: ["tickets.csv", "feature_taxonomy.json", "release notes file"],
      acceptanceCriteria: [
        "Classify themes with confidence and source examples",
        "Queue ambiguous tickets for support review",
        "Generate roadmap brief with impact and evidence",
      ],
    },
    stages: [
      { id: "discover", label: "Discovery", owner: "Solutions", status: "ready", evidence: "Support tagging pain mapped" },
      { id: "prototype", label: "Prototype", owner: "Product", status: "ready", evidence: "Ticket-to-brief flow built" },
      { id: "integrate", label: "Integrations", owner: "Engineering", status: "review", evidence: "Release-note import has duplicate headings" },
      { id: "evaluate", label: "Evaluation", owner: "Product + support", status: "ready", evidence: "Classifier precision above threshold" },
      { id: "review", label: "Human review", owner: "Support", status: "ready", evidence: "Ambiguous tickets queued" },
      { id: "product", label: "Product feedback", owner: "PM", status: "shipped", evidence: "Top issue moved to roadmap review" },
    ],
    integrations: [
      { id: "tickets", system: "Ticket export", check: "PII scrub and import", status: "ready", detail: "Synthetic anonymised sample loaded", latencyMs: 310 },
      { id: "taxonomy", system: "Feature taxonomy", check: "Theme alignment", status: "ready", detail: "12 mapped feature groups", latencyMs: 190 },
      { id: "release", system: "Release notes", check: "Change matching", status: "review", detail: "Duplicate headings require cleanup", latencyMs: 260 },
      { id: "brief", system: "PM brief", check: "Evidence export", status: "ready", detail: "Brief includes examples and confidence", latencyMs: 150 },
    ],
    evalCases: [
      { id: "E01", input: "Multiple users cannot complete invite flow", expected: "Product defect", actual: "Product defect", confidence: 0.91, severity: "high", status: "pass" },
      { id: "E02", input: "User asks how to change billing email", expected: "Education issue", actual: "Education issue", confidence: 0.86, severity: "low", status: "pass" },
      { id: "E03", input: "Workflow fails after release note change", expected: "Regression candidate", actual: "Regression candidate", confidence: 0.79, severity: "high", status: "review" },
      { id: "E04", input: "User confused by naming", expected: "UX copy issue", actual: "UX copy issue", confidence: 0.82, severity: "medium", status: "pass" },
    ],
    reviewQueue: [
      { id: "R01", user: "Support lead", issue: "Regression candidate needs release match", decision: "Send to PM with top examples", risk: "high" },
      { id: "R02", user: "PM", issue: "Invite-flow defect repeats across segments", decision: "Move to roadmap review", risk: "high" },
      { id: "R03", user: "Support trainer", issue: "Billing-email issue is education gap", decision: "Update help centre", risk: "low" },
    ],
    productSignals: [
      { id: "P01", signal: "Repeated invite-flow defect", evidence: "31% of high-severity tickets in sample", roadmapAction: "Add invite-flow resilience workstream", impact: 94 },
      { id: "P02", signal: "Release-note matching should be automatic", evidence: "Regression candidate needed manual match", roadmapAction: "Add release-aware triage check", impact: 80 },
      { id: "P03", signal: "Education gaps need different routing", evidence: "Low-risk billing issues are docs problems", roadmapAction: "Split product defect vs education routing", impact: 68 },
    ],
  },
];
