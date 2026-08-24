# 🏗️ Plan MVP — Lokka (Gestion Locative au Bénin)

## Audit de l'Existant

Votre projet a déjà une base solide. Voici l'état actuel :

| Composant | Statut | Remarques |
|:---|:---:|:---|
| Landing page (9 sections) | ✅ Fait | Hero, Features, Pricing, CTA, etc. — design premium |
| Auth (Login + Register) | ✅ Fait | Pages UI, mais pas de backend |
| Onboarding (5 étapes) | ✅ Fait | Bienvenue → Profil → Bien → Locataire → Préférences |
| Dashboard Overview | ✅ Fait | KPIs, graphiques Recharts, activité récente |
| Page Biens | ✅ Fait | Liste avec cartes, mais **données FR mockées** |
| Page Locataires | ✅ Fait | Liste avec infos, mais **données FR mockées** |
| Page Loyers | ✅ Fait | Échéancier + statuts, mais **données FR mockées** |
| Page Comptabilité | ✅ Fait | Récap fiscal (format FR 2044) — **à adapter au Bénin** |
| Sidebar + Header | ✅ Fait | Navigation complète avec shadcn/ui |

> [!WARNING]
> **Problème majeur** : Tout le contenu est contextualisé pour la **France** (€, Paris, déclaration 2044, format FR). Il faut tout adapter au contexte **béninois** (FCFA, Cotonou/Abomey-Calavi, Loi 2022-30, Mobile Money).

---

## Ce qu'il faut construire pour le MVP

### 🔴 Priorité 1 — Adapter l'existant au Bénin

C'est la première étape, **avant** d'ajouter quoi que ce soit :

#### Changements transversaux
- [ ] **Devise** : € → **FCFA** partout
- [ ] **Villes** : Paris → **Cotonou, Abomey-Calavi, Porto-Novo, Parakou**
- [ ] **Noms/données mock** : Noms français → **Noms béninois** (Koudjo, Agossou, Dossou, etc.)
- [ ] **Téléphones** : +33 → **+229**
- [ ] **Modes de paiement** : Virement/CB → **Mobile Money (MTN MoMo, Moov Money), Espèces**
- [ ] **Comptabilité** : Supprimer la déclaration 2044 FR → **Revenus/Dépenses simples** adaptés au Bénin
- [ ] **Juridique** : Références à la **Loi 2022-30** (caution max 3 mois, bail min 1 an)

---

### 🔴 Priorité 2 — Les 6 Modules MVP

#### Module 1 : Gestion des Biens `[ADAPTER + COMPLÉTER]`

