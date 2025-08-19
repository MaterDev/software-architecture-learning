import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as clipboard from '../../utils/clipboard.js';
import { 
  buildAllPromptsText,
  copyText,
  copyAllStages,
  DEFAULT_SEPARATOR,
  DEFAULT_HEADER,
  STAGE_ORDER,
} from '../../utils/clipboard.js';

const makeStages = (map) => STAGE_ORDER.map(stage => ({ stage, prompt: map[stage] || '' }));

describe('utils/clipboard', () => {
  let originalNavigator;

  beforeEach(() => {
    originalNavigator = globalThis.navigator;
    globalThis.navigator = {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(void 0),
      },
    };
  });

  afterEach(() => {
    globalThis.navigator = originalNavigator;
    vi.restoreAllMocks();
  });

  describe('buildAllPromptsText', () => {
    it('builds text with default header and separator in stage order', () => {
      const stages = makeStages({
        'Expert Engineer': 'EE',
        'System Designer': 'SD',
        'Leader': 'LD',
        'Review & Synthesis': 'RS',
      });
      const text = buildAllPromptsText(stages);
      expect(text.startsWith(DEFAULT_HEADER)).toBe(true);
      const body = text.slice(DEFAULT_HEADER.length + 2); // skip header + two newlines
      expect(body).toBe(['EE', 'SD', 'LD', 'RS'].join(DEFAULT_SEPARATOR));
    });

    it('filters out missing or empty prompts', () => {
      const stages = makeStages({ 'Expert Engineer': 'EE', 'Leader': 'LD' });
      const text = buildAllPromptsText(stages);
      const body = text.slice(DEFAULT_HEADER.length + 2);
      expect(body).toBe(['EE', 'LD'].join(DEFAULT_SEPARATOR));
    });

    it('can exclude header when includeHeader=false', () => {
      const stages = makeStages({ 'Expert Engineer': 'EE', 'Leader': 'LD' });
      const text = buildAllPromptsText(stages, { includeHeader: false });
      expect(text).toBe(['EE', 'LD'].join(DEFAULT_SEPARATOR));
    });

    it('returns empty string when no prompts available', () => {
      expect(buildAllPromptsText([])).toBe('');
      expect(buildAllPromptsText(null)).toBe('');
    });
  });

  describe('copyText', () => {
    it('copies text using Clipboard API and returns true', async () => {
      const ok = await copyText('hello', { foo: 'bar' });
      expect(ok).toBe(true);
      expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalledWith('hello');
    });

    it('returns false when Clipboard API is unavailable', async () => {
      globalThis.navigator = {};
      const ok = await copyText('x');
      expect(ok).toBe(false);
    });

    it('returns false when writeText rejects', async () => {
      globalThis.navigator.clipboard.writeText.mockRejectedValueOnce(new Error('denied'));
      const ok = await copyText('x');
      expect(ok).toBe(false);
    });
  });

  describe('copyAllStages', () => {
    it('builds and copies all stages via copyText', async () => {
      const spy = vi.spyOn(clipboard, 'copyText').mockResolvedValue(true);
      const stages = makeStages({ 'Expert Engineer': 'EE', 'Leader': 'LD' });
      const ok = await copyAllStages(stages, {}, { source: 'test' });
      expect(ok).toBe(true);
      expect(spy).toHaveBeenCalledTimes(1);
      const built = buildAllPromptsText(stages);
      expect(spy.mock.calls[0][0]).toBe(built);
      expect(spy.mock.calls[0][1]).toMatchObject({ action: 'copy-all-stages', source: 'test' });
    });

    it('returns false when nothing to copy', async () => {
      const spy = vi.spyOn(clipboard, 'copyText');
      const ok = await copyAllStages([], {});
      expect(ok).toBe(false);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
