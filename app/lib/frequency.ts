const BASE_URL =
  'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018'

function isValidWord(word: string): boolean {
  if (word.startsWith("'")) return false
  if (!/[a-zA-ZÀ-ÿа-яА-ЯёЁ一-鿿぀-ヿ가-힯]/.test(word)) return false
  return true
}

export async function fetchWords(
  lang: string,
  from: number,
  to: number
): Promise<string[]> {
  const url = `${BASE_URL}/${lang}/${lang}_50k.txt`
  const resp = await fetch(url)

  if (!resp.ok) {
    throw new Error(
      `Impossible de télécharger la liste de fréquence pour "${lang}" (HTTP ${resp.status})`
    )
  }

  const text = await resp.text()
  const words = text
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(' ')[0].trim())
    .filter(isValidWord)

  const count = to - from + 1
  if (from < 1 || to > words.length) {
    throw new Error(
      `Plage invalide : la liste contient ${words.length} mots valides (reçu ${from}-${to})`
    )
  }

  return words.slice(from - 1, from - 1 + count)
}
