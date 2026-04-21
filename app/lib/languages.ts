export type LangCode = string

export interface Language {
  name: string
  nativeName: string
}

export const LANGUAGES: Record<string, Language> = {
  af: { name: 'Afrikaans', nativeName: 'Afrikaans' },
  ar: { name: 'Arabic', nativeName: 'العربية' },
  bg: { name: 'Bulgarian', nativeName: 'Български' },
  cs: { name: 'Czech', nativeName: 'Čeština' },
  da: { name: 'Danish', nativeName: 'Dansk' },
  de: { name: 'German', nativeName: 'Deutsch' },
  el: { name: 'Greek', nativeName: 'Ελληνικά' },
  en: { name: 'English', nativeName: 'English' },
  es: { name: 'Spanish', nativeName: 'Español' },
  et: { name: 'Estonian', nativeName: 'Eesti' },
  fa: { name: 'Persian', nativeName: 'فارسی' },
  fi: { name: 'Finnish', nativeName: 'Suomi' },
  fr: { name: 'French', nativeName: 'Français' },
  he: { name: 'Hebrew', nativeName: 'עברית' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  hr: { name: 'Croatian', nativeName: 'Hrvatski' },
  hu: { name: 'Hungarian', nativeName: 'Magyar' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  it: { name: 'Italian', nativeName: 'Italiano' },
  ja: { name: 'Japanese', nativeName: '日本語' },
  ko: { name: 'Korean', nativeName: '한국어' },
  lt: { name: 'Lithuanian', nativeName: 'Lietuvių' },
  lv: { name: 'Latvian', nativeName: 'Latviešu' },
  ms: { name: 'Malay', nativeName: 'Bahasa Melayu' },
  nl: { name: 'Dutch', nativeName: 'Nederlands' },
  no: { name: 'Norwegian', nativeName: 'Norsk' },
  pl: { name: 'Polish', nativeName: 'Polski' },
  pt: { name: 'Portuguese', nativeName: 'Português' },
  ro: { name: 'Romanian', nativeName: 'Română' },
  ru: { name: 'Russian', nativeName: 'Русский' },
  sk: { name: 'Slovak', nativeName: 'Slovenčina' },
  sl: { name: 'Slovenian', nativeName: 'Slovenščina' },
  sq: { name: 'Albanian', nativeName: 'Shqip' },
  sr: { name: 'Serbian', nativeName: 'Српски' },
  sv: { name: 'Swedish', nativeName: 'Svenska' },
  th: { name: 'Thai', nativeName: 'ภาษาไทย' },
  tr: { name: 'Turkish', nativeName: 'Türkçe' },
  uk: { name: 'Ukrainian', nativeName: 'Українська' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  zh: { name: 'Chinese', nativeName: '中文' },
}
