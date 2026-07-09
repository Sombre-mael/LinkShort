import type { ShortenerProvider } from '@/types/link'

const normalizeUrl = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) {
    return trimmed
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  return `https://${trimmed}`
}

export const isValidUrl = (url: string) => {
  try {
    const candidate = new URL(normalizeUrl(url))
    return candidate.protocol === 'http:' || candidate.protocol === 'https:'
  } catch {
    return false
  }
}

export const prepareUrl = (url: string) => {
  const normalized = normalizeUrl(url)

  if (!normalized) {
    throw new Error('Veuillez entrer une URL.')
  }

  if (!isValidUrl(normalized)) {
    throw new Error('URL invalide. Verifiez votre saisie.')
  }

  return normalized
}

const shortenWithIsGd = async (url: string) => {
  const response = await fetch(
    `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`,
  )

  if (!response.ok) {
    throw new Error('Le service de raccourcissement est indisponible.')
  }

  const data = (await response.json()) as {
    shorturl?: string
    errormessage?: string
  }

  if (!data.shorturl) {
    throw new Error(data.errormessage || 'Impossible de raccourcir cette URL.')
  }

  return data.shorturl
}

export const shortenerProviders: ShortenerProvider[] = [
  {
    id: 'isgd',
    name: 'is.gd',
    shorten: shortenWithIsGd,
  },
]

export const getShortenerProvider = (id = 'isgd') => {
  return shortenerProviders.find((provider) => provider.id === id) ?? shortenerProviders[0]
}