**Pages existantes à modifier :**
- [biens/page.tsx](file:///home/kennedy/.gemini/antigravity-ide/scratch/lokka/app/dashboard/biens/page.tsx) — adapter les données

**Pages à créer :**

| Page | Route | Description |
|:---|:---|:---|
| Ajouter un bien | `/dashboard/biens/nouveau` | Formulaire : nom, type (Studio/Chambre/Appartement/Maison/Boutique), adresse, ville, quartier, surface, loyer mensuel (FCFA), photos |
| Détail d'un bien | `/dashboard/biens/[id]` | Fiche complète, locataire actuel, historique des paiements, état du bien |
| Modifier un bien | `/dashboard/biens/[id]/modifier` | Édition des infos |

**Champs spécifiques Bénin :**
- Type de bien : Studio, Chambre, Appartement, Maison, Villa, Boutique/Local commercial
- Ville + Quartier (ex: Cotonou → Fidjrossè, Ganhi, Akpakpa)
- Loyer en FCFA
- Charges (eau, électricité SBEE — incluses ou non)
- État : Occupé / Vacant / En travaux

---

#### Module 2 : Gestion des Locataires `[ADAPTER + COMPLÉTER]`

**Pages existantes à modifier :**
- [locataires/page.tsx](file:///home/kennedy/.gemini/antigravity-ide/scratch/lokka/app/dashboard/locataires/page.tsx) — adapter les données

**Pages à créer :**

| Page | Route | Description |
|:---|:---|:---|
| Ajouter un locataire | `/dashboard/locataires/nouveau` | Formulaire : nom, prénom, téléphone (+229), email (optionnel), pièce d'identité (CIN/Passeport), profession, personne à contacter en cas d'urgence |
| Fiche locataire | `/dashboard/locataires/[id]` | Profil complet, bail actif, historique paiements, documents |
| Créer un bail | `/dashboard/locataires/[id]/bail` | Bail conforme Loi 2022-30 : durée min 1 an, caution max 3 mois, montant loyer, date de début |

**Champs spécifiques Bénin :**
- Numéro de téléphone WhatsApp (champ séparé, très important)
- Numéro CIN ou Passeport
- Garant / Personne de référence (nom + tel)
- Mode de paiement préféré (MTN MoMo / Moov Money / Espèces)

---

#### Module 3 : Suivi des Loyers & Paiements `[ADAPTER + CRÉER]`

**Pages existantes à modifier :**
- [loyers/page.tsx](file:///home/kennedy/.gemini/antigravity-ide/scratch/lokka/app/dashboard/loyers/page.tsx) — adapter devises et modes de paiement

**Pages/Composants à créer :**

| Élément | Description |
|:---|:---|
| **Enregistrer un paiement** (Modal) | Mode de paiement (MTN MoMo / Moov Money / Espèces / Chèque), montant, date, référence transaction |
| **Générer quittance** (Action) | Bouton → génère un PDF de quittance en FCFA, téléchargeable |
| **Envoyer rappel** (Action) | Envoyer un rappel WhatsApp au locataire en retard |
| **Vue calendrier** | Calendrier mensuel avec les échéances et statuts |

**Statuts de paiement :**
- ✅ Payé (à temps)
- ⏳ En attente (pas encore à la date d'échéance)
- ⚠️ En retard (dépassé l'échéance)
- ❌ Impayé (après relance)
- 🔄 Partiel (paiement incomplet — très courant au Bénin)

---

#### Module 4 : Documents Automatiques `[NOUVEAU]`

**Pages à créer :**

| Page | Route | Description |
|:---|:---|:---|
| Centre de documents | `/dashboard/documents` | Liste de tous les documents générés (baux, quittances, reçus) |
| Modèles | `/dashboard/documents/modeles` | Templates disponibles |

**Documents à générer en PDF :**
1. **Contrat de bail** — Conforme Loi 2022-30 (parties, bien, loyer, caution, durée, obligations)
2. **Quittance de loyer** — Mensuelle, avec détail (loyer + charges)
3. **Reçu de caution** — Montant, date de versement
4. **État des lieux** — Entrée/Sortie avec descriptions par pièce
5. **Mise en demeure** — Modèle de relance formelle pour impayés

---

#### Module 5 : Notifications WhatsApp & SMS `[NOUVEAU]`

**Composants à créer :**

| Élément | Description |
|:---|:---|
| **Page Paramètres Notifications** | `/dashboard/parametres/notifications` — activer/désactiver WhatsApp, SMS, fréquence des rappels |
| **Rappel automatique** | J-3 avant échéance → rappel WhatsApp au locataire |
| **Alerte impayé** | J+1 après échéance → notification au propriétaire |
| **Confirmation de paiement** | Paiement reçu → message WhatsApp + quittance PDF au locataire |

**Intégration technique :**
- WhatsApp Business API (via 360dialog ou Twilio)
- SMS de backup via Twilio/Vonage
- Templates de messages en **français** avec termes locaux

---

#### Module 6 : Paramètres & Profil `[NOUVEAU]`

| Page | Route | Description |
|:---|:---|:---|
| Profil utilisateur | `/dashboard/parametres/profil` | Nom, email, téléphone, photo, mot de passe |
| Paramètres généraux | `/dashboard/parametres` | Devise (FCFA par défaut), langue, fuseau horaire |
| Abonnement | `/dashboard/parametres/abonnement` | Plan actuel, upgrade, historique des paiements |

---

## 📐 Modèle de Données (Schéma Simplifié)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Utilisateur │     │     Bien     │     │  Locataire   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │────<│ id           │     │ id           │
│ nom          │     │ proprietaire │     │ nom          │
│ email        │     │ nom          │     │ prenom       │
│ telephone    │     │ type         │     │ telephone    │
│ mot_de_passe │     │ adresse      │     │ whatsapp     │
│ plan         │     │ ville        │     │ email        │
│              │     │ quartier     │     │ cin          │
│              │     │ surface      │     │ profession   │
│              │     │ loyer_fcfa   │     │ garant_nom   │
│              │     │ charges      │     │ garant_tel   │
│              │     │ statut       │     │ mode_paiement│
│              │     │ photos[]     │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                     │
                            └──────┐   ┌──────────┘
                                   ▼   ▼
                            ┌──────────────┐
                            │     Bail     │
                            ├──────────────┤
                            │ id           │
                            │ bien_id      │
                            │ locataire_id │
                            │ date_debut   │
                            │ date_fin     │
                            │ loyer_fcfa   │
                            │ caution_fcfa │  ← max 3 mois (Loi 2022-30)
                            │ jour_echeance│
                            │ statut       │
                            └──────────────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │   Paiement   │
                            ├──────────────┤
                            │ id           │
                            │ bail_id      │
                            │ montant_fcfa │
                            │ date_paiement│
                            │ mois_concerne│
                            │ mode         │  ← MTN/Moov/Espèces/Chèque
                            │ reference    │  ← ID transaction Mobile Money
                            │ statut       │  ← payé/partiel/en_retard/impayé
                            │ quittance_url│
                            └──────────────┘

                            ┌──────────────┐
                            │   Document   │
                            ├──────────────┤
                            │ id           │
                            │ type         │  ← bail/quittance/reçu/edl/mise_en_demeure
                            │ bail_id      │
                            │ fichier_url  │
                            │ date_creation│
                            └──────────────┘
```

---

## 🔌 Intégrations Techniques

| Service | Usage | Priorité MVP |
|:---|:---|:---:|
| **Supabase** | Auth + Base de données PostgreSQL + Storage (photos/docs) | 🔴 Critique |
| **FedaPay** ou **KkiaPay** | Paiement Mobile Money (MTN MoMo + Moov Money) | 🔴 Critique |
| **React-PDF** / **@react-pdf/renderer** | Génération de quittances et baux en PDF | 🔴 Critique |
| **WhatsApp Business API** (360dialog) | Rappels et confirmations | 🟡 Phase 2 |
| **Twilio SMS** | Backup si pas WhatsApp | 🟢 Phase 3 |

---

## 🗓️ Roadmap de Développement (Sprints)

### Sprint 1 (Semaines 1-2) — Fondations
- [ ] Adapter toutes les données mock au contexte Bénin (FCFA, villes, noms, modes de paiement)
- [ ] Intégrer Supabase (auth + base de données)
- [ ] CRUD Biens (créer, lister, modifier, voir détail)
- [ ] CRUD Locataires (créer, lister, modifier, fiche)

### Sprint 2 (Semaines 3-4) — Cœur Métier
- [ ] Module Baux (créer un bail conforme Loi 2022-30, lier bien ↔ locataire)
- [ ] Module Paiements (enregistrer un paiement, suivi des statuts)
- [ ] Génération de quittances PDF
- [ ] Dashboard Overview avec données réelles (plus de mock)

### Sprint 3 (Semaines 5-6) — Documents & Notifications
- [ ] Génération de contrats de bail PDF
- [ ] Centre de documents
- [ ] Intégration FedaPay/KkiaPay pour paiement en ligne
- [ ] Rappels de loyer (email dans un premier temps)

### Sprint 4 (Semaines 7-8) — Polish & Lancement
- [ ] Page Paramètres (profil, notifications, abonnement)
- [ ] Tests end-to-end
- [ ] Landing page finale avec pricing FCFA
- [ ] Déploiement production (Vercel + Supabase)
- [ ] Beta test avec 5-10 propriétaires à Cotonou

---

## ❌ Ce qui N'EST PAS dans le MVP

Ne pas essayer de tout faire. Ces features viendront **après** le lancement :

- ❌ Portail locataire autonome (Phase 2)
- ❌ Scoring locataire (Phase 2)  
- ❌ Chatbot WhatsApp interactif (Phase 3)
- ❌ Analytics avancés / prévisions (Phase 3)
- ❌ Multi-utilisateurs / rôles (Phase 2)
- ❌ Mode hors-ligne (Phase 2)
- ❌ Réseau d'artisans (Phase 3)
- ❌ Intégration bancaire (Phase 3)
- ❌ App mobile native (Phase 3 — la PWA suffit pour le MVP)
