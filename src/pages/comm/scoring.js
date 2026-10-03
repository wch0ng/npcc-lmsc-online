// The only correct response is instruction 2: name + squad in the top-right corner.
// Everything else on the sheet (or ticked off) means the receiver acted before reading.
export function scoreCommTest({ strokes, texts, ticks, bandBottom, sawEndAt, firstActionAt, elapsed, timedOut }) {
  const trStrokes = strokes.filter((s) => { const [x, y] = strokeCentre(s); return inTopRight(x, y, bandBottom) })
  const trTexts = texts.filter((t) => inTopRight(t.x, t.y, bandBottom))
  const extraStrokes = strokes.length - trStrokes.length
  const extraTexts = texts.length - trTexts.length
  const extraTicks = ticks.filter((n) => n >= 3 && n <= 19).sort((a, b) => a - b)

  const words = trTexts.map((t) => t.value).join(' ').trim().split(/\s+/).filter(Boolean)
  const nameDone = trTexts.length > 0 || trStrokes.length >= 3
  // Name *and* squad: two typed entries / two+ words, or plenty of handwriting.
  const nameAndSquad = trTexts.length >= 2 || words.length >= 2 || trStrokes.length >= 6

  const readFirst = sawEndAt != null && (firstActionAt == null || sawEndAt <= firstActionAt)
  const followedOnly2 = extraStrokes === 0 && extraTexts === 0 && extraTicks.length === 0

  return {
    passed: followedOnly2 && nameDone && !timedOut,
    nameDone,
    nameAndSquad,
    readFirst,
    sawEnd: sawEndAt != null,
    followedOnly2,
    extraStrokes,
    extraTexts,
    extraTicks,
    elapsed,
    timedOut,
  }
}

// Where on the sheet a mark sits, using the measured band height.
function inTopRight(x, y, bandBottom) { return x > 0.5 && y < bandBottom + 0.03 }
function strokeCentre(s) {
  const xs = s.map((p) => p[0]); const ys = s.map((p) => p[1])
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2]
}
