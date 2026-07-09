# LinkShort

LinkShort est un outil React/Vite public, sans compte et sans base de donnees, pour raccourcir une URL et generer un QR code personnalisable.

Le projet est pense pour une utilisation directe: coller un lien, generer un lien court ou un QR code seul, personnaliser le rendu, puis exporter le QR en PNG ou SVG.

## Statut

- Version: `1.0.0`
- Application: frontend React/Vite
- Backend: aucun
- Stockage: historique local dans le navigateur
- Licence: MIT

## Fonctionnalites

- Raccourcissement d'URL via `is.gd`.
- Mode QR seulement pour generer un QR code sans raccourcir le lien.
- Studio QR avec presets, couleurs libres, degrade, styles visuels, coins et avertissements de lisibilite.
- Badge logo integre au QR code avec forme, padding, bordure, ombre et ajustement automatique.
- Exports PNG en 512, 1024 ou 2048 px et export SVG.
- Historique local dans le navigateur avec favoris, reprise, copie et suppression.
- Interface responsive pour mobile et desktop.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- qrcode.react
- lucide-react

## Installation

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Deploiement GitHub Pages

Le projet est configure pour GitHub Pages via GitHub Actions.

Dans les reglages du repo GitHub:

1. Ouvrir `Settings > Pages`.
2. Mettre `Source` sur `GitHub Actions`.
3. Pousser sur `main` ou lancer manuellement le workflow `Deploy to GitHub Pages`.

Le workflow installe les dependances, lance le lint, genere `dist`, puis publie uniquement le build Vite.

## Limites actuelles

- Les liens courts dependent du service externe `is.gd`.
- Les statistiques de clics ne sont pas incluses dans cette version sans backend.
- L'historique est local au navigateur de l'utilisateur.

## Roadmap

- Ajouter un second fournisseur de raccourcissement en fallback.
- Ajouter un controle de scan QR automatise ou semi-automatise.
- Ajouter des templates QR par secteur: restaurant, evenement, portfolio, business card.

## Licence

Ce projet est distribue sous licence MIT. Voir le fichier `LICENSE`.
