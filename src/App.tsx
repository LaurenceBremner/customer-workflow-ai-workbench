import { northstarChecks, scoreReadiness } from "./eval/scoring";

const repoUrl = "https://github.com/LaurenceBremner/customer-workflow-ai-workbench";
const companionUrl = "https://laurencebremner.github.io/startup-ai-deployment-eval-workbench/";

const score = scoreReadiness(northstarChecks);

const sources = [
  {
    name: "seller_profile.csv",
    tag: "conflict",
    rows: [
      ["insurance_status", "\"pending_review\""],
      ["liability_doc", "null"],
      ["last_updated", "6 days ago"],
    ],
  },
  {
    name: "product_feed.json",
    tag: "unmapped",
    rows: [
      ["skus", "47"],
      ["category", "\"artisan_baked_goods\""],
      ["taxonomy_match", "none"],
    ],
  },
  {
    name: "support_thread #4412",
    tag: "ambiguous",
    rows: [
      ["rep_note", "\"finance confirmed premium paid verbally\""],
      ["attachments", "0"],
    ],
  },
];

const codeLines = [
  "export function scoreReadiness(checks) {",
  "  return checks.reduce((s, c) => {",
  "    if (c.status === 'PASS') return s + c.weight;",
  "    if (c.status === 'AMBIG') return s + c.weight * 0.4;",
  "    return s;",
  "  }, 0);",
  "}",
];

export function App() {
  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href={repoUrl} target="_blank" rel="noreferrer">
          <span className="brand-mark">W</span>
          <strong>Workflow Evidence Board</strong>
          <span>Synthetic case study</span>
        </a>
        <nav aria-label="Case study links">
          <a href={`${repoUrl}/blob/main/src/eval/scoring.ts`} target="_blank" rel="noreferrer">Source</a>
          <a href={companionUrl}>Case II {"->"}</a>
        </nav>
        <p className="meta">Case 01 · v1.3 · 2026</p>
      </header>

      <section className="masthead" aria-labelledby="case-title">
        <div>
          <p className="kicker">Synthetic case study · Applied AI evaluation</p>
          <h1 id="case-title">Can <em>Northstar Granola</em> launch on Friday? Three internal systems disagree.</h1>
        </div>
        <p className="lede">
          A marketplace seller is days from launch. The seller profile, product feed, and support thread give contradictory signals, so the workflow needs an auditable decision.
        </p>
      </section>

      <section className="case-board" aria-label="Northstar Granola evaluation board">
        <article className="panel evidence">
          <span className="panel-num">01 · Evidence</span>
          <h2>What the systems say</h2>
          <p className="scenario">
            <strong>Northstar Granola</strong> wants to go live <span className="pill">FRI</span>. Three sources of truth do not agree.
          </p>
          <div className="sources">
            {sources.map((source) => (
              <section className="source" key={source.name}>
                <div className="source-head">
                  <strong>{source.name}</strong>
                  <span className={`source-tag ${source.tag}`}>{source.tag}</span>
                </div>
                <div className="source-body">
                  {source.rows.map(([key, value]) => (
                    <p key={key}><span className="k">{key}:</span> <span className="v">{value}</span></p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>

        <article className="panel eval-panel">
          <span className="panel-num">02 · Evaluation</span>
          <h2>Normalize, check, score</h2>
          <table className="eval-table">
            <thead>
              <tr><th>Check</th><th>Source</th><th>Status</th><th>Weight</th></tr>
            </thead>
            <tbody>
              {northstarChecks.map((check) => (
                <tr key={check.id}>
                  <td className="check-name">{check.check}</td>
                  <td className="check-src">{check.source}</td>
                  <td><span className={`status status-${check.status.toLowerCase()}`}>{check.status}</span></td>
                  <td>{check.weight.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="eval-bottom">
            <pre aria-label="Scoring code">
              <code>{codeLines.join("\n")}</code>
              <span>scoring.ts</span>
            </pre>
            <div className="eval-set">
              <h3>Eval set (synthetic)</h3>
              <strong>200 sellers</strong>
              <dl>
                <div><dt>Precision</dt><dd>0.91</dd></div>
                <div><dt>Recall</dt><dd>0.84</dd></div>
                <div><dt>False block</dt><dd>0.06</dd></div>
                <div><dt>F1</dt><dd>0.87</dd></div>
              </dl>
            </div>
          </div>
        </article>

        <aside className="panel decision">
          <span className="panel-num">03 · Decision</span>
          <h2>The call</h2>
          <div className="gauge" aria-label={`Readiness score ${score.score}`}>
            <div className="arc" />
            <div className="needle" />
            <strong>{score.score.toFixed(2)}<small>/1.00</small></strong>
            <span>Readiness score · threshold {score.threshold.toFixed(2)}</span>
          </div>
          <div className="verdict">
            <span>Verdict</span>
            <strong>Block launch · Route to repair</strong>
          </div>
          <section className="recommendations">
            <h3>Recommendation</h3>
            <ol>
              <li><strong>Repair</strong> mapped category node.</li>
              <li><strong>Human-verify</strong> insurance document.</li>
              <li><strong>Pilot</strong> for 14 days with manual sign-off.</li>
            </ol>
          </section>
        </aside>
      </section>

      <footer className="case-footer">
        <div><span>Role framing</span><strong>AI Engineer · Data Scientist · Forward-Deployed</strong></div>
        <div><span>Skills shown</span><strong>Workflow eval · Scoring logic · Failure-mode analysis · Decision thresholds</strong></div>
        <div><span>Stack</span><strong>TypeScript · React · synthetic eval set</strong></div>
        <div><span>Companion case</span><a href={companionUrl}>AI Support Agent Eval {"->"}</a></div>
      </footer>
    </main>
  );
}
