import { useMemo, useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Superscript digit map  (used for scientific exponents)
// ─────────────────────────────────────────────────────────────────────────────
const SUPER: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "-": "⁻", "+": "⁺",
};
const toSup = (s: string) => s.split("").map((c) => SUPER[c] ?? c).join("");

// ─────────────────────────────────────────────────────────────────────────────
// PDF plain-text-math → readable Unicode  (applied in order; order matters)
// ─────────────────────────────────────────────────────────────────────────────
type Fix = [RegExp, string | ((m: string, ...g: string[]) => string)];

const FIXES: Fix[] = [

  // ── 0. Roman numeral exercise-number artifacts (PTB book 2-column PDF) ─────
  //   The PTB textbook numbers exercises in Roman numerals inside the layout.
  //   PDF extraction interleaves them into the question text, e.g.:
  //     "15 . IX Identify..."      →  "Identify..."
  //     "0.35 . XLI 0.35"         →  "0.35 0.35"  (dupe removed by pass below)
  //     ": . CCCXXVIII k(x)=100"  →  " k(x)=100"
  //   Only letters from {I,V,X,L,C,D,M} match — the exact Roman numeral set.
  //   {2,} catches multi-char Roman numerals (IX, XXXI, CCCXXVIII…)
  //   [XLCDM] catches single-char X/L/C/D/M — I and V excluded (too common as
  //   English letters: pronoun "I", Roman numeral V vs. version/grade "V").
  [/^\S{0,15}\s*\.\s+(?:[IVXLCDM]{2,}|[XLCDM])\s+/, ""],   // "15 . IX " or "p . XVII " at START
  [/:?\s*\.\s+(?:[IVXLCDM]{2,}|[XLCDM])\s*/g, " "],          // ". CCCXXVIII " or ": . X " in middle
  //   After stripLeadingNumber strips "1 . " the bare Roman stays: "XIII Represent…"
  //   Require a capital letter after so we don't strip real words like "MIX".
  [/^(?:[IVXLCDM]{2,}|[XLCDM])\s+(?=[A-Z])/g, ""],          // "XIII Represent…" → "Represent…"
  // NOTE: leading digit artifact ("1 Name…") is cleaned AFTER dedup — see preprocessMathText

  // ── 1. Non-breaking space → regular space ─────────────────────────────────
  [/ /g, " "],

  // ── 2. Private-use-area glyphs (PDF font artifacts) → remove ─────────────
  // Chars U+F200..U+F4FF are from the PDF's private encoding; meaningless here.
  [/[-]/g, ""],

  // ── 3. Parenthesis extension chars (multi-line bracket from PDF) ──────────
  //   ⎛ ⎝  = upper/lower hooks  →  (      (open paren)
  //   ⎜    = middle extension   →  ""     (just remove — it's the vertical stretch)
  //   ⎞ ⎠  = upper/lower hooks  →  )
  //   ⎟    = middle extension   →  ""
  [/[⎛⎝]/g, "("],
  [/⎜/g, ""],
  [/[⎞⎠]/g, ")"],
  [/⎟/g, ""],

  // ── 4. Curly-bracket extension chars (set notation) ──────────────────────
  //   ⎧⎨  =  left curly bracket parts   →  {
  //   ⎫⎬  =  right curly bracket parts  →  }
  //   ⎪⎮⎪ =  vertical bar extensions   →  |
  [/[⎧⎨]/g, "{"],
  [/[⎫⎬]/g, "}"],
  [/[⎪⎮]/g, "|"],

  // ── 5. Box-drawings vertical bar → pipe (used as set-builder  |  ) ────────
  [/│/g, "|"],

  // ── 6. Horizontal-line extension (overline artifact) → remove ────────────
  [/⎯/g, ""],

  // ── 7. ⨍ (Finite Part Integral U+2A0D) used as letter f ──────────────────
  //   The PDF font mapped italic 'f' to this code point.
  [/⨍/g, "f"],

  // ── 8. En-dash / em-dash used as minus sign ───────────────────────────────
  //   Leave the proper Unicode MINUS SIGN (U+2212 −) alone.
  [/([=(\[{+\-×÷\s])–([0-9\s(])/g, "$1−$2"],  // contextual en-dash → minus
  [/([=(\[{+\-×÷\s])—([0-9\s(])/g, "$1−$2"],  // contextual em-dash → minus

  // ── 9. Degree symbol ───────────────────────────────────────────────────────
  //   9a. Number immediately followed by 'o' then non-letter → degree
  //       Handles: 30o  45o  90o  180o  73.12o  1o  etc.
  //       Also:    30oC  100oF  (temperature)
  [/(\d+\.?\d*)\s*o([CF]?\b)/g, (_, n, unit) => `${n}°${unit}`],
  //   9b. Standalone 'oC' / 'oF'  (temperature without preceding digit)
  [/\bo([CF])\b/g, "°$1"],
  //   9c. 'o' before arcminute notation:  o12' 15''  →  °12' 15''
  [/\bo(\d)/g, "°$1"],
  //   9d. ')o' / ',o'  (closing bracket then degree, angle answers in MCQ)
  [/([),])o(?!\s*[a-zA-Z])/g, "$1°"],

  // ── 10. Scientific-notation exponents ─────────────────────────────────────
  //   7.8×10 −5   →  7.8×10⁻⁵
  //   ×10 3       →  ×10³
  //   x105        →  ×10⁵  (PDF uses 'x' for multiplication in sci-notation)
  [/\b10\s*[−–-]\s*(\d+)/g, (_, e) => `10${toSup("-" + e)}`],
  [/×\s*10\s*(\d+)/g, (_, e) => `×10${toSup(e)}`],
  [/\bx\s*10\s*(\d+)/g, (_, e) => `×10${toSup(e)}`],

  // ── 11. Unit superscripts  (before single-letter rule) ───────────────────
  //   cm2 → cm²   km2 → km²   m2 → m²   cm3 → cm³   m3 → m³
  //   Note: no leading \b — digits and letters are both \w so 36cm2 has no \b
  //   between '6' and 'c'. Use lookahead only.
  [/cm2(?!\w)/g, "cm²"], [/km2(?!\w)/g, "km²"],
  [/m2(?!\w)/g,  "m²"],  [/cm3(?!\w)/g, "cm³"],
  [/km3(?!\w)/g, "km³"], [/m3(?!\w)/g,  "m³"],

  // ── 12. Trig-function superscripts ────────────────────────────────────────
  //   sin2θ  →  sin²θ     cos2θ  →  cos²θ     tan2  →  tan²  etc.
  [/\b(sin|cos|tan|sec|cot|cosec|sinh|cosh|tanh)\s*2\b/gi, "$1²"],
  [/\b(sin|cos|tan|sec|cot|cosec|sinh|cosh|tanh)\s*3\b/gi, "$1³"],
  //   Also when 2 is immediately followed by a Greek letter (no space): sin2θ
  [/(sin|cos|tan|sec|cot|cosec)2([θαβγδϕφψω])/gi, "$1²$2"],

  // ── 13. Single-variable superscripts ──────────────────────────────────────
  //   a2  →  a²    b2  →  b²    x2  →  x²   (word-boundary guard avoids
  //   converting 'log2' which is log-base-2, not log-squared)
  [/(?<![a-zA-Z])([a-zA-Z])2(?![a-zA-Z0-9])/g, "$1²"],
  [/(?<![a-zA-Z])([a-zA-Z])3(?![a-zA-Z0-9])/g, "$1³"],

  // ── 14. Collapse leftover multi-spaces ────────────────────────────────────
  [/\s{2,}/g, " "],
];

// ─────────────────────────────────────────────────────────────────────────────
// Trailing-repeat removal
// Handles the PDF pattern: "STEM: VALUE : REPEAT_OF_STEM"
//   e.g.  "If s(x)=8x²−3 find: s(7/2): s(x)=8x²−3"
//       → "If s(x)=8x²−3 find: s(7/2)"
// Works by finding the last ": " and checking whether its tail (or a prefix of
// the tail bounded by a word-space) appears verbatim earlier in the text.
// ─────────────────────────────────────────────────────────────────────────────
function removeTrailingRepeat(text: string): string {
  let result = text;
  let changed = true;
  while (changed) {
    changed = false;
    const colonIdx = result.lastIndexOf(": ");
    if (colonIdx === -1) break;
    const tail = result.slice(colonIdx + 2).trim();
    if (tail.length < 5) break;
    const before = result.slice(0, colonIdx);
    // Exact match
    if (before.includes(tail)) {
      result = before.trim();
      changed = true;
      continue;
    }
    // Prefix match — try decreasing prefix lengths, breaking only at spaces
    for (let len = Math.min(50, tail.length - 1); len >= 5; len--) {
      if (tail[len] !== " ") continue;            // only break at word boundaries
      const prefix = tail.slice(0, len);
      if (before.includes(prefix)) {
        result = before.trim();                   // remove entire tail, including suffix
        changed = true;
        break;
      }
    }
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Adjacent-duplicate phrase removal
// Handles the PDF-column-interleave artifact where the same clause appears
// twice in a row, e.g. "0.35  0.35" → "0.35"  or  "a<b a<b" → "a<b".
// Runs repeatedly until stable (catches nested duplicates).
// ─────────────────────────────────────────────────────────────────────────────
function deduplicateAdjacent(text: string): string {
  // Match: any 1–6 non-space tokens, then 1+ spaces, then the exact same tokens
  const re = /(\S+(?:\s+\S+){0,5})\s+\1(?=[\s,;.!?]|$)/g;
  let prev = "";
  let result = text;
  while (prev !== result) {
    prev = result;
    result = result.replace(re, "$1").replace(/\s{2,}/g, " ");
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Trailing-token-repeat removal
// Handles the PDF artifact "STEM: If COND then RESULT COND RESULT"
//   → "STEM: If COND then RESULT"
// where the last 2–4 tokens of the tail each appear standalone in the text
// preceding those tokens (i.e. they are a repetition from the Urdu column).
// Complements removeTrailingRepeat which requires the full tail to match;
// this one only requires the SUFFIX of the tail to match.
// Returns [cleanedText, removedTokens] so callers can detect what was stripped.
// ─────────────────────────────────────────────────────────────────────────────
function removeTrailingTokenRepeatFull(text: string): [string, string[]] {
  const colonIdx = text.lastIndexOf(": ");
  if (colonIdx === -1) return [text, []];
  const before = text.slice(0, colonIdx);
  const tail = text.slice(colonIdx + 2).trim();
  const words = tail.split(/\s+/);
  if (words.length < 4) return [text, []];
  for (let n = Math.min(4, Math.floor(words.length / 2)); n >= 2; n--) {
    const suffixWords = words.slice(-n);
    const stemText = before + " " + words.slice(0, -n).join(" ");
    const allInStem = suffixWords.every((tok) => {
      const esc = tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp("(?:^|\\s)" + esc + "(?:\\s|$)").test(stemText);
    });
    if (allInStem) {
      const newTail = words.slice(0, -n).join(" ").trim();
      return [(newTail ? `${before}: ${newTail}` : before).trim(), suffixWords];
    }
  }
  return [text, []];
}

function removeTrailingTokenRepeat(text: string): string {
  return removeTrailingTokenRepeatFull(text)[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Find math tokens present in the English trailing artifact but absent from
// the Urdu text — so DualMediumQuestion can supplement the Urdu display.
// ─────────────────────────────────────────────────────────────────────────────
export function getEnglishOnlyTokens(englishRaw: string, urduRaw: string): string[] {
  const [, removed] = removeTrailingTokenRepeatFull(englishRaw);
  if (removed.length === 0) return [];
  return removed.filter((tok) => {
    const esc = tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return !new RegExp("(?:^|\\s)" + esc + "(?:\\s|$)").test(urduRaw);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Post-"then" condition-duplicate removal
// PDF 2-column interleave embeds if-clause conditions BETWEEN "then" and the
// actual result: "if COND1 and COND2 then COND2 COND1 RESULT" → "...then RESULT"
// Only removes leading tokens after "then" that already appear in the if-clause.
// Stops as soon as a token is NOT in the if-clause (= the real result starts).
// Guard: if the first kept token is a conjunction the removal is aborted (safe).
// ─────────────────────────────────────────────────────────────────────────────
function removePostThenDuplicates(text: string): string {
  const thenMatch = /\bthen\s+/i.exec(text);
  if (!thenMatch) return text;
  const beforeThen = text.slice(0, thenMatch.index);
  if (!/\bif\b/i.test(beforeThen)) return text;
  const ifClause = text.slice(0, thenMatch.index + thenMatch[0].length);
  const afterThen = text.slice(ifClause.length).trim();
  if (!afterThen) return text;
  const tokens = afterThen.split(/\s+/);
  let skip = 0;
  while (skip < tokens.length) {
    const tok = tokens[skip];
    // Only remove tokens that look like mathematical conditions: must contain a
    // comparison operator AND be ≥ 3 chars. This prevents removing plain words,
    // single letters, function names like f(x), or non-comparative expressions.
    if (tok.length < 3 || !/[<>≤≥=≠]/.test(tok)) break;
    const esc = tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp("(?:^|\\s)" + esc + "(?:\\s|$)").test(beforeThen)) {
      skip++;
    } else {
      break;
    }
  }
  if (skip === 0) return text;
  const resultStart = (tokens[skip] ?? "").toLowerCase();
  if (["and", "or", "but", "if", "then", "that", "which"].includes(resultStart)) return text;
  return (ifClause + tokens.slice(skip).join(" ")).trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Trailing-period-values removal
// Handles PDF column-interleave: values from the Urdu column that appear after
// the final period, e.g. "Insert rational numbers between 2 and 3. 3 2"
// Only removes the trailer when ALL of its tokens already appear in the stem.
// ─────────────────────────────────────────────────────────────────────────────
function removeTrailingPeriodValues(text: string): string {
  const dotIdx = text.lastIndexOf(". ");
  if (dotIdx < 10) return text;
  const stem = text.slice(0, dotIdx);
  const trail = text.slice(dotIdx + 2).trim();
  if (!trail || trail.length > 20) return text;
  const tokens = trail.split(/\s+/);
  if (tokens.length > 5 || tokens.some((t) => t.length > 8)) return text;
  const allInStem = tokens.every((tok) => {
    const esc = tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("(?:^|\\s)" + esc + "(?:\\s|$)").test(stem);
  });
  return allInStem ? stem.trim() : text;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main preprocessor
// ─────────────────────────────────────────────────────────────────────────────
export function preprocessMathText(raw: string): string {
  let text = raw;
  for (const [re, rep] of FIXES) {
    text = text.replace(re, rep as string);
  }
  text = deduplicateAdjacent(text);
  text = removePostThenDuplicates(text);
  text = removeTrailingRepeat(text);
  text = removeTrailingTokenRepeat(text);
  text = removeTrailingPeriodValues(text);
  // After dedup, "1 1 Name…" becomes "1 Name…" — strip the residual leading digit
  text = text.replace(/^\d+\s+(?=[A-Z])/, "");
  return text.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// LaTeX segment parser  ($inline$  and  $$block$$)
// ─────────────────────────────────────────────────────────────────────────────
type Segment =
  | { type: "text"; content: string }
  | { type: "inline"; content: string }
  | { type: "block"; content: string };

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  const pattern = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: "block", content: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ type: "inline", content: match[2] });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: "text", content: text }];
}

let _katex: typeof import("katex").default | null = null;
let _katexCssLoaded = false;

async function renderLatex(latex: string, displayMode: boolean): Promise<string> {
  try {
    if (!_katex) {
      _katex = (await import("katex")).default;
    }
    if (!_katexCssLoaded) {
      await import("katex/dist/katex.min.css");
      _katexCssLoaded = true;
    }
    return _katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false,
      output: "html",
    });
  } catch {
    return latex;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// React component
// ─────────────────────────────────────────────────────────────────────────────

type MathTextProps = {
  text: string;
  className?: string;
};

/**
 * Math-aware text renderer. Automatically fixes:
 *
 *  PDF artifacts   ⎛⎜⎝⎞⎟⎠ → ()   ⎧⎨⎫⎬ → {}   ⎪⎮ → |   │ → |   ⎯ → removed
 *  Private glyphs  - → removed
 *  Function char   ⨍ → f
 *  Degree          30o → 30°   45oC → 45°C   oF → °F   )o → )°
 *  Sci notation    ×105 → ×10⁵   10 −5 → 10⁻⁵
 *  Units           cm2 → cm²   m3 → m³
 *  Trig supers     sin2θ → sin²θ   cos2 → cos²
 *  Variable supers a2+b2 → a²+b²
 *  LaTeX inline    $x^2$ → rendered by KaTeX
 *  LaTeX block     $$\frac{1}{2}$$ → rendered by KaTeX
 */
// Urdu/Arabic Unicode ranges — used to auto-detect RTL text direction
const URDU_RE = /[؀-ۿﭐ-﷿ﹰ-﻿]/;

export default function MathText({ text, className }: MathTextProps) {
  const [rendered, setRendered] = useState<Record<string, string>>({});

  const { segments, hasMath, cleaned } = useMemo(() => {
    const cleaned = preprocessMathText(text || "");
    const segs = parseSegments(cleaned);
    const hasMath = segs.some((s) => s.type !== "text");
    return { segments: segs, hasMath, cleaned };
  }, [text]);

  // Auto-set dir="rtl" when Urdu/Arabic chars are present so the browser's
  // bidi algorithm correctly places the text right-to-left even when Latin
  // math expressions are mixed in.
  const dir = URDU_RE.test(cleaned) ? ("rtl" as const) : undefined;

  useEffect(() => {
    if (!hasMath) return;
    let cancelled = false;
    (async () => {
      const out: Record<string, string> = {};
      for (const seg of segments) {
        if (seg.type !== "text") {
          out[seg.content] = await renderLatex(seg.content, seg.type === "block");
        }
      }
      if (!cancelled) setRendered(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [hasMath, segments]);

  if (!hasMath) {
    return <span className={className} dir={dir}>{cleaned}</span>;
  }

  return (
    <span className={className} dir={dir}>
      {segments.map((seg, i) => {
        if (seg.type === "inline") {
          const html = rendered[seg.content];
          return (
            // dir="ltr" keeps KaTeX math left-to-right inside an RTL parent
            <span
              key={i}
              dir="ltr"
              dangerouslySetInnerHTML={{ __html: html ?? seg.content }}
            />
          );
        }
        if (seg.type === "block") {
          const html = rendered[seg.content];
          return (
            <span
              key={i}
              dir="ltr"
              className="block my-1"
              dangerouslySetInnerHTML={{ __html: html ?? seg.content }}
            />
          );
        }
        return <span key={i}>{seg.content}</span>;
      })}
    </span>
  );
}
