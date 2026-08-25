# 📑 Spécification Globale & Roadmap Fonctionnelle — Lokka

> **Lokka** est la plateforme SaaS de gestion locative et de vitrine immobilière nouvelle génération conçue spécifiquement pour le marché béninois et ouest-africain.

---

## 🌟 1. Vision & Positionnement

### La Proposition de Valeur
Lokka transforme la gestion immobilière au Bénin en remplaçant l'informel et les carnets papier par une plateforme web complète et certifiée :
1. **Un Back-Office Bailleur & Agence (ERP)** : Suivi des loyers, baux conformes Loi 2022-30, calcul des commissions d'agence (10%), fiscalité TFU DGI.
2. **Un Espace Locataire Dédié (Portail Web)** : Accès sécurisé pour chaque locataire pour télécharger ses quittances PDF certifiées à tout moment, payer son loyer par Mobile Money et suivre sa caution.
3. **Un Front-Office d'Acquisition (Site Vitrine)** : Mini-site public pour chaque bailleur/agence pour publier ses biens vacants et gérer les demandes de visites.

### Les 3 Piliers du Marché Béninois
* 🟡 **Paiements Locaux Intégrés** : Règlements directs par MTN Mobile Money, Moov Money, Virements bancaires (BOA, Ecobank, UBA) et Espèces.
* ⚖️ **Bouclier Juridique Loi n° 2022-30** : Plafond légal de caution fixé à **3 mois maximum**, baux types certifiés, encadrement des honoraires d'agence à **10% max**.
* 📊 **Conformité Fiscale TFU** : Calcul automatisé et historique clair pour la déclaration de la Taxe Foncière Unique auprès de la DGI Bénin.

---

## 👥 2. Les Espaces & Profils de la Plateforme

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               ÉCOSYSTÈME COMPLET LOKKA                                 │
├──────────────────────────┬───────────────────────────┬─────────────────────────────────┤
│  🏠 BAILLEUR PARTICULIER │  🏢 AGENCE / GESTIONNAIRE │  🔑 ESPACE LOCATAIRE DÉDIÉ      │
│  • Gestion de son parc   │  • Multi-mandats          │  • Téléchargement Quittances PDF│
│  • Encaissements & TFU   │  • Commissions 10% & CRG  │  • Paiement MoMo direct         │
│  • Quittances PDF        │  • Portefeuille bailleurs │  • Suivi caution & Incidents    │
└──────────────────────────┴───────────────────────────┴─────────────────────────────────┘
```

1. **🏠 Propriétaire Bailleur (Résident Bénin & Diaspora)** : Gère ses logements, enregistre les paiements, télécharge et émet des quittances officielles, déclare sa TFU.
2. **🏢 Agence Immobilière ou Gestionnaire Agréé** : Gère un portefeuille multi-propriétaires, prélève sa commission légale de 10% et édite des Comptes-Rendus de Gestion (CRG).
3. **🔑 Le Locataire (Espace Dédié)** : Accède à son portail web pour retrouver son bail, payer son loyer en ligne et télécharger toutes ses quittances PDF certifiées avec QR Code.

---

## 🗺️ 3. Parcours Global : De l'Auth au Dashboard

```
1. Authentification (Email + OTP 6 chiffres)
   │
   ▼
2. Onboarding (< 2 min)
   ├─ Étape 0 : Choix du Profil (Bailleur / Agence / Diaspora)
   ├─ Étape 1 : Ville & Mode d'Encaissement (MTN MoMo, Moov, Banque)
   ├─ Étape 2 : 1er Bien Immobilier (Nom, type, loyer FCFA, charges)
   ├─ Étape 3 : 1er Locataire & Caution (Loi 2022-30, Accès portail)
   └─ Étape 4 : Automatisations (Quittances PDF web, Alertes, TFU)
   │
   ▼
3. Tableau de bord Personnalisé & Actif
   ├─ KPIs financiers adaptés au profil
   ├─ Checklist d'accueil (3 étapes)
   └─ Fiche vitrine & Espace locataire activé
