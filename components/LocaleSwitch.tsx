'use client'

import { useI18n } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

const locales: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' }
]

export default function LocaleSwitch() {
  const { locale, setLocale } = useI18n()

  return (
    <div className="flex gap-2 p-2 bg-gray-100 rounded-lg">
      {locales.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            locale === code
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          aria-label={`Switch to ${label}`}
        >
          <span className="mr-1">{flag}</span>
          {label}
        </button>
      ))}
    </div>
  )
}
