function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlineMarkdown(text) {
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, label, url) => {
    const safeLabel = label;
    const safeUrl = escapeHtml(url);
    return `<a href="${safeUrl}" target="_blank" rel="noreferrer noopener">${safeLabel}</a>`;
  });
  escaped = escaped.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  escaped = escaped.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  return escaped;
}

function renderMarkdownText(text) {
  const normalized = String(text || "").replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";

  const codeBlocks = [];
  const withPlaceholders = normalized.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_match, language, code) => {
    const index = codeBlocks.length;
    codeBlocks.push({
      language: escapeHtml(language || ""),
      code: escapeHtml(code.replace(/\n$/, "")),
    });
    return `@@CODE_BLOCK_${index}@@`;
  });

  const rendered = withPlaceholders
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (/^@@CODE_BLOCK_\d+@@$/.test(block)) return block;
      const lines = block.split("\n");
      const ordered = lines.every((line) => /^\d+\.\s+/.test(line.trim()));
      const unordered = lines.every((line) => /^[-*]\s+/.test(line.trim()));
      if (ordered || unordered) {
        const tag = ordered ? "ol" : "ul";
        const items = lines
          .map((line) => line.trim().replace(ordered ? /^\d+\.\s+/ : /^[-*]\s+/, ""))
          .map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
          .join("");
        return `<${tag}>${items}</${tag}>`;
      }
      return `<p>${lines.map((line) => renderInlineMarkdown(line.trim())).join("<br>")}</p>`;
    })
    .join("");

  return rendered.replace(/@@CODE_BLOCK_(\d+)@@/g, (_match, indexText) => {
    const block = codeBlocks[Number(indexText)];
    if (!block) return "";
    const languageClass = block.language ? ` class="language-${block.language}"` : "";
    return `<pre><code${languageClass}>${block.code}</code></pre>`;
  });
}
