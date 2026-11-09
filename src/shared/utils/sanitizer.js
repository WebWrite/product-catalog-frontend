import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "hr",
  "h1",
  "h2",
  "h3",
  "strong",
  "em",
  "u",
  "s",
  "code",
  "ul",
  "ol",
  "li",
  "blockquote",
];

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (!node.hasAttribute?.("style")) return;

  const align = node.style?.textAlign;
  node.removeAttribute("style");

  if (["left", "center", "right"].includes(align)) {
    node.style.textAlign = align;
  }
});

export const cleanRichText = (dirty) =>
  DOMPurify.sanitize(dirty ?? "", {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["style"],
  });
