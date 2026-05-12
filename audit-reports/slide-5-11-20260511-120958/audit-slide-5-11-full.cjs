const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const project = process.argv[2];
const dataFile = process.argv[3];
const tsxFile = process.argv[4];
const reportJson = process.argv[5];
const reportMd = process.argv[6];
const cssFiles = process.argv.slice(7);

const slideIndexes = [4, 5, 6, 7, 8, 9, 10]; // Slide 5-11

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function exists(file) {
  return fs.existsSync(file);
}

function sha(s) {
  return crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
}

function lineNo(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function getLines(text, start, end) {
  const lines = text.split(/\r?\n/);
  const out = [];
  for (let i = Math.max(1, start); i <= Math.min(lines.length, end); i++) {
    out.push(String(i).padStart(5, " ") + " | " + lines[i - 1]);
  }
  return out.join("\n");
}

function countMatches(text, re) {
  const m = text.match(re);
  return m ? m.length : 0;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findJourneyArray(text) {
  const marker = "export const journeySlides";
  const markerPos = text.indexOf(marker);
  if (markerPos < 0) throw new Error("export const journeySlides tidak ditemukan.");

  const arrStart = text.indexOf("[", markerPos);
  if (arrStart < 0) throw new Error("Array journeySlides tidak ditemukan.");

  let inString = false;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let bracketDepth = 0;

  for (let i = arrStart; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      if (ch === "*" && next === "/") {
        blockComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      lineComment = true;
      i++;
      continue;
    }

    if (ch === "/" && next === "*") {
      blockComment = true;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      continue;
    }

    if (ch === "[") bracketDepth++;

    if (ch === "]") {
      bracketDepth--;
      if (bracketDepth === 0) return { start: arrStart, end: i };
    }
  }

  throw new Error("Akhir array journeySlides tidak ditemukan.");
}

function getTopLevelObjects(text) {
  const arr = findJourneyArray(text);
  const objects = [];

  let inString = false;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let braceDepth = 0;
  let objStart = -1;

  for (let i = arr.start + 1; i < arr.end; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      if (ch === "*" && next === "/") {
        blockComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      lineComment = true;
      i++;
      continue;
    }

    if (ch === "/" && next === "*") {
      blockComment = true;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      continue;
    }

    if (ch === "{") {
      if (braceDepth === 0) objStart = i;
      braceDepth++;
    }

    if (ch === "}") {
      braceDepth--;
      if (braceDepth === 0 && objStart >= 0) {
        let end = i + 1;
        while (end < text.length && /[\s,]/.test(text[end])) end++;
        objects.push({ start: objStart, end });
        objStart = -1;
      }
    }
  }

  return objects;
}

function extractProp(block, prop) {
  const stringRe = new RegExp('["\\\']?' + escapeRegExp(prop) + '["\\\']?\\s*:\\s*(["\\\'`])([\\s\\S]*?)\\1');
  const stringMatch = block.match(stringRe);
  if (stringMatch) return stringMatch[2].replace(/\s+/g, " ").trim();

  const numberRe = new RegExp('["\\\']?' + escapeRegExp(prop) + '["\\\']?\\s*:\\s*(-?[0-9]+(?:\\.[0-9]+)?)');
  const numberMatch = block.match(numberRe);
  if (numberMatch) return Number(numberMatch[1]);

  const boolRe = new RegExp('["\\\']?' + escapeRegExp(prop) + '["\\\']?\\s*:\\s*(true|false)');
  const boolMatch = block.match(boolRe);
  if (boolMatch) return boolMatch[1] === "true";

  return null;
}

function extractArrayBlock(block, prop) {
  const re = new RegExp('["\\\']?' + escapeRegExp(prop) + '["\\\']?\\s*:');
  const m = re.exec(block);
  if (!m) return "";

  const pos = m.index;
  const start = block.indexOf("[", pos);
  if (start < 0) return "";

  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let i = start; i < block.length; i++) {
    const ch = block[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      continue;
    }

    if (ch === "[") depth++;
    if (ch === "]") {
      depth--;
      if (depth === 0) return block.slice(start, i + 1);
    }
  }

  return "";
}

function extractStringsFromArray(arrayText) {
  const out = [];
  if (!arrayText) return out;
  const re = /(["'`])([\s\S]*?)\1/g;
  let m;
  while ((m = re.exec(arrayText))) {
    out.push(m[2]);
  }
  return out;
}

function extractNumbersFromArray(arrayText) {
  if (!arrayText) return [];
  return [...arrayText.matchAll(/-?\d+(?:\.\d+)?/g)].map(x => Number(x[0]));
}

function extractImageLikePaths(block) {
  const paths = [];
  const re = /(["'`])([^"'`]*\.(?:png|jpg|jpeg|webp|gif|svg))\1/gi;
  let m;
  while ((m = re.exec(block))) paths.push(m[2]);
  return [...new Set(paths)];
}

function normalizeAssetPath(p) {
  let s = p.replace(/^\/+/, "");
  if (s.startsWith("assets/")) return path.join(project, "public", s);
  if (s.startsWith("src/")) return path.join(project, s);
  return path.join(project, "public", s);
}

function scanCssSyntax(cssText, cssName) {
  const lines = cssText.split(/\r?\n/);
  let balance = 0;
  let minBalance = 0;
  let firstNegative = null;
  const suspiciousPercent = [];
  const orphanClosings = [];

  let inKeyframes = false;
  let keyDepth = 0;
  let keyName = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trim = line.trim();

    const before = balance;
    const opens = countMatches(line, /\{/g);
    const closes = countMatches(line, /\}/g);

    const keyMatch = trim.match(/^@(?:-\w+-)?keyframes\s+([A-Za-z0-9_-]+)\s*\{/);
    if (keyMatch) {
      inKeyframes = true;
      keyName = keyMatch[1];
      keyDepth = 0;
    }

    if (/^\d+%(\s*,\s*\d+%)*\s*\{/.test(trim) && !inKeyframes) {
      suspiciousPercent.push({
        line: i + 1,
        text: line,
        context: getLines(cssText, Math.max(1, i - 8), i + 12)
      });
    }

    if (trim === "}" && before <= 0) {
      orphanClosings.push({
        line: i + 1,
        text: line,
        context: getLines(cssText, Math.max(1, i - 5), i + 8)
      });
    }

    balance += opens - closes;

    if (balance < minBalance) {
      minBalance = balance;
      if (!firstNegative) firstNegative = i + 1;
    }

    if (inKeyframes) {
      keyDepth += opens - closes;
      if (keyDepth <= 0) {
        inKeyframes = false;
        keyName = "";
        keyDepth = 0;
      }
    }
  }

  return {
    cssName,
    finalBraceBalance: balance,
    minimumBraceBalance: minBalance,
    firstNegativeLine: firstNegative,
    suspiciousPercentOutsideKeyframes: suspiciousPercent,
    orphanClosingBraces: orphanClosings.slice(0, 20)
  };
}

function findCssHits(cssText, cssName, terms) {
  const lines = cssText.split(/\r?\n/);
  const hits = [];

  lines.forEach((line, idx) => {
    const lower = line.toLowerCase();
    for (const term of terms) {
      if (lower.includes(term.toLowerCase())) {
        hits.push({
          cssName,
          line: idx + 1,
          term,
          text: line,
          context: getLines(cssText, Math.max(1, idx - 2), idx + 4)
        });
        break;
      }
    }
  });

  return hits;
}

function findKeyframes(cssText, cssName, terms) {
  const out = [];
  const re = /@(?:-\w+-)?keyframes\s+([A-Za-z0-9_-]+)\s*\{/g;
  let m;
  while ((m = re.exec(cssText))) {
    const name = m[1];
    const lower = name.toLowerCase();
    if (terms.some(t => lower.includes(t.toLowerCase()))) {
      out.push({
        cssName,
        name,
        line: lineNo(cssText, m.index),
        context: getLines(cssText, Math.max(1, lineNo(cssText, m.index) - 2), lineNo(cssText, m.index) + 18)
      });
    }
  }
  return out;
}

function findTsxHits(tsx, label, pattern, context = 4, max = 50) {
  const re = new RegExp(pattern, "g");
  const hits = [];
  let m;
  while ((m = re.exec(tsx))) {
    const ln = lineNo(tsx, m.index);
    hits.push({
      label,
      line: ln,
      match: m[0].slice(0, 200),
      context: getLines(tsx, Math.max(1, ln - context), ln + context)
    });
    if (hits.length >= max) break;
  }
  return hits;
}

function extractTsxLogic(tsx) {
  const checks = [
    ["SLIDE_FRAME_FOLDERS", "SLIDE_FRAME_FOLDERS[\\s\\S]*?};"],
    ["slide duration / walk duration", "walkDuration|slideDuration|--journey-walk-duration|--journey-duration"],
    ["currentSlide 4-10 checks", "currentSlide\\s*===\\s*(4|5|6|7|8|9|10)|\\[(?:[^\\]]*)(4|5|6|7|8|9|10)(?:[^\\]]*)\\]"],
    ["achievement logic", "achievement|forceAchievementNotes|showAchievementHeading|customAchievementRunningText|visibleAchievementNotes|queue-three-notes"],
    ["slide8 special logic", "slide8|slide-8|slide8-frame|slide8-word|slide8-flight"],
    ["data-slide-index render", "data-slide-index=\\{currentSlide\\}|slide-\\$\\{currentSlide \\+ 1\\}|journey-panel"],
    ["frame scheduler", "frameIndex|setFrameIndex|frameSequenceMs|frameStep|frameLoops|schedule\\("],
    ["notes scheduler", "notes|setVisible|visibleAchievementNotes|fastNote|noteWindow"]
  ];

  const all = [];
  for (const [label, pattern] of checks) {
    all.push({
      label,
      hits: findTsxHits(tsx, label, pattern, 5, 80)
    });
  }
  return all;
}

function analyzeSlideObject(dataText, obj, idx) {
  const block = dataText.slice(obj.start, obj.end);
  const startLine = lineNo(dataText, obj.start);
  const endLine = lineNo(dataText, obj.end);

  const framesArray = extractArrayBlock(block, "frames");
  const notesArray = extractArrayBlock(block, "notes");
  const frameSeqArray = extractArrayBlock(block, "frameSequenceMs");
  const fastDelayArray = extractArrayBlock(block, "fastNoteDelaysMs");
  const walkSegmentsArray = extractArrayBlock(block, "walkSegments");

  const imagePaths = extractImageLikePaths(block);
  const assetStatus = imagePaths.map(p => {
    const full = normalizeAssetPath(p);
    return {
      path: p,
      resolved: full,
      exists: exists(full)
    };
  });

  return {
    slideNumber: idx + 1,
    currentSlideIndex: idx,
    dataSlideIndex: idx,
    lineRange: `${startLine}-${endLine}`,
    hash: sha(block),
    properties: {
      mode: extractProp(block, "mode"),
      duration: extractProp(block, "duration"),
      badge: extractProp(block, "badge"),
      h1: extractProp(block, "h1"),
      h2: extractProp(block, "h2"),
      h3: extractProp(block, "h3"),
      h4: extractProp(block, "h4"),
      title: extractProp(block, "title"),
      summary: extractProp(block, "summary"),
      accent: extractProp(block, "accent"),
      footerLayout: extractProp(block, "footerLayout"),
      rollingNotes: extractProp(block, "rollingNotes"),
      noteWindow: extractProp(block, "noteWindow"),
      fastNotes: extractProp(block, "fastNotes"),
      fastNoteStepMs: extractProp(block, "fastNoteStepMs"),
      fastAfterLastMs: extractProp(block, "fastAfterLastMs"),
      frameLoops: extractProp(block, "frameLoops"),
      walkDuration: extractProp(block, "walkDuration"),
      walkStart: extractProp(block, "walkStart"),
      walkEnd: extractProp(block, "walkEnd"),
      planeMode: extractProp(block, "planeMode")
    },
    frames: extractStringsFromArray(framesArray),
    notes: extractStringsFromArray(notesArray),
    frameSequenceMs: extractNumbersFromArray(frameSeqArray),
    fastNoteDelaysMs: extractNumbersFromArray(fastDelayArray),
    walkSegmentsRaw: walkSegmentsArray ? walkSegmentsArray.replace(/\s+/g, " ").trim() : "",
    imagePaths,
    assetStatus,
    invalidDollarTokens: block.match(/^\s*\$\d+\s*,\s*$/gm) || [],
    rawPreview: getLines(dataText, startLine, Math.min(endLine, startLine + 70))
  };
}

const data = read(dataFile);
const tsx = read(tsxFile);
const cssTexts = cssFiles.map(file => ({ file, name: path.relative(project, file), text: read(file) }));

const objects = getTopLevelObjects(data);

const slides = slideIndexes.map(idx => {
  if (!objects[idx]) {
    return {
      slideNumber: idx + 1,
      currentSlideIndex: idx,
      error: "Object slide tidak ditemukan"
    };
  }
  return analyzeSlideObject(data, objects[idx], idx);
});

const termsPerSlide = {};
for (const idx of slideIndexes) {
  const slideNumber = idx + 1;
  termsPerSlide[idx] = [
    `data-slide-index="${idx}"`,
    `slide-${slideNumber}`,
    `slide${slideNumber}`,
    `SLIDE ${slideNumber}`,
    `Slide ${slideNumber}`,
    idx === 4 ? "slide5" : "",
    idx === 5 ? "slide6" : "",
    idx === 6 ? "slide7" : "",
    idx === 7 ? "slide8" : "",
    idx === 8 ? "slide9" : "",
    idx === 9 ? "slide10" : "",
    idx === 10 ? "slide11" : "",
    "achievement",
    "journey-custom-achievement-notes",
    "journey-achievement-heading",
    "queue-three-notes"
  ].filter(Boolean);
}

const cssAudit = cssTexts.map(c => ({
  file: c.name,
  syntax: scanCssSyntax(c.text, c.name),
  slideHits: Object.fromEntries(slideIndexes.map(idx => [
    idx,
    findCssHits(c.text, c.name, termsPerSlide[idx]).slice(0, 200)
  ])),
  keyframes: findKeyframes(c.text, c.name, [
    "slide5", "slide6", "slide7", "slide8", "slide9", "slide10", "slide11",
    "achievement", "intro", "walk", "frame", "bus", "plane", "university"
  ])
}));

const tsxLogic = extractTsxLogic(tsx);

const duplicateCssSelectors = [];
for (const c of cssTexts) {
  const selectorCounts = new Map();
  const lines = c.text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const t = line.trim();
    if (
      t.endsWith("{") &&
      !t.startsWith("@keyframes") &&
      !t.startsWith("@media") &&
      !t.startsWith("@supports") &&
      !t.startsWith("from") &&
      !t.startsWith("to") &&
      !/^\d+%/.test(t)
    ) {
      const selector = t.slice(0, -1).trim();
      if (selector.includes("#journey") || selector.includes(".journey")) {
        const arr = selectorCounts.get(selector) || [];
        arr.push(i + 1);
        selectorCounts.set(selector, arr);
      }
    }
  });

  for (const [selector, lines] of selectorCounts.entries()) {
    if (lines.length > 1) {
      duplicateCssSelectors.push({
        file: c.name,
        selector,
        count: lines.length,
        lines: lines.slice(0, 20)
      });
    }
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  project,
  files: {
    dataFile: path.relative(project, dataFile),
    tsxFile: path.relative(project, tsxFile),
    cssFiles: cssFiles.map(f => path.relative(project, f))
  },
  totalSlidesDetected: objects.length,
  auditedSlides: slides,
  tsxLogic,
  cssAudit,
  duplicateCssSelectors: duplicateCssSelectors.slice(0, 300),
  recommendations: []
};

for (const s of slides) {
  if (s.error) {
    report.recommendations.push(`Slide ${s.slideNumber}: object tidak ditemukan.`);
    continue;
  }

  if (s.invalidDollarTokens.length) {
    report.recommendations.push(`Slide ${s.slideNumber}: ada token liar ${s.invalidDollarTokens.join(", ")}.`);
  }

  const missingAssets = s.assetStatus.filter(a => !a.exists);
  if (missingAssets.length) {
    report.recommendations.push(`Slide ${s.slideNumber}: ada asset tidak ditemukan: ${missingAssets.map(a => a.path).join(", ")}.`);
  }

  if (s.properties.mode === "walk" && !s.properties.walkDuration) {
    report.recommendations.push(`Slide ${s.slideNumber}: mode walk belum punya walkDuration khusus; animasi jalan akan ikut slide duration.`);
  }

  if (s.frames.length > 1 && s.frameSequenceMs.length && s.frameSequenceMs.length < s.frames.length) {
    report.recommendations.push(`Slide ${s.slideNumber}: jumlah frame lebih banyak daripada frameSequenceMs.`);
  }

  if (s.notes.length && s.fastNoteDelaysMs.length && s.fastNoteDelaysMs.length < s.notes.length) {
    report.recommendations.push(`Slide ${s.slideNumber}: jumlah notes lebih banyak daripada fastNoteDelaysMs.`);
  }
}

for (const c of cssAudit) {
  if (c.syntax.finalBraceBalance !== 0) {
    report.recommendations.push(`${c.file}: brace balance akhir ${c.syntax.finalBraceBalance}; cek kemungkinan block CSS belum tertutup/kelebihan.`);
  }
  if (c.syntax.suspiciousPercentOutsideKeyframes.length) {
    report.recommendations.push(`${c.file}: ada ${c.syntax.suspiciousPercentOutsideKeyframes.length} persen keyframe di luar @keyframes.`);
  }
  if (c.syntax.orphanClosingBraces.length) {
    report.recommendations.push(`${c.file}: ada indikasi orphan closing brace.`);
  }
}

fs.writeFileSync(reportJson, JSON.stringify(report, null, 2), "utf8");

let md = "";
md += `# Audit Teknis Slide 5-11\n\n`;
md += `Generated: ${report.generatedAt}\n\n`;
md += `Project: \`${project}\`\n\n`;
md += `Total slide terdeteksi: **${objects.length}**\n\n`;

md += `## Ringkasan Slide\n\n`;
md += `| Slide | Index | Mode | Duration | Walk Duration | Badge | H1 | H2 | Frames | Notes | Asset Missing |\n`;
md += `|---:|---:|---|---:|---:|---|---|---|---:|---:|---:|\n`;

for (const s of slides) {
  if (s.error) {
    md += `| ${s.slideNumber} | ${s.currentSlideIndex} | ERROR |  |  |  |  |  |  |  |  |\n`;
    continue;
  }
  const missing = s.assetStatus.filter(a => !a.exists).length;
  md += `| ${s.slideNumber} | ${s.currentSlideIndex} | ${s.properties.mode ?? ""} | ${s.properties.duration ?? ""} | ${s.properties.walkDuration ?? ""} | ${s.properties.badge ?? ""} | ${s.properties.h1 ?? ""} | ${s.properties.h2 ?? ""} | ${s.frames.length} | ${s.notes.length} | ${missing} |\n`;
}

md += `\n## Detail Slide\n\n`;

for (const s of slides) {
  md += `### Slide ${s.slideNumber} / currentSlide ${s.currentSlideIndex} / data-slide-index="${s.dataSlideIndex}"\n\n`;
  if (s.error) {
    md += `ERROR: ${s.error}\n\n`;
    continue;
  }

  md += `- Line range: \`${s.lineRange}\`\n`;
  md += `- Hash: \`${s.hash}\`\n`;
  md += `- Mode: \`${s.properties.mode}\`\n`;
  md += `- Duration: \`${s.properties.duration}\`\n`;
  md += `- Walk duration: \`${s.properties.walkDuration ?? ""}\`\n`;
  md += `- Badge: ${s.properties.badge ?? ""}\n`;
  md += `- H1: ${s.properties.h1 ?? ""}\n`;
  md += `- H2: ${s.properties.h2 ?? ""}\n`;
  md += `- Title: ${s.properties.title ?? ""}\n\n`;

  md += `**Frames aktif (${s.frames.length}):**\n\n`;
  if (s.frames.length) {
    s.frames.forEach((f, i) => {
      const asset = s.assetStatus.find(a => a.path === f);
      md += `${i + 1}. \`${f}\` — ${asset && asset.exists ? "OK" : "MISSING/NOT CHECKED"}\n`;
    });
  } else {
    md += `Tidak ada frames.\n`;
  }

  md += `\n**Notes aktif (${s.notes.length}):**\n\n`;
  if (s.notes.length) {
    s.notes.forEach((n, i) => {
      md += `${i + 1}. ${n}\n`;
    });
  } else {
    md += `Tidak ada notes.\n`;
  }

  if (s.frameSequenceMs.length) {
    md += `\n**frameSequenceMs:** \`${s.frameSequenceMs.join(", ")}\`\n`;
  }

  if (s.fastNoteDelaysMs.length) {
    md += `\n**fastNoteDelaysMs:** \`${s.fastNoteDelaysMs.join(", ")}\`\n`;
  }

  if (s.invalidDollarTokens.length) {
    md += `\n**ERROR token liar:** \`${s.invalidDollarTokens.join(", ")}\`\n`;
  }

  md += `\n`;
}

md += `## CSS Syntax Risk\n\n`;
for (const c of cssAudit) {
  md += `### ${c.file}\n\n`;
  md += `- Final brace balance: \`${c.syntax.finalBraceBalance}\`\n`;
  md += `- Minimum brace balance: \`${c.syntax.minimumBraceBalance}\`\n`;
  md += `- First negative line: \`${c.syntax.firstNegativeLine ?? ""}\`\n`;
  md += `- Percent outside keyframes: \`${c.syntax.suspiciousPercentOutsideKeyframes.length}\`\n`;
  md += `- Orphan closing braces: \`${c.syntax.orphanClosingBraces.length}\`\n\n`;

  if (c.syntax.suspiciousPercentOutsideKeyframes.length) {
    md += `Contoh percent outside keyframes:\n\n`;
    md += "```css\n";
    md += c.syntax.suspiciousPercentOutsideKeyframes.slice(0, 3).map(x => x.context).join("\n\n");
    md += "\n```\n\n";
  }
}

md += `## Duplicate CSS Selectors Terkait Journey\n\n`;
if (duplicateCssSelectors.length) {
  md += `Total duplicate selector: **${duplicateCssSelectors.length}**\n\n`;
  md += `| File | Count | Lines | Selector |\n`;
  md += `|---|---:|---|---|\n`;
  duplicateCssSelectors.slice(0, 80).forEach(d => {
    md += `| ${d.file} | ${d.count} | ${d.lines.join(", ")} | \`${d.selector.replace(/\|/g, "\\|")}\` |\n`;
  });
} else {
  md += `Tidak ditemukan duplicate selector besar.\n`;
}

md += `\n## Logic TSX yang Terdeteksi\n\n`;
for (const group of tsxLogic) {
  md += `### ${group.label}\n\n`;
  md += `Total hit: **${group.hits.length}**\n\n`;
  group.hits.slice(0, 10).forEach((h, i) => {
    md += `#### Hit ${i + 1} — line ${h.line}\n\n`;
    md += "```tsx\n";
    md += h.context;
    md += "\n```\n\n";
  });
}

md += `## Rekomendasi Awal\n\n`;
if (report.recommendations.length) {
  report.recommendations.forEach((r, i) => {
    md += `${i + 1}. ${r}\n`;
  });
} else {
  md += `Tidak ada error struktural besar yang langsung terdeteksi dari audit statis.\n`;
}

fs.writeFileSync(reportMd, md, "utf8");

console.log("=== AUDIT COMPLETE ===");
console.log("JSON:", reportJson);
console.log("Markdown:", reportMd);
console.log("");
console.log("=== QUICK SUMMARY ===");
for (const s of slides) {
  if (s.error) {
    console.log(`Slide ${s.slideNumber}: ERROR ${s.error}`);
    continue;
  }
  const missing = s.assetStatus.filter(a => !a.exists).length;
  console.log(
    `Slide ${s.slideNumber} idx ${s.currentSlideIndex}: mode=${s.properties.mode}, duration=${s.properties.duration}, walkDuration=${s.properties.walkDuration ?? "-"}, badge="${s.properties.badge ?? ""}", frames=${s.frames.length}, notes=${s.notes.length}, missingAssets=${missing}, lines=${s.lineRange}`
  );
}

console.log("");
console.log("=== CSS RISK SUMMARY ===");
for (const c of cssAudit) {
  console.log(`${c.file}: brace=${c.syntax.finalBraceBalance}, percentOutsideKeyframes=${c.syntax.suspiciousPercentOutsideKeyframes.length}, orphanBraces=${c.syntax.orphanClosingBraces.length}`);
}

console.log("");
console.log("=== RECOMMENDATIONS ===");
if (!report.recommendations.length) {
  console.log("Tidak ada rekomendasi error struktural besar.");
} else {
  report.recommendations.forEach((r, i) => console.log(`${i + 1}. ${r}`));
}