```

---

## 🧩 4. Cartographie Complète des Modules & Fonctionnalités

### Module 1 : Authentification & Inscription
* Inscription et connexion par email sans mot de passe complexe via **Code OTP à 6 chiffres**.
* Fallback mot de passe disponible en secours.
* Session persistante sécurisée via Supabase Auth.

### Module 2 : Onboarding Intelligent & Évolutif
* **Étape 0** : Sélection du profil (Bailleur, Agence, Diaspora).
* **Étape 1** : Ville d'opération (Cotonou, Calavi, Porto-Novo, Parakou, Ouidah) + Canal de paiement principal.
* **Étape 2** : Création du premier logement.
* **Étape 3** : Saisie du premier locataire avec vérification automatique de la caution (Plafond de 3 mois Loi 2022-30) et création de son accès espace locataire.
* **Étape 4** : Activation des automatisations (Quittances PDF automatiques, Alertes, TFU DGI).

### Module 3 : Tableaux de Bord Adaptatifs
* **Dashboard Bailleur** : Loyers nets perçus, taux d'occupation, alertes retards, raccourci d'enregistrement de loyer.
* **Dashboard Agence** : Loyers totaux collectés, commissions de gestion de 10%, sommes nettes à reverser aux mandants.
* **Dashboard Diaspora** : Rentes mensuelles en FCFA avec conversion automatique en **Euros (€) / Dollars ($)**, statut de solvabilité en temps réel.
* **Checklist de bienvenue** : Guide interactif en 3 étapes pour amorcer l'espace utilisateur.

### Module 4 : Espace Locataire Dédié (`/locataire`)
* **Accès sécurisé locataire** par téléphone ou email.
* **Téléchargement autonome des quittances PDF** : Historique complet de tous les mois acquittés.
* **Paiement en ligne du loyer** : Raccordement MTN MoMo / Moov Money direct déclenchant la quittance instantanée.
* **Bail & Caution Loi 2022-30** : Justificatif du dépôt de garantie certifié.
* **Signalement d'incidents** : Envoi de photos pour pannes de plomberie, électricité SBEE ou climatisation.

### Module 5 : Gestion des Biens & Formulaire Complet Bénin
* Formulaire riche par sections :
  - **Typologie** : Studio/Chambre, Appartement F2/F3/F4, Villa, Immeuble, Local commercial.
  - **Spécificités Bénin** : Compteur SBEE à carte personnel, SONEB/Forage, Groupe électrogène, Climatisation, Gardien 24/7.
  - **Photos HD** & Description commerciale.
  - **Switch de publication vitrine** : `[x] Publier sur mon site vitrine public`.

### Module 6 : Encaissement & Moteur de Quittances PDF Certifiées
* Enregistrement des règlements (MTN MoMo, Moov Money, Virement, Espèces).
* Génération instantanée de la **Quittance de loyer PDF certifiée** avec numéro de série unique et QR Code infalsifiable.
* Stockage sécurisé et téléchargeable à tout moment par le bailleur et par le locataire.

### Module 7 : Site Vitrine Public, Mini-Sites & Live Preview
* Mini-site public par utilisateur (`lokka.bj/p/[slug]` ou sous-domaine `agence.lokka.bj`).
* Support des **noms de domaine personnalisés** (`www.monagence.bj`) pour les offres Pro/Agence.
* **Aperçu en direct (Live Preview)** au format smartphone depuis le Dashboard.
* **Module de réservation de visites** : Choix des créneaux, gratuit ou avec frais de visite en FCFA.
* Bouton direct de contact et partage sur réseaux sociaux.

### Module 8 : Comptabilité, Mandats & Fiscalité TFU
* Bilan annuel des revenus locatifs et déduction des charges d'entretien.
* Édition des **Comptes-Rendus de Gestion (CRG)** mensuels pour les propriétaires mandants (Agences).
* Estimation de la **Taxe Foncière Unique (TFU Bénin)** pour la Direction Générale des Impôts.

---

## 💰 5. Modèle Économique & Grille Tarifaire (Pricing)

| Fonctionnalités | 🟢 Plan Starter | 🟡 Plan Pro | 🔵 Plan Agence / SCI |
| :--- | :--- | :--- | :--- |
| **Cible** | Bailleur 1 à 2 biens | Bailleur & Diaspora (jusqu'à 10 biens) | Agences & Multi-propriétaires |
| **Prix suggéré** | **Gratuit** ou 5 000 F/mois | **15 000 FCFA** / mois | **35 000 FCFA** / mois |
| **Biens gérés** | 2 biens max | Jusqu'à 10 biens | Biens illimités |
| **Espace Locataire Web** | Inclus | Inclus | Inclus avec logo agence |
| **Quittances PDF Web** | Incluses | Incluses illimitées | Incluses avec logo d'agence |
| **Site Vitrine** | Page partagée `lokka.bj/v/...` | Sous-domaine `mon-nom.lokka.bj` | **Nom de domaine pro (`.bj`, `.com`)** |
| **Frais de visite en ligne** | Standard | Inclus | Inclus + gestion multi-agents |
| **Comptes-Rendus CRG** | Non | Non | **Inclus pour tous les mandants** |

---

## 📋 6. Tableau de Suivi de la Roadmap MVP

| # | Fonctionnalité / Écran | Statut | Priorité |
| :--- | :--- | :---: | :---: |
| **1** | Auth Email + OTP 6 chiffres (`/auth/login`, `/auth/register`) | ✅ Prêt | P0 |
| **2** | Onboarding Étape 0 (Choix profil : Bailleur / Agence / Diaspora) | 🟡 En cours | P0 |
| **3** | Onboarding 4 Étapes dynamiques & Sauvegarde Supabase | 🟡 En cours | P0 |
| **4** | Dashboard adapté par profil (KPIs, Devises EUR, Commissions 10%) | 🟡 En cours | P0 |
| **5** | Moteur de Quittance PDF certifiée téléchargeable | 🟡 En cours | P0 |
| **6** | Espace Locataire Dédié (`/locataire` : Quittances, Bail, Paiement) | 🟡 En cours | P1 |
| **7** | Checklist de bienvenue sur le Dashboard (3 étapes) | 🟡 En cours | P1 |
| **8** | Formulaire d'ajout de bien complet avec spécificités Bénin (SBEE...) | 🟡 En cours | P1 |
| **9** | Fiche publique du bien & Mini-site vitrine (`/p/[slug]`) | ⚪ À faire | P1 |
| **10**| Module Live Preview (Aperçu mobile dans le dashboard) | ⚪ À faire | P1 |
| **11**| Module Réservation de visite avec frais de visite | ⚪ À faire | P2 |
| **12**| Édition du Compte-Rendu de Gestion (CRG) pour les Agences | ⚪ À faire | P2 |

---

*Document de référence Lokka — Mis à jour en continu selon l'avancement du projet.*
