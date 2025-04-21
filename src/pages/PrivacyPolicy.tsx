import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-beige-light)]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
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

          <h1 className="text-2xl font-bold text-[var(--color-green-800)] mb-6">
            Politique de Confidentialité
          </h1>

          <div className="space-y-6 text-[var(--color-green-800)]">
            <p className="text-sm text-[var(--color-green-600)]">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <p>
              Cette politique de confidentialité explique comment Valora collecte, utilise, protège
              et partage les données personnelles lorsque vous visitez notre site web. Nous
              respectons votre vie privée et nous nous engageons à protéger vos informations
              personnelles en conformité avec la législation sur la protection des données
              personnelles, notamment le Règlement Général sur la Protection des Données (RGPD).
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Quelles données collectons-nous ?</h2>
              <p>
                Lors de votre visite sur notre site, nous collectons certaines données de manière
                automatique à travers des outils de mesure d'audience, comme Vercel Web Analytics.
                Ces données incluent :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>L'adresse IP (anonymisée)</li>
                <li>Le type de navigateur</li>
                <li>Le système d'exploitation</li>
                <li>Le pays de provenance</li>
                <li>Les pages visitées et les interactions sur notre site</li>
                <li>L'heure et la durée de la visite</li>
              </ul>
              <p className="mt-2">
                Ces données sont utilisées pour analyser l'utilisation de notre site, améliorer
                l'expérience utilisateur et optimiser notre contenu.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                2. Utilisation des cookies et technologies similaires
              </h2>
              <p>
                Nous utilisons des cookies uniquement pour des raisons essentielles et nous ne
                stockons pas de cookies pour la collecte de données via Vercel Web Analytics. Cet
                outil ne fait que générer un hash anonyme pour chaque visite afin d'assurer une
                expérience de confidentialité maximale pour nos utilisateurs.
              </p>
              <p className="mt-2">
                Nous ne plaçons aucun cookie de suivi qui pourrait suivre les utilisateurs entre
                différentes visites ou sur d'autres sites web.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                3. Consentement à l'utilisation des données
              </h2>
              <p>
                Vercel Web Analytics ne nécessite pas le consentement préalable des utilisateurs,
                car il ne collecte que des données anonymisées. Cependant, nous vous informons de
                son utilisation par le biais de cette politique de confidentialité.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Partage de données</h2>
              <p>
                Les données collectées via Vercel Web Analytics sont utilisées uniquement pour
                l'analyse interne de notre site. Nous ne vendons, ne louons ni ne partageons vos
                informations personnelles avec des tiers à des fins commerciales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Sécurisation des données</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour
                protéger vos données personnelles contre toute perte, accès non autorisé,
                divulgation ou altération.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Vos droits</h2>
              <p>En vertu du RGPD, vous avez le droit de :</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Accéder aux données personnelles que nous collectons.</li>
                <li>Rectifier ou supprimer vos données personnelles.</li>
                <li>Vous opposer au traitement de vos données ou en demander la limitation.</li>
                <li>Demander la portabilité de vos données.</li>
              </ul>
              <p className="mt-2">
                Pour exercer vos droits, vous pouvez nous contacter à l'adresse suivante :
                contact@valora.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                7. Modifications de cette politique de confidentialité
              </h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout
                moment. Toute mise à jour sera publiée sur cette page avec la date de mise à jour.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
