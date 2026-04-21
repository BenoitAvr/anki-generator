import { NextRequest } from 'next/server'
import { fetchWords } from '@/app/lib/frequency'
import { translateWords } from '@/app/lib/translate'
import { generateApkg } from '@/app/lib/anki'
import { LANGUAGES } from '@/app/lib/languages'

export const maxDuration = 300

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const lang = searchParams.get('lang')
  const targetLang = searchParams.get('targetLang') ?? 'fr'
  const from = parseInt(searchParams.get('from') ?? '1', 10)
  const to = parseInt(searchParams.get('to') ?? '100', 10)

  if (!lang) {
    return new Response(JSON.stringify({ error: 'Paramètre "lang" manquant' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (isNaN(from) || isNaN(to) || from < 1 || to < from || to - from > 999) {
    return new Response(
      JSON.stringify({ error: 'Plage invalide (max 1000 mots par génération)' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const sourceLangName = LANGUAGES[lang]?.name ?? lang
  const targetLangName = LANGUAGES[targetLang]?.name ?? targetLang

  try {
    const words = await fetchWords(lang, from, to)

    const translations = await translateWords(words, lang, targetLang)

    const cards = translations.map(({ word, translation }) => ({
      front: word,
      back: translation,
    }))

    const deckName = `${sourceLangName} → ${targetLangName} (${from}-${to})`
    const apkg = await generateApkg(cards, deckName)

    const filename = `${lang}-${targetLang}-${from}-${to}.apkg`

    return new Response(apkg.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(apkg.length),
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
