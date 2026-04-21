'use client'

import { useState, useTransition } from 'react'
import { LANGUAGES } from '@/app/lib/languages'

const LANG_ENTRIES = Object.entries(LANGUAGES).sort((a, b) =>
  a[1].name.localeCompare(b[1].name)
)

export function GeneratorForm() {
  const [lang, setLang] = useState('es')
  const [targetLang, setTargetLang] = useState('fr')
  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(100)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const rangeSize = to - from + 1

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (from < 1 || to < from) {
      setError('La plage est invalide.')
      return
    }
    if (rangeSize > 1000) {
      setError('Maximum 1000 mots par génération.')
      return
    }

    startTransition(async () => {
      try {
        const url = `/api/generate?lang=${lang}&targetLang=${targetLang}&from=${from}&to=${to}`
        const resp = await fetch(url)

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({ error: 'Erreur inconnue' }))
          setError(data.error ?? 'Erreur lors de la génération')
          return
        }

        const blob = await resp.blob()
        const objectUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = `${lang}-${targetLang}-${from}-${to}.apkg`
        a.click()
        URL.revokeObjectURL(objectUrl)
      } catch {
        setError('Impossible de contacter le serveur.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Langue source">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="input"
          >
            {LANG_ENTRIES.map(([code, { name, nativeName }]) => (
              <option key={code} value={code}>
                {name} — {nativeName}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Langue cible (traduction)">
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="input"
          >
            {LANG_ENTRIES.map(([code, { name, nativeName }]) => (
              <option key={code} value={code}>
                {name} — {nativeName}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Du mot n°">
          <input
            type="number"
            min={1}
            max={49999}
            value={from}
            onChange={(e) => setFrom(parseInt(e.target.value, 10))}
            className="input"
          />
        </Field>

        <Field label="Au mot n°">
          <input
            type="number"
            min={from + 1}
            max={50000}
            value={to}
            onChange={(e) => setTo(parseInt(e.target.value, 10))}
            className="input"
          />
        </Field>
      </div>

      {rangeSize > 0 && rangeSize <= 1000 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {rangeSize} mot{rangeSize > 1 ? 's' : ''} sélectionné{rangeSize > 1 ? 's' : ''}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || rangeSize < 1 || rangeSize > 1000}
        className="flex items-center justify-center gap-2 h-12 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold text-sm transition-opacity disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Spinner />
            Génération en cours…
          </>
        ) : (
          'Générer le deck Anki'
        )}
      </button>

      {isPending && (
        <p className="text-xs text-center text-zinc-400">
          Téléchargement de la liste, traduction et création du fichier .apkg… ({rangeSize} mots)
        </p>
      )}
    </form>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      {children}
    </label>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
