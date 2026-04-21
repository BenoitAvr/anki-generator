const CHUNK_SIZE = 10

export async function translateWords(
  words: string[],
  sourceLang: string,
  targetLang: string
): Promise<{ word: string; translation: string }[]> {
  const results: { word: string; translation: string }[] = []

  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    const chunk = words.slice(i, i + CHUNK_SIZE)
    const translated = await translateChunk(chunk, sourceLang, targetLang)
    results.push(...translated)
    if (i + CHUNK_SIZE < words.length) {
      await new Promise((r) => setTimeout(r, 150))
    }
  }

  return results
}

async function translateChunk(
  words: string[],
  sourceLang: string,
  targetLang: string
): Promise<{ word: string; translation: string }[]> {
  const results = await Promise.all(
    words.map((word) => translateOne(word, sourceLang, targetLang))
  )
  return results
}

async function translateOne(
  word: string,
  sourceLang: string,
  targetLang: string
): Promise<{ word: string; translation: string }> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${sourceLang}|${targetLang}`

  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`MyMemory API error ${resp.status}`)

  const data = (await resp.json()) as {
    responseData?: { translatedText?: string }
    responseStatus?: number
  }

  if (data.responseStatus === 403) {
    throw new Error('Limite quotidienne MyMemory atteinte (5000 mots/jour gratuit)')
  }

  const translation = data.responseData?.translatedText?.trim() ?? word

  // MyMemory sometimes returns the word uppercased or unchanged when it can't translate
  const isUntranslated =
    translation.toLowerCase() === word.toLowerCase() ||
    translation === 'MYMEMORY WARNING'

  return {
    word,
    translation: isUntranslated ? word : translation,
  }
}
