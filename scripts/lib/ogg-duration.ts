import type { RuleSet } from './package-rules.ts';

const PAGE_MARK = 'OggS';
const PAGE_HEADER = 27;
const OPUS_RATE = 48000;

export class OggDuration {
  seconds(bytes: Uint8Array): number | null {
    const text = new TextDecoder('latin1').decode(bytes);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const rate = this.#rateOf(text, view);
    const last = text.lastIndexOf(PAGE_MARK);
    if (rate === null || last < 0 || last + PAGE_HEADER > bytes.length) return null;

    return Number(view.getBigInt64(last + 6, true)) / rate;
  }

  limit(rules: RuleSet, event: string): number | null {
    if (rules.longEvents.includes(event)) return null;

    return rules.clickEvents.includes(event) ? rules.clickSeconds : rules.soundSeconds;
  }

  #rateOf(text: string, view: DataView): number | null {
    if (!text.startsWith(PAGE_MARK) || text.length < PAGE_HEADER) return null;

    const packet = PAGE_HEADER + view.getUint8(26);
    if (text.startsWith('OpusHead', packet)) return OPUS_RATE;
    if (text.startsWith('\u0001vorbis', packet) && packet + 16 <= text.length) {
      return view.getUint32(packet + 12, true);
    }

    return null;
  }
}

export const oggDuration = new OggDuration();
