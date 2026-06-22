/**
 * One-time extraction script
 * Reads the existing TypeScript content files and writes structured markdown + JSON
 * into content/dsa/
 *
 * Run: bun scripts/extract-content.ts
 */

import * as fs from "fs";
import * as yaml from "gray-matter";
import * as path from "path";
import { advancedPhases } from "../lib/dsa-demo/advanced-phases";
import { basicPhases } from "../lib/dsa-demo/basic-phases";
import type { DemoPhase } from "../lib/dsa-demo/types";

const CONTENT_DIR = path.join(process.cwd(), "content", "dsa");

// ─── HTML to Markdown Converter (simple, tailored to our content) ────
function htmlToMarkdown(html: string): string {
  let md = html;

  // Handle escaped newlines (\\n in our strings)
  md = md.replace(/\\n/g, "\n");

  // Headers
  md = md.replace(/<h1>(.*?)<\/h1>/gs, "\n# $1\n");
  md = md.replace(/<h2>(.*?)<\/h2>/gs, "\n## $1\n");
  md = md.replace(/<h3>(.*?)<\/h3>/gs, "\n### $1\n");
  md = md.replace(/<h4>(.*?)<\/h4>/gs, "\n#### $1\n");

  // Code blocks: <pre><code>...</code></pre>
  md = md.replace(
    /<pre><code(?:\s+class="([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g,
    (_, lang, code) => {
      // Detect language from class or content
      let language = "";
      if (lang) {
        language = lang.replace("language-", "");
      } else if (
        code.includes("def ") ||
        code.includes("import ") ||
        code.includes("for ") ||
        code.includes("class ")
      ) {
        language = "python";
      } else if (code.includes("const ") || code.includes("function ") || code.includes("=>")) {
        language = "javascript";
      }
      // Unescape HTML entities in code
      const cleanCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"');
      return `\n\`\`\`${language}\n${cleanCode}\n\`\`\`\n`;
    },
  );

  // Inline code
  md = md.replace(/<code>(.*?)<\/code>/gs, "`$1`");

  // Bold and emphasis
  md = md.replace(/<strong>(.*?)<\/strong>/gs, "**$1**");
  md = md.replace(/<em>(.*?)<\/em>/gs, "*$1*");

  // Paragraphs
  md = md.replace(/<p>([\s\S]*?)<\/p>/g, "\n$1\n");

  // Blockquotes
  md = md.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (_, content) => {
    const lines = content.trim().split("\n");
    return "\n" + lines.map((l: string) => `> ${l.trim()}`).join("\n") + "\n";
  });

  // Unordered lists
  md = md.replace(/<ul>([\s\S]*?)<\/ul>/g, (_, content) => {
    const items = [...content.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => `- ${m[1].trim()}`);
    return "\n" + items.join("\n") + "\n";
  });

  // Ordered lists
  md = md.replace(/<ol>([\s\S]*?)<\/ol>/g, (_, content) => {
    const items = [...content.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(
      (m, i) => `${i + 1}. ${m[1].trim()}`,
    );
    return "\n" + items.join("\n") + "\n";
  });

  // Tables: convert <table> to markdown tables
  md = md.replace(/<table>([\s\S]*?)<\/table>/g, (_, tableContent) => {
    const rows: string[][] = [];
    const rowMatches = tableContent.match(/<tr>([\s\S]*?)<\/tr>/g) || [];
    for (const row of rowMatches) {
      const cells: string[] = [];
      const cellMatches = row.match(/<t[hd]>([\s\S]*?)<\/t[hd]>/g) || [];
      for (const cell of cellMatches) {
        const val = cell.replace(/<\/?t[hd]>/g, "").trim();
        cells.push(val);
      }
      rows.push(cells);
    }
    if (rows.length === 0) return "";

    // Build markdown table
    const headerRow = rows[0];
    const header = "| " + headerRow.join(" | ") + " |";
    const separator = "| " + headerRow.map(() => "---").join(" | ") + " |";
    const body = rows
      .slice(1)
      .map((r) => "| " + r.join(" | ") + " |")
      .join("\n");
    return `\n${header}\n${separator}\n${body}\n`;
  });

  // Clean up remaining HTML tags
  md = md.replace(/<br\s*\/?>/g, "\n");
  md = md.replace(/<\/?div[^>]*>/g, "");
  md = md.replace(/<\/?span[^>]*>/g, "");

  // HTML entities
  md = md.replace(/&lt;/g, "<");
  md = md.replace(/&gt;/g, ">");
  md = md.replace(/&amp;/g, "&");
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&nbsp;/g, " ");

  // Clean up excessive blank lines
  md = md.replace(/\n{3,}/g, "\n\n");
  md = md.trim();

  return md;
}

