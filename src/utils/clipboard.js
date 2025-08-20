import { logger } from './logger.js';

export const STAGE_ORDER = ['Expert Engineer', 'System Designer', 'Leader', 'Review & Synthesis'];
export const DEFAULT_SEPARATOR = '\n\n--- --- ---\n\n';
export const DEFAULT_HEADER = [
  'Gemini, please create the following lessons as SEPARATE CANVASES.',
  'Each canvas should correspond to the next prompt block and remain independent.',
  "Use the delimiter line '--- --- ---' as the boundary between canvases.",
  'Do not merge content across canvases.'
].join(' ');

/**
 * Build a combined text for all stage prompts using a consistent order, header, and separator.
 */
export function buildAllPromptsText(allStages, {
  order = STAGE_ORDER,
  separator = DEFAULT_SEPARATOR,
  includeHeader = true,
  header = DEFAULT_HEADER,
} = {}) {
  if (!Array.isArray(allStages) || allStages.length === 0) return '';
  const prompts = order
    .map(name => allStages.find(s => s?.stage === name)?.prompt)
    .filter(Boolean);
  if (prompts.length === 0) return '';
  const body = prompts.join(separator);
  return includeHeader ? `${header}\n\n${body}` : body;
}

/**
 * Copy plain text to the system clipboard with unified logging.
 * Returns true on success, false otherwise.
 */
export async function copyText(text, meta = {}) {
  if (!text || typeof text !== 'string') return false;
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard || !navigator.clipboard.writeText) {
      throw new Error('Clipboard API not available');
    }
    await navigator.clipboard.writeText(text);
    logger.info('Clipboard', 'Copy success', meta);
    return true;
  } catch (error) {
    logger.error('Clipboard', 'Copy failed', { ...meta, error: error.message });
    return false;
  }
}

/**
 * Convenience helper to copy all stage prompts in a single call.
 */
export async function copyAllStages(allStages, options = {}, meta = {}) {
  const text = buildAllPromptsText(allStages, options);
  if (!text) return false;
  return copyText(text, { action: 'copy-all-stages', ...meta });
}

