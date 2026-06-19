/**
 * Regenerates privacy-policy.html and terms.html from privacy.json and
 * terms.json — the source of truth for this repo. The CalorieKitchen app
 * fetches the .json files directly (see src/lib/legalContent.ts in the app
 * repo); these .html files exist only so humans (and Play Console) have a
 * readable page to link to.
 *
 * Run: node generate.mjs
 * Runs automatically on push via .github/workflows/build.yml.
 */
import { readFileSync, writeFileSync } from 'node:fs';

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderBlock(block) {
  switch (block.type) {
    case 'para':
      return block.bold
        ? `  <p><b>${escapeHtml(block.text)}</b></p>\n`
        : `  <p>${escapeHtml(block.text)}</p>\n`;
    case 'bullet': {
      const title = block.title ? `<b>${escapeHtml(block.title)}:</b> ` : '';
      return `    <li>${title}${escapeHtml(block.text)}</li>\n`;
    }
    case 'link':
      return `  <p><a href="${block.url}">${escapeHtml(block.text)}</a></p>\n`;
    case 'mailto':
      return `  <p><a href="mailto:${block.email}">${escapeHtml(block.text)}</a></p>\n`;
    default:
      return '';
  }
}

function renderSection(section) {
  let html = `  <h2>${escapeHtml(section.title)}</h2>\n`;
  let inList = false;
  for (const block of section.blocks) {
    const isBullet = block.type === 'bullet';
    if (isBullet && !inList) {
      html += '  <ul>\n';
      inList = true;
    } else if (!isBullet && inList) {
      html += '  </ul>\n';
      inList = false;
    }
    html += renderBlock(block);
  }
  if (inList) html += '  </ul>\n';
  return html;
}

function renderDocument(doc) {
  const sections = doc.sections.map(renderSection).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(doc.title)} — CalorieKitchen</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 24px 20px 64px; color: #1c1c1e; line-height: 1.55; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .effective-date { color: #6b6b70; font-size: 13px; margin-bottom: 24px; }
  h2 { font-size: 16px; margin-top: 28px; margin-bottom: 8px; }
  p { font-size: 15px; color: #3a3a3c; margin: 0 0 10px; }
  ul { margin: 0 0 10px; padding-left: 20px; }
  li { font-size: 15px; color: #3a3a3c; margin-bottom: 6px; }
  b { color: #1c1c1e; }
  a { color: #2f7a4f; text-decoration: underline; }
</style>
</head>
<body>
  <h1>${escapeHtml(doc.title)}</h1>
  <p class="effective-date">Effective date: ${escapeHtml(doc.effectiveDate)} (v${escapeHtml(doc.version)})</p>

  <p>${escapeHtml(doc.intro)}</p>

${sections}</body>
</html>
`;
}

const privacy = JSON.parse(readFileSync('privacy.json', 'utf8'));
const terms = JSON.parse(readFileSync('terms.json', 'utf8'));

writeFileSync('privacy-policy.html', renderDocument(privacy));
writeFileSync('terms.html', renderDocument(terms));

console.log(`Generated privacy-policy.html (v${privacy.version}) and terms.html (v${terms.version})`);
