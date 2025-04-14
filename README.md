# Valora - Convertisseur de devises

![Valora Logo](public/logo192.png)

Valora est une application web moderne de conversion de devises qui permet de convertir facilement des montants entre différentes devises en utilisant des taux de change à jour.

## Fonctionnalités

- **Conversion simple** : Convertissez rapidement des montants entre différentes devises
- **Conversion en masse** : Entrez plusieurs valeurs à la fois pour les convertir
- **Taux de change à jour** : Utilise l'API exchangerate-api.com pour des taux de change en temps réel
- **Export Excel** : Exportez vos conversions au format Excel (.xlsx)
- **Interface intuitive** : Design moderne et responsive avec Tailwind CSS
- **Copie rapide** : Copiez les résultats dans le presse-papiers en un clic

## Technologies utilisées

- **Frontend** : React, TypeScript, Vite
- **Styling** : Tailwind CSS
- **Traitement Excel** : ExcelJS
- **API** : exchangerate-api.com pour les taux de change

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/anais0210/valora.git
   cd valora
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. Lancez l'application en mode développement :
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```

4. Ouvrez votre navigateur à l'adresse [http://localhost:5173](http://localhost:5173)

## Utilisation

1. **Conversion simple** :
   - Entrez une ou plusieurs valeurs dans la zone de texte (séparées par des retours à la ligne, des virgules ou des points-virgules)
   - Sélectionnez la devise source (par exemple EUR)
   - Sélectionnez la devise cible (par exemple USD)
   - Cliquez sur "Convertir"

2. **Export des résultats** :
   - Après la conversion, vous pouvez copier les résultats en cliquant sur "Copier les résultats"
   - Vous pouvez également exporter les résultats au format Excel en cliquant sur "Exporter en Excel"

3. **Fichier Excel exporté** :
   - Le fichier Excel contient deux feuilles :
     - "Conversions de devises" : Toutes les conversions avec les valeurs d'origine, les valeurs converties et les taux de change
     - "Informations" : Métadonnées sur la conversion (date, devises, nombre de conversions)

## Licence


## Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub. 