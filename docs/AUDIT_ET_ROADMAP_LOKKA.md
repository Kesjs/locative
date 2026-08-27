# 📋 Document de Référence — Audit & Feuille de Route Fonctionnelle Lokka

> **Lokka** — SaaS de Gestion Locative & Patrimoine Immobilier (Bénin & Afrique de l'Ouest)
> *Date de mise à jour : 25 Août 2026*
> *Conforme à la Loi n° 2022-30 du 20 décembre 2022 régissant les baux d'habitation en République du Bénin.*

---

## 🌟 1. Identité de la Plateforme & Services Phares

Lokka remplace la gestion informelle, les carnets papier et les litiges par un ERP moderne au design *Quiet Luxury* (palette `#FAF9F6`, `#FFFFFF`, `#1C1C1C`, `#E8E5E0` et accents `#087F5B`).

### Les 5 Services Phares à mettre en exergue :
1. **🛡️ Bouclier Juridique Loi n° 2022-30** :
   - Plafonnement strict de la caution à **3 mois de loyer maximum**.
   - Baux types d'habitation, états des lieux contradictoires et encadrement des commissions d'agence (**10% max**).
2. **📱 Paiements Locaux & Intégration WhatsApp** :
   - Encaissements directs par **MTN Mobile Money**, **Moov Money**, virements bancaires locaux (BOA, Ecobank, UBA) et espèces.
   - Relances d'échéances et quittances transmises en **1 clic sur WhatsApp**.
3. **🧾 Quittances Numériques Certifiées Infalsifiables** :
   - Génération instantanée de quittances PDF officielles avec **numéro de série unique** et **QR Code d'authentification**.
4. **🔑 Espace Locataire Dédié & Autonome (`/locataire`)** :
   - Portail web sécurisé permettant au locataire de télécharger ses quittances à tout moment, payer son loyer par MoMo et déclarer une panne.
5. **💎 Monétisation & Abonnements SaaS (Checkout MoMo & CB)** :
   - Grille Starter (Gratuit 2 biens), Pro (5 000 FCFA/mois) et Agence (25 000 à 35 000 FCFA/mois) avec paywalls intelligents et jauges de quotas.

---

## 📊 2. Tableau Récapitulatif : Ce qui est Fait vs Ce qui Reste à Faire

| Module | Route / Composant | Statut Actuel | Ce qui est FAIT ✅ | Ce qui RESTE À FAIRE 🚧 |
| :--- | :--- | :---: | :--- | :--- |
| **Authentification** | `/auth/login`, `/auth/register`, `/auth/verify` | ✅ **Prêt** | • Connexion Email + Code OTP 6 chiffres<br>• Fallback mot de passe<br>• Connexion Supabase Auth | • Vérification persistance token de session en production |
| **Onboarding** | `/onboarding` | ✅ **Prêt** | • 5 étapes interactives<br>• Profils : Bailleur, Agence, Diaspora<br>• Création 1er bien & locataire (caution 3 mois)<br>• Sélecteur pays diaspora avec drapeaux SVG | • Enregistrement synchrone direct en base Supabase |
| **Vue d'Ensemble** | `/dashboard` | 🟡 **À connecter** | • KPIs financiers multi-profils<br>• Graphique Recharts (Brut, 10%, TFU)<br>• Checklist de démarrage 3 étapes<br>• Filtres canaux MoMo/Moov/Virement<br>• Modal de quittance certifiée & reçu | • Calcul dynamique en temps réel depuis le Store global<br>• Lien direct vers l'aperçu du mini-site vitrine<br>• Export PDF certifié TFU et CRG Mandant |
| **Gestion des Biens** | `/dashboard/biens` | 🟡 **À enrichir** | • Liste des biens avec filtres (Occupé/Vacant)<br>• Spécificités Bénin (SBEE à carte, SONEB/Forage, Clim, Groupe)<br>• Modal d'ajout complet de bien | • Fiche détaillée `/dashboard/biens/[id]`<br>• Modification & suppression de biens<br>• Téléversement photos réelles<br>• Page publique du bien `/p/[slug]` |
| **Gestion des Locataires** | `/dashboard/locataires` | 🟡 **À enrichir** | • Liste avec statuts et loyers<br>• Numéros +229 & WhatsApp<br>• Modal d'invitation (Message WhatsApp + Email Resend)<br>• Vérification légale caution max 3 mois | • Fiche détaillée `/dashboard/locataires/[id]`<br>• Gestion des pièces (CIP, CNI, Passeport)<br>• Score de solvabilité / ponctualité Lokka<br>• Procédure de résiliation et restitution caution |
| **Loyers & Encaissements** | `/dashboard/loyers` | 🔴 **Refonte requise** | • Vue sommaire basique | • **Refonte complète selon le Design System Lokka**<br>• Tableau des encaissements mensuels<br>• Gestion des impayés et paiements partiels<br>• Bouton Quittance PDF immédiate (`ReceiptModal`)<br>• Bouton Relance WhatsApp 1-clic pré-remplie<br>• Enregistrement direct des règlements |
| **Comptabilité & TFU** | `/dashboard/comptabilite` | 🔴 **Refonte requise** | • Aperçu statique des chiffres | • **Refonte complète selon le Design System Lokka**<br>• Suivi des charges réelles (réparations, gardiennage)<br>• Calculateur automatique de la **TFU DGI Bénin**<br>• Générateur de **CRG Mandant (10%)** pour Agences<br>• Export PDF du bilan comptable annuel |
| **Maintenance & Pannes** | `/dashboard/maintenance` | ⚪ **À créer** | *(N'existe pas - 404 dans la sidebar)* | • **Création de la page `/dashboard/maintenance`**<br>• Réception des pannes envoyées depuis `/locataire`<br>• Workflow : Signalé ➔ Devis ➔ En cours ➔ Résolu<br>• Assignation des coûts dans la comptabilité |
| **Centre de Documents** | `/dashboard/documents` | ⚪ **À créer** | *(N'existe pas - 404 dans la sidebar)* | • **Création de la page `/dashboard/documents`**<br>• Générateur de Contrat de bail Loi 2022-30<br>• Générateur d'État des lieux contradictoire<br>• Générateur de Reçu de caution officielle<br>• Modèle de Mise en demeure pour impayés<br>• Archive de toutes les quittances émises |
| **Vitrine & Annonces** | `/dashboard/annonces` & `/p/[slug]` | ⚪ **À créer** | *(N'existe pas - 404 dans la sidebar)* | • **Création de `/dashboard/annonces`** (Gestion du mini-site)<br>• **Création de la page publique `/p/[slug]`**<br>• Module de réservation de visite en ligne<br>• Widget Live Preview smartphone dans le dashboard |
| **Paramètres & Profil** | `/dashboard/parametres` | ⚪ **À créer** | *(N'existe pas - 404 dans la sidebar)* | • **Création de la page `/dashboard/parametres`**<br>• Profil bailleur & coordonnées MoMo de réception<br>• Configuration Agence (Nom, IFU, Logo, Taux 10%)<br>• Préférences des alertes automatiques WhatsApp |
| **Abonnements & Facturation** | `/dashboard/parametres/abonnement` | ⚪ **À créer** | • Page marketing `/tarifs` et composant `Pricing` prêts | • **Création de l'onglet Facturation dans les Paramètres**<br>• Jauge de quotas (ex: 1/2 biens en Starter)<br>• Modal de Checkout MoMo / CB pour Upgrade Pro/Agence<br>• Paywalls intelligents aux moments clés |
| **Portail Locataire** | `/locataire` | 🟡 **À connecter** | • Interface locataire moderne<br>• Téléchargement quittances avec QR Code<br>• Simulation de paiement MoMo<br>• Formulaire de signalement de panne | • Synchronisation bidirectionnelle avec le dashboard bailleur<br>• Badge de caution consignée Loi 2022-30<br>• Téléchargement du contrat de bail signé |
| **Store & Persistance** | `lib/store/` | 🟡 **À unifier** | • Supabase Client/Server & schémas SQL prêts | • **Création d'un Context Store unifié (`LokkaContext`)** assurant la réactivité instantanée entre tous les modules (localStorage + Supabase) |

---

## 🛠️ 3. Plan d'Action & Découpage des Chantiers

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          PLAN DE DÉPLOIEMENT LOKKA                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1 : FONDATIONS & MODERNISATION (Data Store + Loyers + Compta)              │
│ • Unification du State Store réactif (`LokkaContext`)                            │
│ • Refonte moderne de `/dashboard/loyers` (Relances WhatsApp + Quittances)        │
│ • Refonte moderne de `/dashboard/comptabilite` (TFU DGI + CRG Agence)            │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2 : LES MODULES MANQUANTS DE LA NAVIGATION                                 │
│ • `/dashboard/maintenance` (Tickets de pannes & liaison Espace Locataire)        │
│ • `/dashboard/documents` (Baux types Loi 2022-30, États des lieux, Quittances)   │
│ • `/dashboard/parametres` & `/dashboard/parametres/abonnement` (Quotas + MoMo)   │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3 : ACQUISITION & FICHES DÉTAILLÉES                                        │
│ • Fiches unitaires `/dashboard/biens/[id]` et `/dashboard/locataires/[id]`       │
│ • Mini-site vitrine public `/p/[slug]` & Module Annonces `/dashboard/annonces`  │
│ • Verrouillage des quotas & Modals d'Upgrade                                     │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 4 : SYNCHRONISATION FINALE & TESTS                                         │
│ • Raccordement temps réel Espace Locataire ⇄ Dashboard Bailleur                  │
│ • Validation des flux de bout en bout (Auth ➔ Onboarding ➔ ERP ➔ Portail)        │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

*Document sauvegardé dans `docs/AUDIT_ET_ROADMAP_LOKKA.md` pour servir de feuille de route continue au projet.*
