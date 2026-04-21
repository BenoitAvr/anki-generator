import { GeneratorForm } from '@/app/components/generator-form'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4 py-16">
      <main className="w-full max-w-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Générateur de decks Anki
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Crée un deck Anki à partir des mots les plus fréquents d&apos;une langue.
            Sélectionne une plage (ex&nbsp;: 400&nbsp;–&nbsp;600) pour obtenir les
            mots classés par fréquence d&apos;usage.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <GeneratorForm />
        </div>

        <p className="mt-6 text-xs text-center text-zinc-400 dark:text-zinc-600">
          Données de fréquence :{' '}
          <a
            href="https://github.com/hermitdave/FrequencyWords"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            FrequencyWords
          </a>{' '}
          · Traductions :{' '}
          <a
            href="https://www.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Claude (Anthropic)
          </a>
        </p>
      </main>
    </div>
  )
}
