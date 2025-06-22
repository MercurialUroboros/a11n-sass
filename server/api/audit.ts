import puppeteer from "puppeteer";
import { readFileSync } from "fs";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const url = query.url as string;

  if (!url || !url.startsWith("http")) {
    return { error: "Missing or invalid ?url=" };
  }

  const prepareScript = readFileSync("./server/scripts/prepare.js", "utf-8");
  const auditScript = readFileSync("./server/scripts/audit.js", "utf-8");

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const logs: string[] = [];
  page.on("console", (msg) => logs.push(msg.text()));

  // Inject prepare.js before any other script
  await page.setRequestInterception(true);
  page.on("request", async (req) => {
    if (req.isNavigationRequest() && req.resourceType() === "document") {
      const headers = req.headers();
      const res = await fetch(req.url(), { headers });
      const html = await res.text();

      const injectedHtml = html.replace(
        /<head>/i,
        `<head><script>${prepareScript}</script>`
      );

      req.respond({
        status: 200,
        contentType: "text/html",
        body: injectedHtml,
      });
    } else {
      req.continue();
    }
  });

  await page.goto(url, { waitUntil: "networkidle0" });

  // Wait for hydration, etc.
  await delay(2000);
  await page.addScriptTag({ content: auditScript });

  const results = await page.evaluate(() => {
    return typeof run === "function" ? run() : [];
  });

  await browser.close();

  console.log(results);

  return {
    url,
    results,
    logs,
  };
});
