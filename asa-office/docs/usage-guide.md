# 📖 Guide d'utilisation des prompts IDE — Équipe CareIN

> **Pour qui** : tous les développeurs de l'équipe utilisant Cursor, Windsurf ou VS Code (avec Continue/Copilot)
> **Objectif** : que tout le monde sache **comment briefer l'assistant IA** pour qu'il génère du code conforme aux standards CareIN

---

## 🎯 Vue d'ensemble

Tu as à disposition **3 niveaux de prompts** qui se complètent :

```
┌──────────────────────────────────────────────────────────┐
│  1. .cursorrules (racine du repo)                        │
│     ├─ Lu automatiquement par l'IDE à chaque interaction │
│     ├─ Définit le contexte projet, stack, conventions   │
│     └─ Toujours actif, pas besoin de le mentionner      │
└──────────────────────────────────────────────────────────┘
                          ▲
                          │ utilise comme contexte
                          │
┌──────────────────────────────────────────────────────────┐
│  2. Bibliothèque de tâches (docs/prompts/tasks/)         │
│     ├─ T01 à T12 : tâches de la roadmap (template fixe)  │
│     ├─ template-create-feature : pour les futures features│
│     └─ Référencer explicitement quand tu utilises        │
└──────────────────────────────────────────────────────────┘
                          ▲
                          │ référence en demande
                          │
┌──────────────────────────────────────────────────────────┐
│  3. Tes prompts personnalisés (au cas par cas)           │
│     └─ Tu écris ce que tu veux, le contexte fait le reste│
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup initial (à faire une seule fois par dev)

### Pour Cursor

1. Vérifier que le fichier `.cursorrules` est à la **racine du repo** (`carein-platform/.cursorrules`)
2. Cursor le lit automatiquement à l'ouverture du projet
3. Pour vérifier : ouvrir Cursor Settings → "Rules for AI" → tu dois voir le contenu du `.cursorrules`

### Pour Windsurf

1. Le fichier `.cursorrules` est aussi lu par Windsurf (compatibilité)
2. Alternative : créer `.windsurfrules` à la racine avec le même contenu (symlink possible)

### Pour VS Code (avec Continue.dev)

1. Créer `.continue/config.json` à la racine
2. Charger le contenu du `.cursorrules` dans `systemMessage`

### Pour VS Code (avec GitHub Copilot Chat)

1. Créer `.github/copilot-instructions.md` à la racine
2. Y copier le contenu du `.cursorrules`
3. Copilot le lit automatiquement

---

## 📋 Comment utiliser au quotidien

### Cas 1 — Tu codes sans demande explicite

Le `.cursorrules` est **toujours actif**. Tu n'as rien à faire. L'assistant suit les conventions automatiquement.

**Exemple** : tu tapes `// new component for patient form` dans un fichier vide. L'assistant génère :
- En TypeScript strict
- Avec RHF + Zod
- Avec composants `@carein/ui-kit` (Button, Input)
- Sans couleur hardcodée
- En feature-first

### Cas 2 — Tu veux exécuter une tâche de la roadmap

**Format de prompt** :

```
Exécute T<NN> selon la spec dans docs/prompts/tasks/T<NN>-<nom>.md.

[Optionnellement, contraintes ou contexte spécifique]
```

**Exemple concret** :

```
Exécute T04 (extraction ui-kit) selon la spec dans docs/prompts/tasks/T04-extraction-ui-kit.md.

Note : on n'a pas encore lancé pnpm dans le monorepo, fais-le en première étape pour vérifier.
```

L'assistant :
1. Lit le fichier de tâche
2. Suit les étapes documentées
3. Confirme la Definition of Done à la fin

### Cas 3 — Tu veux créer une nouvelle feature (pas dans la roadmap)

**Format de prompt** :

```
Je veux créer la feature `<feature-name>` (ex: `tablet-bindings`).
Suis le template docs/prompts/tasks/template-create-feature.md.

[Quelques détails métier]
```

**Exemple concret** :

```
Je veux créer la feature `tablet-bindings` qui matérialise le pré-appairage devices ↔ tablettes.
Suis le template docs/prompts/tasks/template-create-feature.md.

Détails :
- Vit dans care-suite
- Endpoints sous /api/v1/tenant/tablets/{tabletUuid}/device-bindings
- Permission : technician + tenant_admin
- Couvert par ADR-0016
```

L'assistant pose les questions complémentaires manquantes, puis livre dans l'ordre.

### Cas 4 — Tu veux faire de l'UX/UI design

**Format de prompt** :

