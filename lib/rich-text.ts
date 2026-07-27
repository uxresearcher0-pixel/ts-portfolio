import sanitizeHtml from "sanitize-html";

export function sanitizeRichText(value: unknown): string {
  if (typeof value !== "string") return "";
  return sanitizeHtml(value, {
    allowedTags: ["p", "br", "strong", "em", "s", "h2", "h3", "ul", "ol", "li", "blockquote", "a", "code", "pre", "hr"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" })
    }
  });
}
