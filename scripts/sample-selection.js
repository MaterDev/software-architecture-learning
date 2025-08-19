#!/usr/bin/env bun
/* eslint-env node */
/*
 * Sample domain selection frequencies to guide weight tuning
 * Usage:
 *   bun run sample:selection -- --trials=500
 *   bun run sample:selection -- --trials=1000 --weights='{"webassembly":50}'
 */
import { ScenarioRepository } from '../src/data/repositories/ScenarioRepository.js';

function parseArgs(argv) {
  const args = {};
  for (const part of argv.slice(2)) {
    const m = part.match(/^--([^=]+)=(.*)$/);
    if (m) args[m[1]] = m[2];
  }
  return args;
}

function formatPct(n) {
  return (n * 100).toFixed(1) + '%';
}

async function main() {
  const args = parseArgs(process.argv);
  const trials = Math.max(1, Number(args.trials || 500));
  let overrides = null;
  if (args.weights) {
    try { overrides = JSON.parse(args.weights); } catch (e) { console.error('Invalid --weights JSON:', e.message); }
  }

  const repo = new ScenarioRepository();
  if (overrides && typeof overrides === 'object') {
    repo.setDomainWeights(overrides);
  }

  const weights = repo.getDomainWeights();
  const counts = new Map();

  for (let i = 0; i < trials; i++) {
    const ctx = repo.selectContext();
    const key = ctx?.name || 'unknown';
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const rows = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, ratio: count / trials, weight: weights[name] ?? 1 }));

  console.log('\nDomain selection sampling');
  console.log('Trials:', trials);
  if (overrides) console.log('Overrides:', overrides);
  console.log('\nTop domains:');
  for (const r of rows.slice(0, 15)) {
    console.log(`- ${r.name.padEnd(24)} count=${String(r.count).padStart(4)}  pct=${formatPct(r.ratio).padStart(6)}  weight=${r.weight}`);
  }

  // Basic coverage hint
  const unique = rows.length;
  console.log(`\nCoverage: ${unique}/${repo.getDomainCount()} domains observed (${formatPct(unique / repo.getDomainCount())})`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