```
Design la page <route> qui doit <objectif>.

Contraintes :
- App : <care-suite | carein-suite>
- Audience : <médecin terrain | admin | CTO>
- Données affichées : <liste>
- Actions principales : <liste>
- Référence UX : <Linear | Stripe | Notion | rien>

Respecte les standards UX/UI Pro Max du .cursorrules :
- 4 états obligatoires (loading, empty, error, success)
- Adaptation marque blanche
- Touch targets, accessibilité
- Patterns CareIN (RiskGauge, MetricCard, etc.)
```

**Exemple concret** :

```
Design la page /carein/brand-operators dans carein-suite.
Elle doit lister tous les Brand Operators avec leurs stats (nb tenants, nb users, statut).

Contraintes :
- App : carein-suite
- Audience : équipe CareIN
- Données : code, nom, pays, mode opération, nb tenants, statut, date activation
- Actions : créer un BO, suspendre, archiver, voir détail
- Référence UX : Linear ou Stripe Dashboard
- Filtres : par statut, par pays, par mode opération
- Recherche : par nom ou code

Respecte les standards UX/UI Pro Max. Génère :
1. Le wireframe en markdown (structure visuelle)
2. Le code de la page (page.tsx + composants)
3. Les empty/error/loading states
```

### Cas 5 — Tu veux une review de code

**Format de prompt** :

```
Review ce code [coller ou pointer le fichier].
Vérifie la conformité avec :
- Les ADR concernés (cite-les)
- Les règles non négociables du .cursorrules
- Les conventions de code

Format : checklist par ADR + issues trouvées + suggestions.
```

L'assistant produit une review structurée avec checklist par ADR.

### Cas 6 — Tu hésites sur une décision

**Format de prompt** :

```
Je dois décider entre <option A> et <option B> pour <problème>.

Contexte :
- <ce que tu fais>
- <contraintes>

Quelle option recommandes-tu, et pourquoi ?
Quel ADR pourrait s'appliquer ?
Doit-on créer un nouvel ADR ?
```

L'assistant analyse, cite les ADR pertinents, propose une recommandation argumentée.

---

## ⚠️ Bonnes pratiques

### ✅ Toujours référencer un fichier de tâche si applicable

Ça force l'assistant à lire la spec exacte, pas à improviser.

```
✅ "Exécute T06 selon la spec dans docs/prompts/tasks/T06-refactor-ui-kit-css-variables.md"
❌ "Refactor le ui-kit pour utiliser des variables CSS"
```

### ✅ Donner du contexte métier court mais précis

L'assistant connaît la stack (`.cursorrules`), pas ton intention.

```
✅ "Crée la feature tablet-bindings (ADR-0016). Permission : technician. Vit dans care-suite."
❌ "Crée un truc pour les tablettes"
```

### ✅ Demander confirmation avant gros refactor

Pour les changements > 5 fichiers, demander un plan avant le code :

```
"Avant de coder, donne-moi le plan de migration : quels fichiers tu vas toucher, dans quel ordre, et pourquoi."
```

### ✅ Vérifier la Definition of Done après livraison

Les fichiers de tâche listent une DoD précise. Demander :

```
"Confirme la Definition of Done de T04 point par point. Pour chaque ✅, montre-moi la preuve (commande exécutée, fichier modifié)."
```

### ✅ Demander des explications quand l'assistant fait des choix

```
"Tu as utilisé `bg-success` au lieu de `bg-primary` pour le badge active. Pourquoi ?"
```

L'assistant doit pouvoir justifier ses choix par référence aux ADR ou aux principes du `.cursorrules`.

---

## 🚫 Anti-patterns à éviter

### ❌ "Fais-moi un truc rapide"

L'assistant va aller vite, mais le code finira en prod médicale. Demande la qualité même pour les tickets urgents.

### ❌ Demander de "skipper" les conventions

```
❌ "Pas grave si tu hardcode #00C896, c'est juste un POC"
```

Si c'est vraiment juste un POC qui sera jeté, dis-le explicitement avec un commentaire dans le code. Mais ne demande **jamais** de violer les règles non négociables (couleurs, tenant_id, OpenAPI, must_change_password, audit).

### ❌ Coller du code obsolète sans contexte

Si tu copies du code d'un projet précédent ou d'un tutoriel, **précise-le** :

```
"Voici un exemple de code que j'ai trouvé en ligne. Adapte-le aux conventions CareIN sans copier les hardcoding."
```

Sinon l'assistant va peut-être adopter les patterns du code collé sans réaliser qu'ils violent les règles.

### ❌ Demander à l'assistant de modifier le `.cursorrules` sans process

Le `.cursorrules` est versionné, lu par toute l'équipe. **Pour le modifier** : créer une PR de revue, validée par 1 senior minimum.

```
❌ "Modifie le .cursorrules pour autoriser les couleurs Tailwind palette"
✅ "Je veux proposer une modification du .cursorrules. Voici ma proposition. Est-ce qu'elle se justifie ? Quels ADR seraient impactés ?"
```

---

