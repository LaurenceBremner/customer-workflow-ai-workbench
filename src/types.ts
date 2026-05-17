export type StageStatus = "blocked" | "review" | "ready" | "shipped";

export type WorkflowStage = {
  id: string;
  label: string;
  owner: string;
  status: StageStatus;
  evidence: string;
};

export type IntegrationCheck = {
  id: string;
  system: string;
  check: string;
  status: StageStatus;
  detail: string;
  latencyMs: number;
};

export type EvalCase = {
  id: string;
  input: string;
  expected: string;
  actual: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  status: "pass" | "review" | "fail";
};

export type ReviewItem = {
  id: string;
  user: string;
  issue: string;
  decision: string;
  risk: "low" | "medium" | "high";
};

export type ProductSignal = {
  id: string;
  signal: string;
  evidence: string;
  roadmapAction: string;
  impact: number;
};

export type CustomerScenario = {
  id: string;
  name: string;
  customer: string;
  stakeholder: string;
  problem: string;
  workflow: string;
  firstValue: string;
  constraints: string[];
  prototype: {
    appName: string;
    scope: string;
    dataInputs: string[];
    acceptanceCriteria: string[];
  };
  stages: WorkflowStage[];
  integrations: IntegrationCheck[];
  evalCases: EvalCase[];
  reviewQueue: ReviewItem[];
  productSignals: ProductSignal[];
};
