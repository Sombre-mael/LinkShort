import { Check, Copy, ExternalLink } from 'lucide-react'
import type { ShortenResult } from '@/hooks/useUrlShortener'

type ResultPanelProps = {
  result: ShortenResult | null
  copied: boolean
  onCopy: () => void
}

export function ResultPanel({ result, copied, onCopy }: ResultPanelProps) {
  if (!result) {
    return (
      <section className="tool-panel muted-panel">
        <p className="eyebrow">Etape 2</p>
        <h2>Generez votre lien.</h2>
        <p>
          Apres generation, vous pourrez copier le lien et le QR sera pret a personnaliser.
        </p>
      </section>
    )
  }

  const label = result.mode === 'shorten' ? 'Lien raccourci' : 'Lien original'

  return (
    <section className="tool-panel result-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{label}</p>
          <h2>{result.mode === 'shorten' ? 'Pret a partager.' : 'QR code pret sans raccourcissement.'}</h2>
        </div>
        <Check className="panel-icon success" aria-hidden="true" />
      </div>

      <a className="result-link" href={result.outputUrl} target="_blank" rel="noreferrer">
        {result.outputUrl}
        <ExternalLink aria-hidden="true" />
      </a>

      <button className="secondary-action" type="button" onClick={onCopy}>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {copied ? 'Copie' : 'Copier'}
      </button>
    </section>
  )
}
