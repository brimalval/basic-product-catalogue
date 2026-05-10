import { Helmet } from 'react-helmet-async'
import { createElement } from 'react'

const SITE_NAME = 'Acme Corp'
const BASE_URL = 'https://acmecorp.example.com'
const DEFAULT_DESCRIPTION = 'Quality products curated for everyday life.'
const DEFAULT_IMAGE = `${BASE_URL}/og-default.png`

interface SeoOptions {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'product'
  path?: string
}

export function useSeo({ title, description, image, type = 'website', path = '' }: SeoOptions = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const desc = description ?? DEFAULT_DESCRIPTION
  const img = image ?? DEFAULT_IMAGE
  const url = `${BASE_URL}${path}`

  return createElement(
    Helmet,
    null,
    createElement('title', null, fullTitle),
    createElement('meta', { name: 'description', content: desc }),
    createElement('meta', { property: 'og:title', content: fullTitle }),
    createElement('meta', { property: 'og:description', content: desc }),
    createElement('meta', { property: 'og:image', content: img }),
    createElement('meta', { property: 'og:url', content: url }),
    createElement('meta', { property: 'og:type', content: type === 'product' ? 'product' : 'website' }),
    createElement('meta', { property: 'og:site_name', content: SITE_NAME }),
    createElement('meta', { name: 'twitter:card', content: 'summary_large_image' }),
    createElement('meta', { name: 'twitter:title', content: fullTitle }),
    createElement('meta', { name: 'twitter:description', content: desc }),
    createElement('meta', { name: 'twitter:image', content: img }),
  )
}
