import { useEffect, useRef } from 'react'
import { Download, ImagePlus, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { backgroundColors, foregroundColors, qrPresets } from '@/data/qrPresets'
import type { LogoFrameShape, QrExportSize, QrLevel, QrOptions, QrStyleMode } from '@/types/link'
import { applyQrSvgEnhancements, downloadPng, downloadSvg } from '@/utils/qrSvg'

type QrStudioProps = {
  value: string
  options: QrOptions
  warnings: string[]
  onChange: (options: Partial<QrOptions>) => void
  onReset: () => void
}

const qrLevels: QrLevel[] = ['L', 'M', 'Q', 'H']
const styleModes: Array<{ id: QrStyleMode; label: string }> = [
  { id: 'classic', label: 'Carres' },
  { id: 'rounded', label: 'Arrondi' },
  { id: 'dots', label: 'Points' },
  { id: 'soft', label: 'Doux' },
]
const exportSizes: QrExportSize[] = [512, 1024, 2048]
const logoFrameShapes: Array<{ id: LogoFrameShape; label: string }> = [
  { id: 'rounded', label: 'Arrondi' },
  { id: 'circle', label: 'Cercle' },
  { id: 'pill', label: 'Pilule' },
]

const readLogoFile = (file: File, onChange: (src: string) => void) => {
  if (!file.type.startsWith('image/')) {
    toast.error('Choisissez une image pour le logo.')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      onChange(reader.result)
      toast.success('Logo ajoute au QR code.')
    }
  }
  reader.onerror = () => toast.error('Impossible de lire cette image.')
  reader.readAsDataURL(file)
}

