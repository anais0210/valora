# RatioScan

Application de mapping des ratios monétaires avec l'API Coupa.

## Fonctionnalités

- Authentification sécurisée
- Tableau de bord avec vue d'ensemble des ratios
- Liste détaillée des ratios avec filtrage et recherche
- Vue détaillée de chaque ratio avec historique
- Interface responsive et accessible (RGAA)

## Technologies utilisées

- React avec TypeScript
- Vite pour le build
- Tailwind CSS pour le style
- React Router pour la navigation
- Axios pour les appels API

## Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/ratio-scan.git
cd ratio-scan
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` à la racine du projet :
```env
VITE_API_URL=https://compass.coupa.com/fr-fr/api
```

4. Lancer l'application en mode développement :
```bash
npm run dev
```

## Structure du projet

```
src/
  ├── components/     # Composants réutilisables
  ├── contexts/       # Contextes React (auth, etc.)
  ├── pages/          # Pages de l'application
  ├── services/       # Services (API, etc.)
  ├── App.tsx         # Composant principal
  └── main.tsx        # Point d'entrée
```

## Accessibilité

L'application est conçue pour être accessible selon les critères RGAA 4.1 :

- Structure sémantique HTML5
- Contraste des couleurs respecté
- Navigation au clavier
- Messages d'erreur clairs
- Labels explicites pour les formulaires
- Support des lecteurs d'écran

## Déploiement

Pour construire l'application pour la production :

```bash
npm run build
```

Les fichiers générés seront dans le dossier `dist/`.

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

MIT 