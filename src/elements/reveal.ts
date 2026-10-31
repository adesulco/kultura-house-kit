// .k-reveal: 12 px rise and fade, once, when the element enters the viewport.

let started = false;

export function initReveal(root: Document = document): () => void {
  if (started || typeof IntersectionObserver !== "function") return () => {};
  started = true;
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = root.documentElement;

  const reveal = (el: Element) => el.classList.add("is-revealed");
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
    for (const r of records) r.addedNodes.forEach((n) => { if (n instanceof Element) scan(n); });
  });
  if (root.body) mo.observe(root.body, { childList: true, subtree: true });

  return () => {
    io.disconnect();
    mo.disconnect();
    html.removeAttribute("data-k-motion");
    started = false;
  };
}
