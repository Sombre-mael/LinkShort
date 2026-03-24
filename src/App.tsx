import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { 
  Link2, 
  Copy, 
  Check, 
  Scissors, 
  RefreshCw, 
  Download,
  Palette,
  Settings2,
  Sparkles,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import './App.css'

// Utility for tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL Validation
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// URL Shortening Service using is.gd API (free, no auth required)
const shortenUrl = async (url: string): Promise<string> => {
  const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`)
  const data = await response.json()
  if (data.shorturl) {
    return data.shorturl
  }
  throw new Error(data.errormessage || 'Failed to shorten URL')
}

// QR Code Color Options
const QR_COLOR_OPTIONS = [
  { name: 'Noir', value: '#000000' },
  { name: 'Bleu', value: '#2563eb' },
  { name: 'Vert', value: '#16a34a' },
  { name: 'Rouge', value: '#dc2626' },
  { name: 'Violet', value: '#9333ea' },
  { name: 'Rose', value: '#db2777' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Turquoise', value: '#0891b2' },
]

const BG_COLOR_OPTIONS = [
  { name: 'Blanc', value: '#ffffff' },
  { name: 'Gris clair', value: '#f3f4f6' },
  { name: 'Bleu clair', value: '#dbeafe' },
  { name: 'Vert clair', value: '#dcfce7' },
  { name: 'Rose clair', value: '#fce7f3' },
  { name: 'Jaune clair', value: '#fef9c3' },
]

function App() {
  // State
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  
  // QR Code Customization State
  const [qrColor, setQrColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [qrSize, setQrSize] = useState(200)
  const [includeMargin, setIncludeMargin] = useState(true)
  const [showCustomization, setShowCustomization] = useState(false)
  const [qrLevel, setQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')

  // Handle URL shortening
  const handleShorten = async () => {
    setError('')
    setShortenedUrl('')
    
    if (!url.trim()) {
      setError('Veuillez entrer une URL')
      toast.error('Veuillez entrer une URL')
      return
    }
    
    // Add https:// if not present
    let processedUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = `https://${url}`
    }
    
    if (!isValidUrl(processedUrl)) {
      setError('URL invalide. Veuillez vérifier votre saisie.')
      toast.error('URL invalide')
      return
    }
    
    setIsLoading(true)
    try {
      const shortUrl = await shortenUrl(processedUrl)
      setShortenedUrl(shortUrl)
      toast.success('URL raccourcie avec succès !')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors du raccourcissement'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!shortenedUrl) return
    
    try {
      await navigator.clipboard.writeText(shortenedUrl)
      setCopied(true)
      toast.success('URL copiée dans le presse-papiers !')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Erreur lors de la copie')
    }
  }

  // Handle QR Code download
  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code') as SVGSVGElement | null
    if (!svg) return
    
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = qrSize
      canvas.height = qrSize
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `qrcode-${Date.now()}.png`
      downloadLink.href = pngFile
      downloadLink.click()
      toast.success('QR Code téléchargé !')
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  // Reset form
  const handleReset = () => {
    setUrl('')
    setShortenedUrl('')
    setError('')
    setCopied(false)
  }

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleShorten()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LinkShortener Pro
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Raccourcissez vos liens en un clic
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4" />
            <span>Gratuit & Illimité</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4">
              Raccourcisseur d'URL
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                + QR Code Personnalisé
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Transformez vos longues URLs en liens courts et élégants. 
              Générez des QR codes personnalisés pour un partage facile.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - URL Input */}
            <div className="space-y-6">
              {/* Input Card */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Entrez votre URL
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="https://example.com/votre-lien-tres-long..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pr-12 h-14 text-lg border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                    />
                    {url && (
                      <button
                        onClick={handleReset}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleShorten}
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Scissors className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? 'Raccourcissement...' : 'Raccourcir le lien'}
                  </Button>
                </CardContent>
              </Card>

              {/* Result Card */}
              {shortenedUrl && (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm border-2 border-green-200 dark:border-green-800">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl text-green-800 dark:text-green-200">
                      <Check className="w-5 h-5" />
                      Lien raccourci
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-green-200 dark:border-green-800">
                      <a 
                        href={shortenedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-semibold text-lg hover:underline break-all"
                      >
                        {shortenedUrl}
                      </a>
                    </div>
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className={cn(
                        "w-full h-12 text-base font-medium rounded-xl border-2 transition-all",
                        copied 
                          ? "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-300" 
                          : "border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400"
                      )}
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Copié !
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 mr-2" />
                          Copier le lien
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - QR Code */}
            <div className="space-y-6">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Palette className="w-5 h-5 text-purple-600" />
                      QR Code
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCustomization(!showCustomization)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <Settings2 className="w-4 h-4 mr-1" />
                      {showCustomization ? 'Masquer' : 'Personnaliser'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* QR Code Display */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="p-6 rounded-2xl transition-all"
                      style={{ backgroundColor: bgColor }}
                    >
                      {shortenedUrl ? (
                        <QRCodeSVG
                          id="qr-code"
                          value={shortenedUrl}
                          size={qrSize}
                          fgColor={qrColor}
                          bgColor={bgColor}
                          level={qrLevel}
                          includeMargin={includeMargin}
                          className="rounded-lg"
                        />
                      ) : (
                        <div 
                          className="flex flex-col items-center justify-center text-slate-400"
                          style={{ width: qrSize, height: qrSize }}
                        >
                          <Link2 className="w-16 h-16 mb-2 opacity-30" />
                          <p className="text-sm text-center">Raccourcissez un lien<br/>pour générer le QR Code</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customization Panel */}
                  {showCustomization && (
                    <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      {/* QR Color */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Couleur du QR Code</Label>
                        <div className="flex flex-wrap gap-2">
                          {QR_COLOR_OPTIONS.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setQrColor(color.value)}
                              className={cn(
                                "w-8 h-8 rounded-full border-2 transition-all",
                                qrColor === color.value 
                                  ? "border-slate-800 dark:border-white scale-110" 
                                  : "border-transparent hover:scale-105"
                              )}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Background Color */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Couleur de fond</Label>
                        <div className="flex flex-wrap gap-2">
                          {BG_COLOR_OPTIONS.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setBgColor(color.value)}
                              className={cn(
                                "w-8 h-8 rounded-full border-2 transition-all",
                                bgColor === color.value 
                                  ? "border-slate-800 dark:border-white scale-110" 
                                  : "border-slate-300 hover:scale-105"
                              )}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Size Slider */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label className="text-sm font-medium">Taille</Label>
                          <span className="text-sm text-slate-500">{qrSize}px</span>
                        </div>
                        <Slider
                          value={[qrSize]}
                          onValueChange={(value) => setQrSize(value[0])}
                          min={150}
                          max={350}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      {/* Error Correction Level */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Niveau de correction</Label>
                        <div className="flex gap-2">
                          {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                            <button
                              key={level}
                              onClick={() => setQrLevel(level)}
                              className={cn(
                                "px-3 py-1 text-sm rounded-lg border-2 transition-all",
                                qrLevel === level
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300"
                              )}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Margin Toggle */}
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Marge autour du QR</Label>
                        <Switch
                          checked={includeMargin}
                          onCheckedChange={setIncludeMargin}
                        />
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  <Button
                    onClick={handleDownloadQR}
                    disabled={!shortenedUrl}
                    variant="outline"
                    className="w-full h-12 text-base font-medium rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:border-purple-500 dark:hover:border-purple-400 disabled:opacity-50"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger le QR Code
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid sm:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <Scissors className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                Raccourcissement Rapide
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Obtenez un lien court en quelques secondes, sans inscription requise.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                <Palette className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                QR Code Personnalisé
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Personnalisez les couleurs, la taille et le style de votre QR code.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                <Copy className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                Copie en Un Clic
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Copiez instantanément votre lien raccourci dans le presse-papiers.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto text-center text-sm text-slate-500 dark:text-slate-400">
          <p>LinkShortener Pro © 2024 - Service gratuit de raccourcissement d'URL</p>
        </div>
      </footer>
    </div>
  )
}

export default App