export function QrStudio({ value, options, warnings, onChange, onReset }: QrStudioProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const hasLogo = Boolean(options.logoSrc && options.showLogo)

  useEffect(() => {
    applyQrSvgEnhancements(svgRef.current, options)
  }, [options, value])

  const handleDownloadPng = () => {
    if (!svgRef.current || !value) {
      toast.error('Generez un QR code avant de telecharger.')
      return
    }

    downloadPng(svgRef.current, options)
    toast.success(`PNG ${options.exportSize}px prepare.`)
  }

  const handleDownloadSvg = () => {
    if (!svgRef.current || !value) {
      toast.error('Generez un QR code avant de telecharger.')
      return
    }

    downloadSvg(svgRef.current, options)
    toast.success('SVG prepare.')
  }

  const handleAutoFitLogo = () => {
    onChange({
      level: 'H',
      marginSize: Math.max(options.marginSize, 4),
      logoSize: 20,
      logoPadding: 9,
      logoFrameShape: 'rounded',
      logoBackground: '#ffffff',
      logoBorderColor: '#e2e8f0',
      logoShadow: true,
      logoFit: 'contain',
      showLogo: Boolean(options.logoSrc),
    })
    toast.success('Logo adapte pour un rendu plus propre.')
  }

  return (
    <section className="qr-studio">
      <div className="studio-preview">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Etape 3</p>
            <h2>Personnalisez et exportez.</h2>
          </div>
          <ShieldCheck className="panel-icon" aria-hidden="true" />
        </div>

        <div className="preview-card">
          <div className="qr-frame" style={{ backgroundColor: options.transparentBackground ? '#f8fafc' : options.background }}>
            {value ? (
              <QRCodeSVG
                ref={svgRef}
                value={value}
                size={options.size}
                bgColor={options.transparentBackground ? 'transparent' : options.background}
                fgColor={options.useGradient ? options.gradientFrom : options.foreground}
                level={options.level}
                marginSize={options.marginSize}
                title="QR code LinkShort"
                imageSettings={hasLogo ? {
                  src: options.logoSrc,
                  height: options.size * (options.logoSize / 100),
                  width: options.size * (options.logoSize / 100),
                  excavate: true,
                } : undefined}
              />
            ) : (
              <div className="qr-placeholder">
                <Sparkles aria-hidden="true" />
                <span>Collez un lien pour commencer.</span>
              </div>
            )}
          </div>
        </div>

        <div className="mobile-action-bar" aria-label="Actions rapides QR">
          <button className="secondary-action" type="button" onClick={handleDownloadPng} disabled={!value}>
            <Download aria-hidden="true" />
            PNG
          </button>
          <button className="secondary-action" type="button" onClick={handleDownloadSvg} disabled={!value}>
            <Download aria-hidden="true" />
            SVG
          </button>
        </div>

        {warnings.length ? (
          <div className="warning-box">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        ) : (
          <p className="success-note">Lisibilite correcte pour un usage web courant.</p>
        )}
      </div>

      <div className="studio-controls">
        <details className="control-section" open>
          <summary>Presets</summary>
          <div className="control-heading">
            <span>Depart rapide</span>
            <button type="button" onClick={onReset}>
              <RotateCcw aria-hidden="true" />
              Reinitialiser
            </button>
          </div>
          <div className="preset-grid">
            {qrPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                title={preset.description}
                onClick={() => onChange(preset.options)}
              >
                {preset.name}
                <small>{preset.description}</small>
              </button>
            ))}
          </div>
        </details>

        <details className="control-section" open>
          <summary>Couleurs</summary>
          <div className="control-grid">
          <div className="control-group">
            <label>Couleur QR</label>
            <div className="swatch-row">
              {foregroundColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={options.foreground === color ? 'is-selected' : ''}
                  style={{ backgroundColor: color }}
                  onClick={() => onChange({ foreground: color, useGradient: false })}
                  title={color}
                />
              ))}
              <input
                type="color"
                value={options.foreground}
                onChange={(event) => onChange({ foreground: event.target.value, useGradient: false })}
                title="Couleur personnalisee"
              />
            </div>
          </div>

          <div className="control-group">
            <label>Fond</label>
            <div className="swatch-row">
              {backgroundColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={options.background === color && !options.transparentBackground ? 'is-selected' : ''}
                  style={{ backgroundColor: color }}
                  onClick={() => onChange({ background: color, transparentBackground: false })}
                  title={color}
                />
              ))}
              <input
                type="color"
                value={options.background}
                onChange={(event) => onChange({ background: event.target.value, transparentBackground: false })}
                title="Fond personnalise"
              />
            </div>
            <label className="check-row" title="Utile surtout pour export SVG ou PNG web.">
              <input
                type="checkbox"
                checked={options.transparentBackground}
                onChange={(event) => onChange({ transparentBackground: event.target.checked })}
              />
              Fond transparent
            </label>
          </div>
          </div>

          <div className="control-group">
          <label className="check-row" title="Ajoute un degrade vectoriel sur le QR.">
            <input
              type="checkbox"
              checked={options.useGradient}
              onChange={(event) => onChange({ useGradient: event.target.checked })}
            />
            Activer le degrade
          </label>
          <div className="double-controls">
            <input
              type="color"
              value={options.gradientFrom}
              onChange={(event) => onChange({ gradientFrom: event.target.value, useGradient: true })}
              title="Debut du degrade"
            />
            <input
              type="color"
              value={options.gradientTo}
              onChange={(event) => onChange({ gradientTo: event.target.value, useGradient: true })}
              title="Fin du degrade"
            />
          </div>
          </div>
        </details>

        <details className="control-section">
          <summary>Style</summary>
          <div className="control-grid">
          <div className="control-group">
            <label>Forme</label>
            <div className="segmented">
              {styleModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={options.styleMode === mode.id ? 'is-active' : ''}
                  onClick={() => onChange({ styleMode: mode.id })}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Coins</label>
            <div className="segmented">
              {(['classic', 'rounded', 'accent'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  className={options.cornerStyle === style ? 'is-active' : ''}
                  onClick={() => onChange({ cornerStyle: style })}
                >
                  {style === 'classic' ? 'Simple' : style === 'rounded' ? 'Rond' : 'Accent'}
                </button>
              ))}
            </div>
            <input
              className="wide-color"
              type="color"
              value={options.cornerColor}
              onChange={(event) => onChange({ cornerColor: event.target.value })}
              title="Couleur des coins"
            />
          </div>
          </div>

          <div className="control-grid">
          <div className="control-group">
            <label>Taille aperçu: {options.size}px</label>
            <input
              type="range"
              min="180"
              max="360"
              step="10"
              value={options.size}
              onChange={(event) => onChange({ size: Number(event.target.value) })}
            />
          </div>

          <div className="control-group">
            <label>Marge: {options.marginSize} modules</label>
            <input
              type="range"
              min="0"
              max="8"
              step="1"
              value={options.marginSize}
              onChange={(event) => onChange({ marginSize: Number(event.target.value) })}
            />
          </div>
          </div>
        </details>

        <details className="control-section" open>
          <summary>Logo</summary>
          <div className="logo-designer">
            <div className="logo-preview">
              {options.logoSrc ? (
                <img src={options.logoSrc} alt="Aperçu du logo" />
              ) : (
                <ImagePlus aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="microcopy">
                Le logo est integre comme badge propre au centre du QR. Gardez une taille de 18-22% pour un scan fiable.
              </p>
              <div className="logo-row">
                <label className="file-button">
                  <ImagePlus aria-hidden="true" />
                  Importer
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        readLogoFile(file, (src) => onChange({ logoSrc: src, showLogo: true, level: 'H', logoSize: 20, marginSize: 4 }))
                      }
                      event.target.value = ''
                    }}
                  />
                </label>
                <button className="secondary-action" type="button" onClick={handleAutoFitLogo} disabled={!options.logoSrc}>
                  Adapter automatiquement
                </button>
              </div>
            </div>
          </div>

          <div className="control-grid">
            <div className="control-group">
              <label>Forme du badge</label>
              <div className="segmented">
                {logoFrameShapes.map((shape) => (
                  <button
                    key={shape.id}
                    type="button"
                    className={options.logoFrameShape === shape.id ? 'is-active' : ''}
                    onClick={() => onChange({ logoFrameShape: shape.id })}
                    disabled={!options.logoSrc}
                  >
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <label>Remplissage: {options.logoPadding}</label>
              <input
                type="range"
                min="4"
                max="16"
                step="1"
                value={options.logoPadding}
                disabled={!options.logoSrc}
                onChange={(event) => onChange({ logoPadding: Number(event.target.value) })}
              />
            </div>
          </div>

          <div className="control-grid">
            <div className="control-group">
              <label>Fond du badge</label>
              <input
                className="wide-color"
                type="color"
                value={options.logoBackground}
                disabled={!options.logoSrc}
                onChange={(event) => onChange({ logoBackground: event.target.value })}
              />
            </div>
            <div className="control-group">
              <label>Bordure du badge</label>
              <input
                className="wide-color"
                type="color"
                value={options.logoBorderColor}
                disabled={!options.logoSrc}
                onChange={(event) => onChange({ logoBorderColor: event.target.value })}
              />
            </div>
          </div>

          <div className="control-grid">
            <div className="control-group">
              <label>Taille logo: {options.logoSize}%</label>
              <input
                type="range"
                min="12"
                max="28"
                step="1"
                value={options.logoSize}
                disabled={!options.logoSrc}
                onChange={(event) => onChange({ logoSize: Number(event.target.value), level: 'H' })}
              />
            </div>
            <div className="control-group stacked-checks">
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={options.showLogo}
                  disabled={!options.logoSrc}
                  onChange={(event) => onChange({ showLogo: event.target.checked, level: event.target.checked ? 'H' : options.level })}
                />
                Afficher le logo
              </label>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={options.logoShadow}
                  disabled={!options.logoSrc}
                  onChange={(event) => onChange({ logoShadow: event.target.checked })}
                />
                Ombre douce
              </label>
            </div>
          </div>

          <div className="segmented fit-control">
            {(['contain', 'cover'] as const).map((fit) => (
              <button
                key={fit}
                type="button"
                className={options.logoFit === fit ? 'is-active' : ''}
                disabled={!options.logoSrc}
                onClick={() => onChange({ logoFit: fit })}
              >
                {fit === 'contain' ? 'Logo entier' : 'Remplir badge'}
              </button>
            ))}
          </div>

          <button className="secondary-action remove-logo" type="button" onClick={() => onChange({ logoSrc: '', showLogo: false })} disabled={!options.logoSrc}>
            Retirer le logo
          </button>
        </details>

        <details className="control-section">
          <summary>Export</summary>
          <div className="control-grid">
          <div className="control-group">
            <label>Correction</label>
            <div className="segmented">
              {qrLevels.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={options.level === level ? 'is-active' : ''}
                  onClick={() => onChange({ level })}
                  title="Plus le niveau est haut, plus le QR tolere un logo ou une degradation."
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Export</label>
            <div className="segmented">
              {exportSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={options.exportSize === size ? 'is-active' : ''}
                  onClick={() => onChange({ exportSize: size })}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          </div>
          <p className="microcopy">Pour une affiche ou un support imprime, choisissez 2048 px puis testez le scan avant publication.</p>
        </details>
      </div>
    </section>
  )
}
