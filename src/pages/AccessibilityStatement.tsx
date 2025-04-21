import React from 'react';
import { Link } from 'react-router-dom';

export const AccessibilityStatement: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/"
        className="inline-flex items-center text-[var(--color-green-800)] hover:text-[var(--color-green-600)] mb-6"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Retour à l'accueil
      </Link>
      <h1 className="text-3xl font-bold text-[var(--color-green-800)] mb-8">
        Déclaration d'accessibilité - Valora
      </h1>
      <p className="text-sm text-[var(--color-green-600)] mb-8">
        Dernière mise à jour : 21 avril 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--color-green-800)] mb-4">Introduction</h2>
        <p className="text-[var(--color-green-700)] mb-4">
          Valora s'engage à rendre son site internet accessible conformément à l'article 47 de la
          loi n° 2005-102 du 11 février 2005. Cette déclaration d'accessibilité s'applique au site
          Valora - Convertisseur de devises.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--color-green-800)] mb-4">
          État de conformité
        </h2>
        <p className="text-[var(--color-green-700)] mb-4">
          Le site Valora est à ce jour non conforme au RGAA 4.1.2, car aucun audit formel n'a encore
          été réalisé.
        </p>
        <p className="text-[var(--color-green-700)]">
          Cependant, une démarche d'accessibilité dès la conception est mise en œuvre pour garantir
          une expérience numérique inclusive.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--color-green-800)] mb-4">
          Technologies utilisées sur le site
        </h2>
        <ul className="list-disc list-inside text-[var(--color-green-700)] space-y-2">
          <li>HTML 5 / CSS 3</li>
          <li>JavaScript (ES2022)</li>
          <li>React 18</li>
          <li>TailwindCSS 3</li>
          <li>TypeScript</li>
          <li>Vite</li>
          <li>Zustand (gestion d'état)</li>
          <li>React Router DOM</li>
          <li>Bibliothèques : @headlessui/react, @heroicons/react, react-select</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--color-green-800)] mb-4">
          Méthode d'évaluation
        </h2>
        <p className="text-[var(--color-green-700)] mb-4">
          À ce jour, le site n'a pas encore été audité par un organisme externe.
        </p>
        <p className="text-[var(--color-green-700)] mb-4">
          Une auto-évaluation progressive est en cours, en s'appuyant sur les outils suivants :
        </p>
        <ul className="list-disc list-inside text-[var(--color-green-700)] space-y-2">
          <li>Axe DevTools (automatisé)</li>
          <li>Navigation clavier (test manuel)</li>
          <li>Contraste et structure des pages (vérification visuelle)</li>
          <li>Sensibilisation aux bonnes pratiques RGAA en amont du développement</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--color-green-800)] mb-4">
          Contenus non accessibles
        </h2>
        <p className="text-[var(--color-green-700)] mb-4">
          L'inventaire des non-conformités est en cours.
        </p>
        <p className="text-[var(--color-green-700)] mb-4">
          Les composants sont en cours d'amélioration pour :
        </p>
        <ul className="list-disc list-inside text-[var(--color-green-700)] space-y-2">
          <li>garantir une navigation clavier fluide,</li>
          <li>améliorer les contrastes,</li>
          <li>associer correctement les champs et les labels,</li>
          <li>assurer une compatibilité avec les lecteurs d'écran.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--color-green-800)] mb-4">Dérogations</h2>
        <p className="text-[var(--color-green-700)]">Aucune dérogation à ce jour.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--color-green-800)] mb-4">
          Retour d'information et contact
        </h2>
        <p className="text-[var(--color-green-700)] mb-4">
          Si vous rencontrez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une
          fonctionnalité du site, vous pouvez contacter la responsable du site :
        </p>
        <p className="text-[var(--color-green-700)]">
          📧{' '}
          <a
            href="mailto:anais.camille.sparesotto@gmail.com"
            className="text-[var(--color-amber-600)] hover:text-[var(--color-amber-700)] underline"
          >
            anais.camille.sparesotto@gmail.com
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--color-green-800)] mb-4">
          Voies de recours
        </h2>
        <p className="text-[var(--color-green-700)] mb-4">
          Si vous constatez un défaut d'accessibilité qui vous empêche d'accéder à un contenu du
          site, et que vous n'obtenez pas de réponse satisfaisante dans un délai raisonnable, vous
          êtes en droit de :
        </p>
        <ul className="list-disc list-inside text-[var(--color-green-700)] space-y-2">
          <li>
            Envoyer un message au Défenseur des droits :{' '}
            <a
              href="https://formulaire.defenseurdesdroits.fr/"
              className="text-[var(--color-amber-600)] hover:text-[var(--color-amber-700)] underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://formulaire.defenseurdesdroits.fr/
            </a>
          </li>
          <li>Contacter le délégué du Défenseur des droits dans votre région</li>
          <li>
            Envoyer un courrier au siège du Défenseur des droits : Défenseur des droits – Libre
            réponse 71120 – 75342 Paris CEDEX 07
          </li>
        </ul>
      </section>
    </div>
  );
};
