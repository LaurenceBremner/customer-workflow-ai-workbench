import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localRequire = createRequire(import.meta.url);

let chromium;
try {
  ({ chromium } = localRequire("playwright"));
} catch (error) {
  console.error("Playwright is required for visual QA. Install it with `npm install --save-dev playwright` or run in an environment where `playwright` is available.");
  throw error;
}

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const target = process.env.QA_URL || "http://127.0.0.1:8787";
const repoUrl = "https://github.com/LaurenceBremner/customer-workflow-ai-workbench";
const shots = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1366", width: 1366, height: 768 },
  { name: "mobile", width: 390, height: 900 },
];

fs.mkdirSync(path.join(root, "qa"), { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
});

const results = [];
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.width, height: shot.height } });
  await page.goto(target, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: /Can Northstar Granola launch on Friday/i }).waitFor({ timeout: 15000 });

  const pageText = await page.locator("body").innerText();
  const screenshot = path.join(root, "qa", `${shot.name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });

  const layout = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const elements = [...document.querySelectorAll("body *")];
    const overflowFailures = elements
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || "").trim().slice(0, 80),
          width: rect.width,
          height: rect.height,
          overflowX: rect.left < -1 || rect.right > viewportWidth + 1,
        };
      })
      .filter((item) => item.width > 0 && item.height > 0 && item.overflowX);

    return { overflowFailures, pageHeight, viewportHeight };
  });

  const hrefs = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((anchor) => anchor.getAttribute("href") || ""));
  results.push({ viewport: shot, screenshot, pageText, layout, hrefs });
  await page.close();
}

await browser.close();

const failures = results.flatMap((result) => {
  const text = result.pageText.toLowerCase();
  const issues = [];
  const isDesktop = result.viewport.name.startsWith("desktop");
  if (!text.includes("northstar granola")) issues.push(`${result.viewport.name}: concrete scenario missing`);
  if (!text.includes("synthetic case study") && !text.includes("synthetic data only")) issues.push(`${result.viewport.name}: synthetic framing missing`);
  if (!text.includes("eval set") || !text.includes("200 sellers") || !text.includes("threshold") || !text.includes("scorereadiness")) {
    issues.push(`${result.viewport.name}: AI/data-science proof metrics missing`);
  }
  if (!text.includes("seller_profile.csv") || !text.includes("product_feed.json") || !text.includes("support_thread #4412")) {
    issues.push(`${result.viewport.name}: synthetic source records missing`);
  }
  if (!text.includes("block launch") || !text.includes("route to repair") || !text.includes("pilot")) {
    issues.push(`${result.viewport.name}: result/recommendation missing`);
  }
  if (!text.includes("scorereadiness") || !text.includes("ambig")) {
    issues.push(`${result.viewport.name}: code proof missing`);
  }
  if (isDesktop && result.layout.pageHeight > result.layout.viewportHeight + 2) {
    issues.push(`${result.viewport.name}: page scrolls on desktop (${result.layout.pageHeight} > ${result.layout.viewportHeight})`);
  }
  if (result.layout.overflowFailures.length > 0) issues.push(`${result.viewport.name}: ${result.layout.overflowFailures.length} horizontal overflow candidates`);
  if (result.hrefs.some((href) => href.includes(".md"))) issues.push(`${result.viewport.name}: deployed markdown link found`);
  if (!result.hrefs.includes(repoUrl) || !result.hrefs.includes(`${repoUrl}/blob/main/src/eval/scoring.ts`)) {
    issues.push(`${result.viewport.name}: GitHub/source links missing`);
  }
  return issues;
});

const markdown = [
  "# Visual QA",
  "",
  "Surface: Northstar Granola AI workflow evidence board",
  `Target: ${target}`,
  "",
  "## Viewports Tested",
  ...results.map((result) => `- ${result.viewport.name}: ${result.viewport.width}x${result.viewport.height}`),
  "",
  "## Screenshots",
  ...results.map((result) => `- ${result.viewport.name}: ${path.relative(root, result.screenshot)}`),
  "",
  "## Content Checks",
  "- Scenario, synthetic records, threshold, scoring code, eval-set metrics, verdict, and recommendation are required.",
  "",
  "## Layout Checks",
  ...results.map((result) =>
    result.layout.overflowFailures.length === 0
      ? `- ${result.viewport.name}: no horizontal overflow detected`
      : `- ${result.viewport.name}: ${result.layout.overflowFailures.length} overflow candidates`,
  ),
  ...results
    .filter((result) => result.viewport.name.startsWith("desktop"))
    .map((result) =>
      result.layout.pageHeight <= result.layout.viewportHeight + 2
        ? `- ${result.viewport.name}: no desktop page-level vertical scroll`
        : `- ${result.viewport.name}: desktop scroll detected`,
    ),
  "",
  "## Accessibility Checks",
  "- Main page has a concrete case-study heading.",
  "- Navigation and source links are keyboard-focusable.",
  "- Evidence rows use readable text labels rather than color alone.",
  "",
].join("\n");

fs.writeFileSync(path.join(root, "visual-qa.md"), markdown);
console.log(markdown);

if (failures.length > 0) {
  console.error(["", "QA failures:", ...failures.map((item) => `- ${item}`)].join("\n"));
  process.exit(1);
}
