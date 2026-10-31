// .k-reveal: 12 px rise and fade, once, when the element enters the viewport.

let started = false;

export function initReveal(root: Document = document): () => void {
  if (started || typeof IntersectionObserver !== "function") return () => {};
  started = true;
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = root.documentElement;

  // Remembered so a framework re-render that rewrites the class list cannot hide it again.
  const revealed = new WeakSet<Element>();
  const reveal = (el: Element) => {
    revealed.add(el);
    el.classList.add("is-revealed");
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          reveal(e.target);
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );

  const scan = (node: ParentNode) => {
    const list = node instanceof Element && node.matches(".k-reveal") ? [node] : [];
    list.push(...Array.from(node.querySelectorAll(".k-reveal:not(.is-revealed)")));
    for (const el of list) {
      if (reduced) reveal(el);
      else io.observe(el);
    }
  };

  scan(root);
  if (!reduced) html.setAttribute("data-k-motion", "");
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === "childList") {
        r.addedNodes.forEach((n) => { if (n instanceof Element) scan(n); });
        continue;
      }
      // Class changed: re-show an element already revealed, or start watching a new .k-reveal.
      const el = r.target;
      if (!(el instanceof Element) || !el.classList.contains("k-reveal") || el.classList.contains("is-revealed")) continue;
      if (reduced || revealed.has(el)) reveal(el);
      else io.observe(el);
    }
  });
  if (root.body) mo.observe(root.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

  return () => {
    io.disconnect();
    mo.disconnect();
    html.removeAttribute("data-k-motion");
    started = false;
  };
}