// ─── Slugify a title for directory/file naming ──────────────────────
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ─── Pad number for sorting ─────────────────────────────────────────
function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}

// ─── Main ───────────────────────────────────────────────────────────
async function main() {
  const allPhases: DemoPhase[] = [...basicPhases, ...advancedPhases];

  // Clean output directory
  if (fs.existsSync(CONTENT_DIR)) {
    fs.rmSync(CONTENT_DIR, { recursive: true });
  }
  fs.mkdirSync(CONTENT_DIR, { recursive: true });

  // Write course metadata
  const courseYaml = yaml.stringify("", {
    title: "DSA Mastery",
    description:
      "Master Data Structures and Algorithms from memory models to dynamic programming. 14 phases, 51 lessons with interactive visualizations and LeetCode practice.",
    slug: "dsa-mastery",
    difficulty: "INTERMEDIATE",
    topic: "Data Structures & Algorithms",
    type: "CURATED",
    icon: "Brain",
    color: "#cba6f7",
    estimatedHours: 40,
  });
  fs.writeFileSync(path.join(CONTENT_DIR, "_course.yaml"), courseYaml.trim() + "\n");

  console.log(`✓ Course metadata written`);
  console.log(
    `\nExtracting ${allPhases.length} phases, ${allPhases.reduce((s, p) => s + p.lessons.length, 0)} lessons...\n`,
  );

  for (const phase of allPhases) {
    const phaseSlug = slugify(phase.title);
    const phaseDir = path.join(CONTENT_DIR, `phase-${pad(phase.phase)}-${phaseSlug}`);
    fs.mkdirSync(phaseDir, { recursive: true });

    // Write phase metadata
    const phaseData: Record<string, any> = {
      id: phase.id,
      phase: phase.phase,
      title: phase.title,
      goal: phase.goal,
      bossChallenge: phase.bossChallenge,
      leetcode: phase.leetcode,
    };
    if (phase.keystone) {
      phaseData.keystone = true;
    }
    const phaseYaml = yaml.stringify("", phaseData);
    fs.writeFileSync(path.join(phaseDir, "_phase.yaml"), phaseYaml.trim() + "\n");

    for (let i = 0; i < phase.lessons.length; i++) {
      const lesson = phase.lessons[i];
      const lessonSlug = slugify(lesson.title);
      const lessonFile = `${pad(i + 1)}-${lessonSlug}.md`;

      // Convert HTML content to Markdown
      const markdown = htmlToMarkdown(lesson.content);

      // Build frontmatter
      const frontmatter = {
        id: lesson.id,
        code: lesson.code,
        title: lesson.title,
      };

      // Compose the full markdown file
      const fileContent = yaml.stringify(markdown, frontmatter);
      fs.writeFileSync(path.join(phaseDir, lessonFile), fileContent);

      // Write visualization if present
      if (lesson.visualization) {
        const vizFile = `${pad(i + 1)}-${lessonSlug}.viz.json`;
        fs.writeFileSync(
          path.join(phaseDir, vizFile),
          JSON.stringify(lesson.visualization, null, 2) + "\n",
        );
      }
    }

    console.log(`  ✓ Phase ${phase.phase}: ${phase.title} — ${phase.lessons.length} lessons`);
  }

  // Summary
  const totalMd = allPhases.reduce((s, p) => s + p.lessons.length, 0);
  const totalViz = allPhases.reduce(
    (s, p) => s + p.lessons.filter((l) => l.visualization).length,
    0,
  );
  console.log(`\n═══════════════════════════════════════`);
  console.log(`  Extracted ${totalMd} markdown files + ${totalViz} visualization JSONs`);
  console.log(`  Output: ${CONTENT_DIR}`);
  console.log(`═══════════════════════════════════════\n`);
}

main().catch(console.error);
