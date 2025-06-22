import puppeteer, { type Page } from "puppeteer";
import { readFileSync } from "fs";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

type Result = {
  check: string;
  status: string;
  details?: string[];
};

const checkFocusIndicators = async (page: Page): Promise<Result> => {
  const failed: string[] = new Set<string>();
  const seen = new Set<Element>();
  let prev = "";

  for (let i = 0; i < 100; i++) {
    await page.keyboard.press("Tab");
    await delay(50);

    const result = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el) return null;

      const style = window.getComputedStyle(el);
      const tag = el.tagName;

      const outlineGone =
        style.outlineStyle === "none" ||
        parseFloat(style.outlineWidth || "") === 0;
      const boxShadowGone = style.boxShadow === "none";
      const textDecorGone =
        tag === "A" && style.textDecoration.replace(/\s/g, "").includes("none");

      const allCuesGone =
        outlineGone && boxShadowGone && (tag !== "A" || textDecorGone);

      const isVisible =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        el.offsetParent !== null;

      return allCuesGone && isVisible ? el.outerHTML : null;
    });

    if (result) {
      failed.add(result);
    }

    const currentHref = await page.evaluate(() => {
      const el = document.activeElement;
      return el instanceof HTMLElement ? el.outerHTML : "";
    });

    if (seen.has(currentHref)) break;
    seen.add(currentHref);
  }

  return {
    check: "Visible focus indicators",
    status: failed.size ? "❌ FAIL" : "✅ PASS",
    details: Array.from(failed),
  };
};

const checkSemanticHtml = async (page: Page): Promise<Result> => {
  return await page.evaluate(() => {
    const divButtons: HTMLElement[] = [];
    const a = document.querySelectorAll("div, span");
    a.forEach((el) => {
      const changed = (el as any).lastListenerInfo;
      if (changed) divButtons.push(el as HTMLElement);
    });

    const headingDivs = Array.from(
      document.querySelectorAll("div, span")
    ).filter((el) => /^h[1-6]$/i.test(el.getAttribute("role") || ""));

    return {
      check: "Semantic HTML (no <div> buttons or headings)",
      status: divButtons.length || headingDivs.length ? "❌ FAIL" : "✅ PASS",
      details: [...divButtons, ...headingDivs].map((el) => el.outerHTML),
    };
  });
};

const checkKeyboardAccess = async (page: Page): Promise<Result> => {
  return await page.evaluate(() => {
    const interactiveElements = Array.from(
      document.querySelectorAll(
        "a, button, input, select, textarea, [tabindex]"
      )
    );
    const inaccessible = interactiveElements.filter((el) => {
      const tabindex = el.getAttribute("tabindex");
      return el instanceof HTMLElement && el.tabIndex < 0 && tabindex !== "0";
    });

    return {
      check: "Interactive elements keyboard accessible",
      status: inaccessible.length ? "❌ FAIL" : "✅ PASS",
      details: inaccessible.map((el) => el.outerHTML),
    };
  });
};

export const checkAriaRoles = async (page: Page): Promise<Result> => {
  return await page.evaluate(() => {
    const customWidgets = Array.from(
      document.querySelectorAll("[role]")
    ).filter((el) => {
      const role = el.getAttribute("role");
      return (
        role &&
        ![
          "button",
          "dialog",
          "navigation",
          "tablist",
          "tab",
          "tabpanel",
          "checkbox",
          "menu",
          "menuitem",
        ].includes(role)
      );
    });

    return {
      check: "Custom ARIA roles used correctly",
      status: customWidgets.length ? "❌ FAIL" : "✅ PASS",
      details: customWidgets.map((el) => el.outerHTML),
    };
  });
};

export const checkImageAlts = async (page: Page): Promise<Result> => {
  return await page.evaluate(() => {
    const badImages = Array.from(document.querySelectorAll("img")).filter(
      (img) =>
        !img.hasAttribute("alt") || img.getAttribute("alt")?.trim() === ""
    );

    return {
      check: "Images have alt text",
      status: badImages.length ? "❌ FAIL" : "✅ PASS",
      details: badImages.map((el) => el.outerHTML),
    };
  });
};

export const checkAriaAttributes = async (page: Page): Promise<Result> => {
  return await page.evaluate(() => {
    const allElements = Array.from(document.querySelectorAll("*"));
    const allWithARIA = allElements.filter((el) =>
      Array.from(el.attributes).some((attr) => attr.name.startsWith("aria-"))
    );
    const invalidARIA = allWithARIA.filter((el) =>
      Array.from(el.attributes).some(
        (attr) => attr.name.startsWith("aria-") && attr.value.trim() === ""
      )
    );

    return {
      check: "ARIA attributes used properly",
      status: invalidARIA.length ? "❌ FAIL" : "✅ PASS",
      details: invalidARIA.map((el) => el.outerHTML),
    };
  });
};

export const checkColorContrast = async (page: Page): Promise<Result> => {
  return await page.evaluate(() => {
    const getContrast = (fg: string, bg: string) => {
      const luminance = (color: string) => {
        const rgb = color.match(/\d+/g)?.map(Number);
        if (!rgb) return 0;
        const [r, g, b] = rgb.map((c) => {
          c /= 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const l1 = luminance(fg);
      const l2 = luminance(bg);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    const badContrastElements: string[] = [];
    document.querySelectorAll("body *").forEach((el) => {
      const style = getComputedStyle(el as Element);
      const contrast = getContrast(
        style.color,
        style.backgroundColor || "#fff"
      );
      if (
        contrast < 4.5 &&
        style.visibility !== "hidden" &&
        style.display !== "none"
      ) {
        badContrastElements.push(el.outerHTML);
      }
    });

    return {
      check: "Text has sufficient color contrast (≥ 4.5:1)",
      status: badContrastElements.length ? "❌ FAIL" : "✅ PASS",
      details: badContrastElements.slice(0, 10),
    };
  });
};

export const checkFormLabels = async (page: Page): Promise<Result> => {
  return await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll("input, textarea, select")
    );
    const unlabeled = inputs.filter((input) => {
      const id = input.getAttribute("id");
      return !id || !document.querySelector(`label[for="${id}"]`);
    });

    return {
      check: "Form fields have labels",
      status: unlabeled.length ? "❌ FAIL" : "✅ PASS",
      details: unlabeled.map((el) => el.outerHTML),
    };
  });
};

export default defineEventHandler(
  async (event): Promise<{ results: Result[] }> => {
    const query = getQuery(event);
    const url = query.url as string;

    if (!url || !url.startsWith("http")) {
      return { error: "Missing or invalid ?url=" };
    }

    const prepareScript = readFileSync("./server/scripts/prepare.js", "utf-8");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
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
    await delay(3000);

    const results: Result[] = [];

    const steps = [
      () => checkSemanticHtml(page),
      () => checkKeyboardAccess(page),
      () => checkAriaRoles(page),
      () => checkImageAlts(page),
      () => checkAriaAttributes(page),
      () => checkColorContrast(page),
      () => checkFormLabels(page),
      () => checkFocusIndicators(page),
    ];

    for (const fn of steps) results.push(await fn());

    await browser.close();

    return {
      results,
    };
  }
);
