"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/tailwind.ts
var colourNames = [
  "red-500",
  "red-700",
  "red-800",
  "ink",
  "paper",
  "surface",
  "line",
  "muted",
  "amber-text",
  "amber-tint",
  "amber-line",
  "green",
  "green-tint",
  "accent",
  "on-accent"
];
var fontSize = (size, lineHeight, extra = {}) => [size, { lineHeight, ...extra }];
var houseKitPreset = {
  theme: {
    extend: {
      colors: {
        k: Object.fromEntries(colourNames.map((n) => [n, `var(--k-${n})`]))
      },
      fontFamily: {
        k: ["var(--k-font)"],
        "k-mono": ["var(--k-mono)"]
      },
      fontSize: {
        "k-display": fontSize("96px", "0.95", { letterSpacing: "-0.02em", fontWeight: "800" }),
        "k-display-sm": fontSize("48px", "0.95", { letterSpacing: "-0.02em", fontWeight: "800" }),
        "k-h1": fontSize("64px", "1.02", { letterSpacing: "-0.02em", fontWeight: "800" }),
        "k-h1-sm": fontSize("40px", "1.02", { letterSpacing: "-0.02em", fontWeight: "800" }),
        "k-h2": fontSize("44px", "1.05", { letterSpacing: "-0.02em", fontWeight: "700" }),
        "k-h2-sm": fontSize("32px", "1.05", { fontWeight: "700" }),
        "k-h3": fontSize("28px", "1.15", { fontWeight: "700" }),
        "k-h3-sm": fontSize("22px", "1.15", { fontWeight: "700" }),
        "k-body": fontSize("17px", "1.5"),
        "k-body-sm": fontSize("16px", "1.5"),
        "k-small": fontSize("14px", "1.45"),
        "k-label": fontSize("12px", "1.4", { letterSpacing: "0.08em", fontWeight: "500" })
      },
      borderRadius: {
        "k-pill": "var(--k-radius-pill)",
        "k-console": "var(--k-radius-console)",
        "k-card": "var(--k-radius-card)"
      },
      transitionDuration: { "k-fast": "120ms", "k-base": "200ms", "k-slow": "320ms" },
      transitionTimingFunction: { k: "cubic-bezier(.2,.7,.2,1)" },
      screens: { "k-desktop": "640px" }
    }
  }
};
var tailwind_default = houseKitPreset;


exports.default = tailwind_default;

module.exports = exports.default;
