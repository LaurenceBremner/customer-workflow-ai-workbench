export type CheckStatus = "PASS" | "FAIL" | "AMBIG";

export interface ReadinessCheck {
  id: string;
  check: string;
  source: "profile" | "feed" | "cross" | "policy";
  status: CheckStatus;
  weight: number;
}

export interface ReadinessScore {
  score: number;
  threshold: number;
  verdict: "block" | "pilot" | "ready";
  failedChecks: number;
  ambiguousChecks: number;
}

export const northstarChecks: ReadinessCheck[] = [
  { id: "insurance", check: "Insurance document on file", source: "profile", status: "FAIL", weight: 0.3 },
  { id: "taxonomy", check: "Category mapped to taxonomy", source: "feed", status: "FAIL", weight: 0.25 },
  { id: "consistency", check: "Profile / support consistency", source: "cross", status: "AMBIG", weight: 0.2 },
  { id: "sku", check: "SKU count within band", source: "feed", status: "PASS", weight: 0.1 },
  { id: "kyc", check: "KYC / payout details valid", source: "profile", status: "PASS", weight: 0.15 },
];

export function scoreReadiness(checks: ReadinessCheck[], threshold = 0.7): ReadinessScore {
  const score = checks.reduce((total, check) => {
    if (check.status === "PASS") return total + check.weight;
    if (check.status === "AMBIG") return total + check.weight * 0.4;
    return total;
  }, 0);
  const rounded = Math.round(score * 100) / 100;
  const failedChecks = checks.filter((check) => check.status === "FAIL").length;
  const ambiguousChecks = checks.filter((check) => check.status === "AMBIG").length;
  const verdict = failedChecks > 0 || rounded < threshold ? "block" : ambiguousChecks > 0 ? "pilot" : "ready";

  return { score: rounded, threshold, verdict, failedChecks, ambiguousChecks };
}
