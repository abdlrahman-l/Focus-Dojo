export function calculateWordMatchScore(target: string, input: string): number {
  if (!target || !input) return 0

  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, ' ')
      .trim()

  const targetWords = normalize(target).split(' ')
  const inputWords = normalize(input).split(' ')

  let matchCount = 0
  const inputWordSet = new Set(inputWords)

  targetWords.forEach((word) => {
    if (inputWordSet.has(word)) {
      matchCount++
    }
  })

  // Calculate percentage
  const score = Math.round((matchCount / targetWords.length) * 100)
  
  // Cap at 100
  return Math.min(score, 100)
}
