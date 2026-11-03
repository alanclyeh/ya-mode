#!/usr/bin/env node
// Skill reference graph.
//   refgraph.mjs <skills-dir> closure <root>...   skills reachable from the roots
//   refgraph.mjs <skills-dir> edges               every skill's outgoing skill references
//   refgraph.mjs <skills-dir> check <names-file>  fail on references to names in the file, or on broken relative paths
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const [root, mode, ...args] = process.argv.slice(2);
const skills = readdirSync(root).filter((d) => existsSync(join(root, d, 'SKILL.md')));

const mdFiles = (dir) =>
  readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    if (e === 'node_modules' || e.startsWith('.')) return [];
    return statSync(p).isDirectory() ? mdFiles(p) : p.endsWith('.md') ? [p] : [];
  });

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Bare words such as "how" are too common, so a reference needs markup: bold, backticks, a slash command, a namespace, or a path.
const refPattern = (name) =>
  new RegExp(`\\*\\*${esc(name)}\\*\\*|\`/?${esc(name)}\`|(?:^|[\\s(])/${esc(name)}\\b|\\b[a-z-]+:${esc(name)}\\b|/${esc(name)}/`, 'm');

const refsOf = (skill, names) => {
  const text = mdFiles(join(root, skill)).map((f) => readFileSync(f, 'utf8')).join('\n');
  return names.filter((n) => n !== skill && refPattern(n).test(text));
};

if (mode === 'edges') {
  for (const s of skills) console.log(`${s}: ${refsOf(s, skills).join(' ')}`);
} else if (mode === 'closure') {
  const seen = new Set(args);
  const queue = [...args];
  while (queue.length) for (const n of refsOf(queue.shift(), skills)) if (!seen.has(n)) seen.add(n), queue.push(n);
  console.log([...seen].sort().join('\n'));
} else if (mode === 'check') {
  const banned = readFileSync(args[0], 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  let bad = 0;
  for (const s of skills) {
    for (const f of mdFiles(join(root, s))) {
      const text = readFileSync(f, 'utf8');
      for (const n of banned) if (refPattern(n).test(text)) console.log(`${f}: references dropped name ${n}`), bad++;
      for (const [, p] of text.matchAll(/\]\(((?:\.\.?\/|playbooks\/|references\/|scripts\/)[^)#\s]+)/g)) {
        if (!existsSync(resolve(dirname(f), p))) console.log(`${f}: broken link ${p}`), bad++;
      }
      for (const [, p] of text.matchAll(/`((?:playbooks|references)\/[\w./-]+\.md)`/g)) {
        if (!existsSync(join(root, s, p)) && !existsSync(resolve(dirname(f), p))) console.log(`${f}: missing ${p}`), bad++;
      }
    }
  }
  console.log(bad ? `${bad} problem(s)` : 'ok');
  process.exit(bad ? 1 : 0);
} else {
  console.error('usage: refgraph.mjs <skills-dir> edges | closure <root>... | check <names-file>');
  process.exit(2);
}
