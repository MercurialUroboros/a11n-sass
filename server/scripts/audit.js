var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
window.run = function () {
    var results = [];
    var checkSemanticHtml = function () {
        var divButtons = [];
        var a = document.querySelectorAll("div, span");
        a.forEach(function (el) {
            if (!(el instanceof HTMLElement))
                return;
            var changed = el.lastListenerInfo;
            if (changed)
                divButtons.push(el);
        });
        var headingDivs = Array.from(document.querySelectorAll("div, span")).filter(function (el) { return /^h[1-6]$/i.test(el.getAttribute("role") || ""); });
        return {
            check: "Semantic HTML (no <div> buttons or headings)",
            status: divButtons.length || headingDivs.length ? "❌ FAIL" : "✅ PASS",
            details: __spreadArray(__spreadArray([], divButtons, true), headingDivs, true).map(function (el) { return el.outerHTML; }),
        };
    };
    var checkKeyboardAccess = function () {
        var interactiveElements = Array.from(document.querySelectorAll("a, button, input, select, textarea, [tabindex]"));
        var inaccessible = interactiveElements.filter(function (el) {
            var tabindex = el.getAttribute("tabindex");
            return el instanceof HTMLElement && el.tabIndex < 0 && tabindex !== "0";
        });
        return {
            check: "Interactive elements keyboard accessible",
            status: inaccessible.length ? "❌ FAIL" : "✅ PASS",
            details: inaccessible.map(function (el) { return el.outerHTML; }),
        };
    };
    var checkAriaRoles = function () {
        var customWidgets = Array.from(document.querySelectorAll("[role]")).filter(function (el) {
            var role = el.getAttribute("role");
            return (role &&
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
                ].includes(role));
        });
        return {
            check: "Custom ARIA roles used correctly",
            status: customWidgets.length ? "❌ FAIL" : "✅ PASS",
            details: customWidgets.map(function (el) { return el.outerHTML; }),
        };
    };
    var checkImageAlts = function () {
        var badImages = Array.from(document.querySelectorAll("img")).filter(function (img) { var _a; return !img.hasAttribute("alt") || ((_a = img.getAttribute("alt")) === null || _a === void 0 ? void 0 : _a.trim()) === ""; });
        return {
            check: "Images have alt text",
            status: badImages.length ? "❌ FAIL" : "✅ PASS",
            details: badImages.map(function (el) { return el.outerHTML; }),
        };
    };
    var checkAriaAttributes = function () {
        var allElements = Array.from(document.querySelectorAll("*"));
        var allWithARIA = allElements.filter(function (el) {
            return Array.from(el.attributes).some(function (attr) { return attr.name.startsWith("aria-"); });
        });
        var invalidARIA = allWithARIA.filter(function (el) {
            return Array.from(el.attributes).some(function (attr) { return attr.name.startsWith("aria-") && attr.value.trim() === ""; });
        });
        return {
            check: "ARIA attributes used properly",
            status: invalidARIA.length ? "❌ FAIL" : "✅ PASS",
            details: invalidARIA.map(function (el) { return el.outerHTML; }),
        };
    };
    var checkColorContrast = function () {
        var getContrast = function (fg, bg) {
            var luminance = function (color) {
                var _a;
                var rgb = (_a = color.match(/\d+/g)) === null || _a === void 0 ? void 0 : _a.map(Number);
                if (!rgb)
                    return 0;
                var _b = rgb.map(function (c) {
                    c /= 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                }), r = _b[0], g = _b[1], b = _b[2];
                return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            };
            var l1 = luminance(fg);
            var l2 = luminance(bg);
            return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        };
        var badContrastElements = [];
        document.querySelectorAll("body *").forEach(function (el) {
            var style = getComputedStyle(el);
            var contrast = getContrast(style.color, style.backgroundColor || "#fff");
            if (contrast < 4.5 &&
                style.visibility !== "hidden" &&
                style.display !== "none") {
                badContrastElements.push(el.outerHTML);
            }
        });
        return {
            check: "Text has sufficient color contrast (≥ 4.5:1)",
            status: badContrastElements.length ? "❌ FAIL" : "✅ PASS",
            details: badContrastElements.slice(0, 10),
        };
    };
    var checkFocusIndicators = function () {
        var interactiveElements = Array.from(document.querySelectorAll("a, button, input, select, textarea, [tabindex]"));
        var noFocusIndicator = [];
        for (var _i = 0, interactiveElements_1 = interactiveElements; _i < interactiveElements_1.length; _i++) {
            var el = interactiveElements_1[_i];
            if (!(el instanceof HTMLElement))
                continue;
            var style = getComputedStyle(el);
            var isFocusable = el.hasAttribute("tabindex") ||
                el.matches("a[href], button, input, select, textarea");
            if (!isFocusable)
                continue;
            var outlineGone = style.outlineStyle === "none" ||
                parseFloat(style.outlineWidth || "") === 0;
            var boxShadowGone = style.boxShadow === "none";
            var textDecorGone = el.tagName === "A" &&
                style.textDecoration.replace(/\s/g, "") === "none";
            var allGone = outlineGone && boxShadowGone && (!el.matches("a") || textDecorGone);
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
    var checkFormLabels = function () {
        var inputs = Array.from(document.querySelectorAll("input, textarea, select"));
        var unlabeled = inputs.filter(function (input) {
            var id = input.getAttribute("id");
            return !id || !document.querySelector("label[for=\"".concat(id, "\"]"));
        });
        return {
            check: "Form fields have labels",
            status: unlabeled.length ? "❌ FAIL" : "✅ PASS",
            details: unlabeled.map(function (el) { return el.outerHTML; }),
        };
    };
    var checkErrorMessages = function () {
        var errors = Array.from(document.querySelectorAll('[class*="error"], [id*="error"]')).filter(function (el) { var _a; return (((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim().length) || 0) < 3; });
        return {
            check: "Error messages visible and understandable",
            status: errors.length ? "❌ FAIL" : "✅ PASS",
            details: errors.map(function (el) { return el.outerHTML; }),
        };
    };
    // 🔄 Run all checks
    var steps = [
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
    for (var _i = 0, steps_1 = steps; _i < steps_1.length; _i++) {
        var fn = steps_1[_i];
        results.push(fn());
    }
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
