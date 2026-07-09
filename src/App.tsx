import { useMemo, useState } from 'react'
import { Link2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { HistoryPanel } from '@/components/HistoryPanel'
import { QrStudio } from '@/components/QrStudio'
import { ResultPanel } from '@/components/ResultPanel'
import { UrlShortener } from '@/components/UrlShortener'
import { useLinkHistory } from '@/hooks/useLinkHistory'
import { useQrCustomization } from '@/hooks/useQrCustomization'
import { type ShortenMode, useUrlShortener } from '@/hooks/useUrlShortener'
import type { ShortenedLink } from '@/types/link'
import './App.css'

const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    throw new Error('Le presse-papiers nest pas disponible dans ce navigateur.')
  }

  await navigator.clipboard.writeText(text)
}

function App() {
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState<ShortenMode>('shorten')
  const [copied, setCopied] = useState(false)
  const {
    qrOptions,
    updateQrOptions,
    resetQrOptions,
    warnings,
  } = useQrCustomization()
  const {
    result,
    error,
    isLoading,
    submitUrl,
    resetResult,
    setManualResult,
  } = useUrlShortener()
  const {
    history,
    addHistoryItem,
    removeHistoryItem,
    toggleFavorite,
    clearHistory,
  } = useLinkHistory()

  const qrValue = useMemo(() => result?.outputUrl ?? '', [result])
  const currentStep = result ? 3 : url.trim() ? 2 : 1

  const handleSubmit = async () => {
    try {
      const nextResult = await submitUrl(url, mode)
      addHistoryItem(nextResult.originalUrl, nextResult.outputUrl, qrOptions)
      toast.success(mode === 'shorten' ? 'Lien raccourci avec succes.' : 'QR code genere.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue.'
      toast.error(message)
    }
  }

  const handleResetInput = () => {
    setUrl('')
    setCopied(false)
    resetResult()
  }

  const handleCopy = async (text?: string) => {
    const value = text ?? result?.outputUrl

    if (!value) {
      return
    }

    try {
      await copyToClipboard(value)
      setCopied(true)
      toast.success('Lien copie.')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Impossible de copier ce lien.')
    }
  }

  const handleSelectHistory = (item: ShortenedLink) => {
    setUrl(item.originalUrl)
    setMode(item.originalUrl === item.shortUrl ? 'qr-only' : 'shorten')
    updateQrOptions(item.qrOptions)
    setManualResult({
      originalUrl: item.originalUrl,
      outputUrl: item.shortUrl,
      mode: item.originalUrl === item.shortUrl ? 'qr-only' : 'shorten',
    })
    toast.success('Lien repris depuis lhistorique.')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">
          <Link2 />
        </div>
        <div>
          <p className="eyebrow">Sans compte, sans base de donnees</p>
          <h1>LinkShort</h1>
        </div>
        <div className="header-badge">
          <Sparkles aria-hidden="true" />
          Public et rapide
        </div>
      </header>

      <main>
        <section className="intro">
          <p>Raccourcissez un lien, creez un QR code personnalise et exportez-le proprement pour le web ou l'impression legere.</p>
        </section>

        <section className="workflow-steps" aria-label="Progression">
          {[
            ['1', 'Coller le lien', 'Ajoutez une URL complete ou un domaine.'],
            ['2', 'Generer', 'Choisissez lien court ou QR seulement.'],
            ['3', 'Personnaliser', 'Ajustez le QR puis exportez.'],
          ].map(([number, title, description], index) => (
            <div className={currentStep >= index + 1 ? 'workflow-step is-active' : 'workflow-step'} key={number}>
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <small>{description}</small>
              </div>
            </div>
          ))}
        </section>

        <div className="workspace-grid">
          <div className="left-stack">
            <UrlShortener
              url={url}
              mode={mode}
              error={error}
              isLoading={isLoading}
              onUrlChange={setUrl}
              onModeChange={setMode}
              onSubmit={handleSubmit}
              onReset={handleResetInput}
            />
            <ResultPanel result={result} copied={copied} onCopy={() => handleCopy()} />
          </div>

          <QrStudio
            value={qrValue}
            options={qrOptions}
            warnings={warnings}
            onChange={updateQrOptions}
            onReset={resetQrOptions}
          />
        </div>

        <HistoryPanel
          history={history}
          onSelect={handleSelectHistory}
          onCopy={handleCopy}
          onFavorite={toggleFavorite}
          onRemove={removeHistoryItem}
          onClear={clearHistory}
        />
      </main>
    </div>
  )
}

export default App
