window.run = () => {
  type Result = {
    check: string;
    status: "✅ PASS" | "❌ FAIL";
    details?: string[];
  };
  const results: Result[] = [];

  const checkSemanticHtml = (): Result => {
    const divButtons: HTMLElement[] = [];
    const a = document.querySelectorAll("div, span");
    a.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const changed = (el as any).lastListenerInfo;
      if (changed) divButtons.push(el);
    });

    const headingDivs = Array.from(
      document.querySelectorAll("div, span")
    ).filter((el) => /^h[1-6]$/i.test(el.getAttribute("role") || ""));

    return {
      check: "Semantic HTML (no <div> buttons or headings)",
      status: divButtons.length || headingDivs.length ? "❌ FAIL" : "✅ PASS",
      details: [...divButtons, ...headingDivs].map((el) => el.outerHTML),
    };
  };

  const checkKeyboardAccess = (): Result => {
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
  };

  const checkAriaRoles = (): Result => {
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
  };

  const checkImageAlts = (): Result => {
    const badImages = Array.from(document.querySelectorAll("img")).filter(
      (img) =>
        !img.hasAttribute("alt") || img.getAttribute("alt")?.trim() === ""
    );

    return {
      check: "Images have alt text",
      status: badImages.length ? "❌ FAIL" : "✅ PASS",
      details: badImages.map((el) => el.outerHTML),
    };
  };

  const checkAriaAttributes = (): Result => {
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
  };

  const checkColorContrast = (): Result => {
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
  };

  const checkFocusIndicators = (): Result => {
    const interactiveElements = Array.from(
      document.querySelectorAll(
        "a, button, input, select, textarea, [tabindex]"
      )
    );
    const noFocusIndicator: string[] = [];

    for (const el of interactiveElements) {
      if (!(el instanceof HTMLElement)) continue;

      const style = getComputedStyle(el);
      const isFocusable =
        el.hasAttribute("tabindex") ||
        el.matches("a[href], button, input, select, textarea");

      if (!isFocusable) continue;

      const outlineGone =
        style.outlineStyle === "none" ||
        parseFloat(style.outlineWidth || "") === 0;
      const boxShadowGone = style.boxShadow === "none";
      const textDecorGone =
        el.tagName === "A" &&
        style.textDecoration.replace(/\s/g, "") === "none";

      const allGone =
        outlineGone && boxShadowGone && (!el.matches("a") || textDecorGone);

      if (allGone) {
        noFocusIndicator.push(el.outerHTML);
      }
    }

    return {
      check: "Visible focus indicators",
      status: noFocusIndicator.length ? "❌ FAIL" : "✅ PASS",
      details: noFocusIndicator,
    };
  };

  const checkFormLabels = (): Result => {
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
  };

  const checkErrorMessages = (): Result => {
    const errors = Array.from(
      document.querySelectorAll('[class*="error"], [id*="error"]')
    ).filter((el) => (el.textContent?.trim().length || 0) < 3);

    return {
      check: "Error messages visible and understandable",
      status: errors.length ? "❌ FAIL" : "✅ PASS",
      details: errors.map((el) => el.outerHTML),
    };
  };

  // 🔄 Run all checks
  const steps = [
    checkSemanticHtml,
    checkKeyboardAccess,
    checkAriaRoles,
    checkImageAlts,
    checkAriaAttributes,
    checkColorContrast,
    checkFocusIndicators,
    checkFormLabels,
    checkErrorMessages,
  ];

  for (const fn of steps) results.push(fn());

  // ✅ Log + return summary
  // console.table(results.map((r) => ({ Check: r.check, Status: r.status })))

  // results.forEach((r) => {
  //   if (r.status === '❌ FAIL' && r.details?.length) {
  //     console.group(`❌ ${r.check}`)
  //     r.details.forEach((d) => console.log(d))
  //     console.groupEnd()
  //   }
  // })

  // console.log('%cSummary:', 'font-weight: bold;', {
  //   totalChecks: results.length,
  //   passed: results.filter((r) => r.status === '✅ PASS').length,
  //   failed: results.filter((r) => r.status === '❌ FAIL').length,
  // })

  return results;
};