## 🛠️ Ajouter un nouveau template de tâche

Si une tâche revient régulièrement (ex: "ajouter un module BC", "intégrer un device IoT"), créer un template dans `docs/prompts/tasks/`.

**Format** :

```markdown
# T<NN> ou template-<nom> — <Titre>

> **Type** : <Refactoring | Création | Setup | ...>
> **Phase** : <0-3 ou N/A>
> **Estimation** : <X jours>
> **Profil idéal** : <description>

## 🎯 Objectif
...

## 📋 Pré-requis
...

## 🚦 Tâches qui dépendent de cette tâche
...

## 📦 Livrables
...

## ✅ Definition of Done
...

## 🚧 Pièges à éviter
...

## 🔗 Documents de référence
...

## 💡 Prompt suggéré pour l'IDE
> "Exécute <tache> selon la spec dans docs/prompts/tasks/<file>.md..."
```

Soumettre via PR pour validation.

---

## 🎓 Cheatsheet : 10 commandes les plus utiles

### 1. Démarrer une tâche de roadmap
```
Exécute T01 selon docs/prompts/tasks/T01-setup-monorepo.md
```

### 2. Créer une feature
```
Crée la feature <name>. Suis docs/prompts/tasks/template-create-feature.md
```

### 3. Refactor un fichier en respectant les règles
```
Refactor ce fichier pour respecter les conventions du .cursorrules :
[fichier]
```

### 4. Review d'un PR
```
Review ces changements en checkant les ADR concernés :
[diff ou fichiers]
```

### 5. Génération d'une UI
```
Design une page <name> avec [contraintes UX]. Standards UX/UI Pro Max.
```

### 6. Vérification d'isolation
```
Écris les tests d'isolation cross-BO et cross-Tenant pour la feature <name>
```

### 7. Vérification couleurs hardcodées
```
Cherche tous les hardcoding de couleur dans <fichier ou dossier>. Liste avec le mapping cible.
```

### 8. Migration d'imports
```
Migre tous les imports de @/components/ui/* vers @carein/ui-kit dans <dossier>
```

### 9. Question architecturale
```
Quel ADR couvre <sujet> ? Comment l'appliquer dans le cas suivant : [contexte]
```

### 10. Génération de mocks
```
Génère des mocks réalistes pour la feature <name> avec 5-10 entrées variées
```

---

## 🆘 Quand l'assistant fait n'importe quoi

Si tu vois :

- **Couleurs hardcodées dans la sortie** → "Tu as oublié la règle .cursorrules sur les couleurs. Refais avec des classes sémantiques uniquement."
- **`fetch()` direct dans le code** → "On utilise `@carein/api-client`. Reprends en utilisant le client typé."
- **`as any` dans le code** → "Tu as utilisé `as any`. Le `.cursorrules` interdit. Trouve un narrowing typé propre."
- **Logique métier côté front** → "Cette logique doit vivre côté backend Laravel selon ADR-0006/0017. Reprends côté backend, le front affiche juste."
- **Pas de tests d'isolation** → "Ajoute les tests d'isolation cross-BO et cross-Tenant. Ils sont bloquants en CI selon ADR-0001/0002."

L'assistant doit corriger en s'auto-référençant aux règles. Si ça se reproduit, **mettre à jour le `.cursorrules`** pour insister sur le point.

---

## 📞 Support et questions

- **Questions techniques sur le projet** : voir `docs/adr/` et `docs/coordination/`
- **Questions sur les prompts** : voir ce guide ou `docs/prompts/`
- **Bug dans le `.cursorrules`** : ouvrir une issue avec le tag `dx`

---

## 📝 Évolution du système de prompts

Ce système est **vivant** :

- Chaque sprint, l'équipe peut proposer des améliorations
- Les nouveaux ADR doivent être référencés dans le `.cursorrules`
- Les patterns récurrents méritent un nouveau template

**Cycle de mise à jour** :
1. Détecter un manque (PR review qui revient sur le même sujet)
2. Proposer une modification (PR du fichier concerné)
3. Validation par 1 senior
4. Communication équipe (Slack)
5. Mise à jour effective

---

## ✅ Checklist d'onboarding nouveau dev

Quand un nouveau dev rejoint l'équipe :

- [ ] Cloner le repo
- [ ] `pnpm install` à la racine
- [ ] Lire `README.md`
- [ ] Lire `CONTRIBUTING.md`
- [ ] Lire ce guide (`docs/prompts/guides/usage-guide.md`)
- [ ] Setup `.cursorrules` dans son IDE
- [ ] Lire au minimum les ADR 0001, 0003, 0006, 0017
- [ ] Faire une petite PR test sur un fichier non critique pour valider le workflow
- [ ] Pair-programming avec un dev senior pour valider les conventions

Délai cible d'onboarding : **2 jours** pour être productif.
