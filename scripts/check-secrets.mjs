#!/usr/bin/env node

/**
 * Scan public-repo content without ever printing a detected secret value.
 */

import { readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_TEXT_SIZE = 2 * 1024 * 1024;
const UTF8_DECODER = new TextDecoder("utf-8", { fatal: true });
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const PNG_METADATA_CHUNKS = new Set(["tEXt", "zTXt", "iTXt", "eXIf"]);

const PLACEHOLDER =
  /^(?:\$\{[^}]+\}|\{\{[^}]+\}\}|<[^>]+>|(?:your|example|sample|placeholder|dummy|fake|test|replace|redacted)(?:[-_\s].*)?|x{4,}|\*{4,}|none|null)$/i;

const SECRET_PATTERNS = [
  [
    "private key",
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/,
  ],
  [
    "GitHub token",
    /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/,
  ],
  ["GitLab token", /\bglpat-[A-Za-z0-9_-]{20,}\b/],
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["Google API key", /\bAIza[A-Za-z0-9_-]{30,}\b/],
  ["OpenAI API key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/],
  ["Anthropic API key", /\bsk-ant-[A-Za-z0-9_-]{20,}\b/],
  ["Hugging Face token", /\bhf_[A-Za-z0-9]{30,}\b/],
  ["npm token", /\bnpm_[A-Za-z0-9]{30,}\b/],
  ["PyPI token", /\bpypi-[A-Za-z0-9_-]{30,}\b/],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ["Stripe live key", /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/],
  ["Azure storage account key", /\bAccountKey=[A-Za-z0-9+/]{40,}={0,2}/i],
  ["credential in URL", /\b[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^/\s@]+@/i],
];

const PRIVATE_NETWORK =
  /(?:^|[^0-9])(?:10\.[0-9]{1,3}(?:\.[0-9]{1,3}){2}|192\.168\.[0-9]{1,3}\.[0-9]{1,3}|172\.(?:1[6-9]|2[0-9]|3[01])\.[0-9]{1,3}\.[0-9]{1,3})(?:$|[^0-9])/;

const GENERIC_ASSIGNMENT =
  /(?:api[-_]?key|access[-_]?token|auth[-_]?token|client[-_]?secret|private[-_]?key|password|passwd|secret|token)\s*(?:=|:)\s*(?<quote>["']?)(?<value>[^\s"'`,;#}{]+)\k<quote>/gi;

const COMMAND_ARGUMENT =
  /--(?:api[-_]?key|client[-_]?secret|password|secret|token)(?:=|\s+)(?<quote>["']?)(?<value>[^\s"'`,;#}{]+)\k<quote>/gi;

const SENSITIVE_FILENAMES = [
  /(?:^|\/)\.env(?:\..+)?$/i,
  /(?:^|\/)(?:id_rsa|id_ed25519)$/i,
  /\.(?:key|pem|p12|pfx|jks)$/i,
  /(?:^|\/)(?:credentials|[^/]*service-account[^/]*)\.json$/i,
  /(?:^|\/)secrets?\.(?:json|ya?ml|toml|ini|env)$/i,
  /(?:^|\/)\.codex\/local-context\.md$/i,
];

const GENERATED_DIRECTORIES = new Set(["node_modules", ".svelte-kit", "build"]);

function runGit(...args) {
  const result = spawnSync("git", ["-C", REPO_ROOT, ...args], {
    encoding: null,
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });
  if (result.status !== 0) {
    const message = result.stderr.toString("utf8").trim();
    throw new Error(message || `git ${args.join(" ")} failed`);
  }
  return result.stdout;
}

function normalizePath(path) {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

function isAllowedExample(path) {
  const name = normalizePath(path).split("/").at(-1).toLowerCase();
  return (
    name === ".env.example" ||
    (name.startsWith(".env.") && name.endsWith(".example"))
  );
}

function sensitiveFilename(path) {
  const normalized = normalizePath(path);
  return (
    !isAllowedExample(normalized) &&
    SENSITIVE_FILENAMES.some((pattern) => pattern.test(normalized))
  );
}

function isGeneratedPath(path) {
  return normalizePath(path)
    .split("/")
    .some((segment) => GENERATED_DIRECTORIES.has(segment));
}

function decodeText(content) {
  if (
    content.byteLength > MAX_TEXT_SIZE ||
    content.subarray(0, 8192).includes(0)
  ) {
    return null;
  }
  try {
    return UTF8_DECODER.decode(content);
  } catch {
    return null;
  }
}

function looksLikePlaceholder(value) {
  const cleaned = value.trim().replace(/^["']|["']$/g, "");
  return cleaned.length < 8 || PLACEHOLDER.test(cleaned);
}

function findingKey({ scope, path, detector }) {
  return `${scope}\0${path}\0${detector}`;
}

function addFinding(findings, scope, path, detector) {
  const finding = { scope, path, detector };
  findings.set(findingKey(finding), finding);
}

function scanText(scope, path, text) {
  const findings = new Map();

  for (const [label, pattern] of SECRET_PATTERNS) {
    if (pattern.test(text)) {
      addFinding(findings, scope, path, label);
    }
  }

  if (PRIVATE_NETWORK.test(text)) {
    addFinding(findings, scope, path, "private network address");
  }

  for (const pattern of [GENERIC_ASSIGNMENT, COMMAND_ARGUMENT]) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      if (!looksLikePlaceholder(match.groups.value)) {
        addFinding(findings, scope, path, "literal credential assignment");
        break;
      }
    }
  }

  return findings;
}

function scanBinaryMetadata(scope, path, content) {
  const findings = new Map();
  if (
    content.byteLength < PNG_SIGNATURE.byteLength ||
    !content.subarray(0, PNG_SIGNATURE.byteLength).equals(PNG_SIGNATURE)
  ) {
    return findings;
  }

  let offset = PNG_SIGNATURE.byteLength;
  while (offset + 12 <= content.byteLength) {
    const chunkLength = content.readUInt32BE(offset);
    const chunkEnd = offset + 12 + chunkLength;
    if (chunkEnd > content.byteLength) break;

    const chunkType = content.toString("ascii", offset + 4, offset + 8);
    if (PNG_METADATA_CHUNKS.has(chunkType)) {
      addFinding(findings, scope, path, "embedded PNG metadata");
      break;
    }

    offset = chunkEnd;
    if (chunkType === "IEND") break;
  }
  return findings;
}

function splitNull(output) {
  return output
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .map(normalizePath);
}

function worktreePaths() {
  return splitNull(runGit("ls-files", "-co", "--exclude-standard", "-z")).sort();
}

function ignoredSensitivePaths() {
  const findings = new Map();
  const paths = splitNull(
    runGit("ls-files", "-o", "-i", "--exclude-standard", "-z"),
  );
  for (const path of paths) {
    if (!isGeneratedPath(path) && sensitiveFilename(path)) {
      addFinding(findings, "ignored", path, "sensitive filename");
    }
  }
  return findings;
}

function scanWorktree() {
  const findings = new Map();
  let scanned = 0;

  for (const path of worktreePaths()) {
    if (sensitiveFilename(path)) {
      addFinding(findings, "worktree", path, "sensitive filename");
    }

    const fullPath = join(REPO_ROOT, path);
    let content;
    try {
      if (!statSync(fullPath).isFile()) continue;
      content = readFileSync(fullPath);
    } catch {
      addFinding(findings, "worktree", path, "unreadable file");
      continue;
    }

    for (const [key, finding] of scanBinaryMetadata(
      "worktree",
      path,
      content,
    )) {
      findings.set(key, finding);
    }

    const text = decodeText(content);
    if (text === null) continue;
    scanned += 1;
    for (const [key, finding] of scanText("worktree", path, text)) {
      findings.set(key, finding);
    }
  }

  for (const [key, finding] of ignoredSensitivePaths()) {
    findings.set(key, finding);
  }
  return { findings, scanned };
}

function parseTree(commit) {
  const entries = [];
  for (const entry of runGit(
    "ls-tree",
    "-r",
    "-z",
    "--full-tree",
    commit,
  )
    .toString("utf8")
    .split("\0")
    .filter(Boolean)) {
    const [metadata, path] = entry.split("\t", 2);
    const [, objectType, objectId] = metadata.split(" ");
    if (objectType === "blob") {
      entries.push([objectId, normalizePath(path)]);
    }
  }
  return entries;
}

function scanHistory() {
  const commits = runGit("rev-list", "--all")
    .toString("ascii")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const blobResults = new Map();
  const reported = new Set();
  const findings = new Map();

  for (const commit of commits) {
    const scope = `history@${commit.slice(0, 12)}`;
    for (const [objectId, path] of parseTree(commit)) {
      if (
        sensitiveFilename(path) &&
        !reported.has(`${path}\0sensitive filename`)
      ) {
        addFinding(findings, scope, path, "sensitive filename");
        reported.add(`${path}\0sensitive filename`);
      }

      if (!blobResults.has(objectId)) {
        const content = runGit("cat-file", "blob", objectId);
        const labels = [
          ...scanBinaryMetadata(scope, path, content).values(),
        ].map((finding) => finding.detector);
        const text = decodeText(content);
        if (text !== null) {
          labels.push(
            ...[...scanText(scope, path, text).values()].map(
              (finding) => finding.detector,
            ),
          );
        }
        blobResults.set(objectId, labels);
      }

      for (const label of blobResults.get(objectId)) {
        const reportKey = `${path}\0${label}`;
        if (reported.has(reportKey)) continue;
        addFinding(findings, scope, path, label);
        reported.add(reportKey);
      }
    }
  }

  return { findings, scanned: blobResults.size };
}

function runSelfTest() {
  const cases = [
    [
      "GitHub token",
      ["value=", "ghp_", "A".repeat(36)].join(""),
    ],
    [
      "private key",
      ["-----BEGIN ", "PRIVATE KEY-----"].join(""),
    ],
    [
      "literal credential assignment",
      ["pass", "word", "=", "not-a-real-credential"].join(""),
    ],
    [
      "private network address",
      ["192", "168", "10", "24"].join("."),
    ],
  ];

  for (const [expected, sample] of cases) {
    const detectors = new Set(
      [...scanText("self-test", "fixture", sample).values()].map(
        (finding) => finding.detector,
      ),
    );
    if (!detectors.has(expected)) {
      throw new Error(`self-test failed for detector: ${expected}`);
    }
  }

  const placeholderSamples = [
    ["--", "token", " ", "YOUR_TOKEN"].join(""),
    ["token", ": ", "${CI_TOKEN}"].join(""),
  ];
  for (const sample of placeholderSamples) {
    const detectors = new Set(
      [...scanText("self-test", "fixture", sample).values()].map(
        (finding) => finding.detector,
      ),
    );
    if (detectors.has("literal credential assignment")) {
      throw new Error("self-test rejected a documented placeholder");
    }
  }

  const metadataChunk = Buffer.alloc(12);
  metadataChunk.writeUInt32BE(0, 0);
  metadataChunk.write("tEXt", 4, "ascii");
  const pngWithMetadata = Buffer.concat([PNG_SIGNATURE, metadataChunk]);
  const metadataDetectors = new Set(
    [...scanBinaryMetadata("self-test", "fixture.png", pngWithMetadata).values()].map(
      (finding) => finding.detector,
    ),
  );
  if (!metadataDetectors.has("embedded PNG metadata")) {
    throw new Error("self-test failed for detector: embedded PNG metadata");
  }
}

function main() {
  const allowedArgs = new Set(["--history", "--self-test"]);
  const unknownArgs = process.argv.slice(2).filter((arg) => !allowedArgs.has(arg));
  if (unknownArgs.length > 0) {
    console.error(`Unknown argument: ${unknownArgs[0]}`);
    return 2;
  }

  const includeHistory = process.argv.includes("--history");
  const allFindings = new Map();

  try {
    if (process.argv.includes("--self-test")) {
      runSelfTest();
      console.log("Secret scanner self-test passed.");
    }

    const worktree = scanWorktree();
    for (const [key, finding] of worktree.findings) {
      allFindings.set(key, finding);
    }

    let historyCount = 0;
    if (includeHistory) {
      const history = scanHistory();
      historyCount = history.scanned;
      for (const [key, finding] of history.findings) {
        allFindings.set(key, finding);
      }
    }

    if (allFindings.size > 0) {
      console.error(
        "Potential public-repo secret or private infrastructure detail detected. " +
          "Values are intentionally hidden.",
      );
      const sorted = [...allFindings.values()].sort((a, b) =>
        findingKey(a).localeCompare(findingKey(b)),
      );
      for (const finding of sorted) {
        console.error(
          `- ${finding.scope}:${finding.path} [${finding.detector}]`,
        );
      }
      return 1;
    }

    let summary = `Secret scan passed: ${worktree.scanned} worktree text files`;
    if (includeHistory) {
      summary += `; ${historyCount} unique Git-history blobs`;
    }
    console.log(`${summary}.`);
    return 0;
  } catch (error) {
    console.error(`Secret scan could not run: ${error.message}`);
    return 2;
  }
}

process.exitCode = main();
