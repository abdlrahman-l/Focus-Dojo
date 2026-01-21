export function splitIntoSentences(text: string): string[] {
  // Split by punctuation (. ! ?) but keep the punctuation attached.
  // This regex matches non-punctuation characters followed by punctuation and optional quote.
  const regex = /[^.!?]+[.!?]+["']?|[^.!?]+$/g
  const matches = text.match(regex)
  return matches
    ? matches.map((s) => s.trim()).filter((s) => s.length > 0)
    : [text]
}

export function calculateWPM(
  wordCount: number,
  startTime: number,
  endTime: number
): number {
  const minutes = (endTime - startTime) / 60000
  return minutes > 0 ? Math.round(wordCount / minutes) : 0
}
