# T04 — Extraction des composants `ui/` vers `packages/ui-kit/`

> **Type** : Refactoring / Architecture
> **Phase** : 1 — ui-kit propre
> **Estimation** : 1 jour
> **Profil idéal** : Frontend / design system

---

## 🎯 Objectif

Sortir les 8 composants de `apps/care-suite/src/components/ui/` vers un package partagé `@carein/ui-kit`. **Aucune modification du code des composants à cette étape** — juste un déplacement et une réorganisation des imports.

Le refactor des couleurs hardcodées vient en T06, **pas ici**.

---

## 📋 Pré-requis

- ✅ T02 livré (front migré dans `apps/care-suite/`)
- ✅ Le front fonctionne en local (`pnpm --filter @carein/care-suite dev`)

---

## 🚦 Tâches qui dépendent de T04

- **T06** — Refactor des composants ui-kit pour utiliser CSS variables
- **T11** — Création carein-suite (qui consommera ui-kit)

---

## 📦 Livrables

### 1. Création du package `@carein/ui-kit`

```
packages/ui-kit/
├── src/
│   ├── components/
│   │   ├── badge.tsx              ← copié depuis apps/care-suite, sans modif
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── data-table.tsx
│   │   ├── input.tsx
│   │   ├── metric-card.tsx
│   │   ├── risk-gauge.tsx
│   │   └── skeleton.tsx
│   ├── lib/
│   │   └── cn.ts                  ← copié depuis apps/care-suite/src/lib/utils.ts
│   └── index.ts                   ← exports publics
├── package.json
├── tsconfig.json
└── README.md
```

#### `packages/ui-kit/package.json`

```json
{
  "name": "@carein/ui-kit",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.400.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@carein/eslint-config": "workspace:*",
    "@carein/tsconfig": "workspace:*",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.0"
  }
}
```

#### `packages/ui-kit/tsconfig.json`

```json
{
  "extends": "@carein/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

#### `packages/ui-kit/src/index.ts`

```typescript
// Components
export { Badge } from './components/badge'
export type { BadgeProps } from './components/badge'

export { Button } from './components/button'
export type { ButtonProps } from './components/button'

export { Card, CardHeader, CardTitle } from './components/card'

export { DataTable, Pagination } from './components/data-table'
export type { Column } from './components/data-table'

export { Input } from './components/input'
export type { InputProps } from './components/input'

export { MetricCard } from './components/metric-card'
export type { MetricCardProps } from './components/metric-card'

export { RiskGauge } from './components/risk-gauge'
export type { RiskGaugeProps } from './components/risk-gauge'

export { Skeleton, SkeletonCard, SkeletonTable } from './components/skeleton'

// Utilities
export { cn } from './lib/cn'
```

#### `packages/ui-kit/src/lib/cn.ts`

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### `packages/ui-kit/README.md`

```markdown
# @carein/ui-kit

Composants UI génériques partagés entre `care-suite` et `carein-suite`.

## ⚠️ Règles

- **Pas de logique métier** dans ces composants
- **Pas de couleur hardcodée** (à partir de T06) — uniquement des classes Tailwind sémantiques
- **Pas de dépendance** vers `apps/*` ou autres packages métier

## Composants disponibles

| Composant | Description |
|-----------|-------------|
| `Badge` | Badge sémantique (active, completed, anomaly, critical, ...) |
| `Button` | Bouton avec variants (primary, secondary, outline, ghost, danger) et sizes (sm, md, lg) |
| `Card`, `CardHeader`, `CardTitle` | Cartes pour grouper du contenu |
| `DataTable<T>` | Tableau générique typé avec pagination |
| `Input` | Champ avec label et error inline (RHF compatible) |
| `MetricCard` | Carte métrique pour dashboard |
| `RiskGauge` | Jauge circulaire de score de risque clinique |
| `Skeleton`, `SkeletonCard`, `SkeletonTable` | États de chargement |

## Usage

\`\`\`typescript
import { Button, Card, useTheme } from '@carein/ui-kit'

function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Action</Button>
    </Card>
  )
}
\`\`\`
```

### 2. Déclaration du package dans `apps/care-suite/package.json`

```json
{
  "name": "@carein/care-suite",
  "private": true,
  "dependencies": {
    "@carein/ui-kit": "workspace:*",
    "next": "...",
    "react": "...",
    "react-dom": "...",
    // ... le reste inchangé
  }
}
```

### 3. Refactoring des imports dans `apps/care-suite/src/`

Remplacer **systématiquement** dans tous les fichiers :

```typescript
// AVANT
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, Column, Pagination } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { MetricCard } from '@/components/ui/metric-card'
import { RiskGauge } from '@/components/ui/risk-gauge'
import { Skeleton, SkeletonCard, SkeletonTable } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
```

```typescript
// APRÈS
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  Pagination,
  Input,
  MetricCard,
  RiskGauge,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  cn,
  type Column,
} from '@carein/ui-kit'
```

**Script suggéré pour le refactor** (à utiliser avec précaution, vérifier avant commit) :

```bash
# Liste des fichiers à modifier
cd apps/care-suite/src
grep -rln "from '@/components/ui/" --include="*.tsx" --include="*.ts" | sort -u
```

Faire les remplacements **fichier par fichier** avec un éditeur multi-curseur, puis vérifier avec `pnpm typecheck` que rien n'est cassé.

### 4. Suppression de `apps/care-suite/src/components/ui/`

Une fois tous les imports refactorés :

```bash
cd apps/care-suite/src
rm -rf components/ui/
# Le fichier lib/utils.ts qui contenait cn() est aussi supprimé
# (le cn est maintenant exporté depuis ui-kit)
```

⚠️ **Attention** : `apps/care-suite/src/lib/utils.ts` contient potentiellement d'autres utilitaires que `cn`. Vérifier avant suppression. Si autre chose s'y trouve, garder le fichier mais retirer juste `cn`.

### 5. Validation

```bash
# 1. Reinstaller pour que pnpm linke ui-kit
pnpm install

# 2. Typecheck
pnpm --filter @carein/care-suite typecheck
# Doit dire OK. Si erreurs sur des imports : refactor manquant quelque part.

# 3. Lint
pnpm --filter @carein/care-suite lint

# 4. Lancer le dev
pnpm --filter @carein/care-suite dev

# 5. Naviguer dans toutes les pages — l'UI doit être STRICTEMENT IDENTIQUE
#    (mêmes couleurs ASA TECH vert, même apparence)
```

---

## ✅ Definition of Done

- [ ] Package `@carein/ui-kit` créé avec les 8 composants
- [ ] `packages/ui-kit/src/index.ts` exporte les composants et types
- [ ] `packages/ui-kit/README.md` documente le package
- [ ] `apps/care-suite/package.json` déclare la dépendance `@carein/ui-kit`
- [ ] **Tous les imports** de `@/components/ui/*` ont été remplacés par `@carein/ui-kit`
- [ ] `apps/care-suite/src/components/ui/` n'existe plus
- [ ] `pnpm typecheck` passe
- [ ] `pnpm lint` passe (warnings acceptables, errors non)
- [ ] `pnpm --filter @carein/care-suite dev` lance le front qui fonctionne **identiquement** à avant
- [ ] **Test visuel** : naviguer dans toutes les pages, vérifier qu'aucune régression visuelle
- [ ] PR ouverte avec checklist de pages testées
- [ ] Code review par un autre dev

---

## 🚧 Pièges à éviter

### ❌ Modifier le code des composants pendant l'extraction

T04 = **déplacement seul**. Aucun refactor de logique ou de styles. Le refactor des couleurs vient en T06.

Si tu as l'envie de "tant qu'on y est, je nettoie un peu", **stop**. Crée une issue séparée.

### ❌ Oublier des imports

Avec un grep complet `grep -rln "from '@/components/ui/"` tu trouves tous les fichiers. Mais attention aux **imports indirects** :

```typescript
// Ce fichier ne match pas le grep, mais en utilise quand même
import { Button } from '@/components/ui'   // import depuis le dossier !
```

Vérifier aussi les fichiers `index.ts` éventuels dans `components/ui/`.

### ❌ Casser le `cn()` utility

`cn()` était dans `@/lib/utils`. Il est maintenant dans `@carein/ui-kit`. Tous les fichiers qui font `import { cn } from '@/lib/utils'` doivent maintenant faire `import { cn } from '@carein/ui-kit'`.

Vérifier : `grep -rln "from '@/lib/utils'" apps/care-suite/src/` → tous ces fichiers doivent migrer.

### ❌ Casser le `tailwind.config.ts`

Le `tailwind.config.ts` de care-suite doit maintenant scanner aussi le contenu de `ui-kit` :

```typescript
// apps/care-suite/tailwind.config.ts
export default {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui-kit/src/**/*.{ts,tsx}',  // ← AJOUTER
  ],
  // ...
}
```

Sans ça, les classes Tailwind utilisées dans ui-kit ne sont pas générées et les composants apparaissent unstyled.

### ❌ Oublier les types exportés

`Column<T>` et autres types génériques doivent être exportés avec `export type`. Sinon TypeScript ne les voit pas dans les apps consommatrices.

```typescript
// ✅ Bon
export type { Column } from './components/data-table'

// ❌ Manqué
export { Column } from './components/data-table'  // Column est un type, ça fail
```

### ❌ Ne pas tester visuellement

L'erreur classique : tout passe au typecheck, mais visuellement quelque chose a cassé (Tailwind config, peer deps React mal résolu, etc.). **Toujours lancer le dev et naviguer dans les pages**.

---

## 🔗 Documents de référence

- [`docs/roadmap/option-c-monorepo-ui-kit-refactor.md`](../../roadmap/option-c-monorepo-ui-kit-refactor.md) — vue T04
- [`docs/adr/0003-frontend-separation-monorepo.md`](../../adr/0003-frontend-separation-monorepo.md) — ADR-0003

---

## 💡 Prompt suggéré pour l'IDE

> "Exécute T04 (extraction ui-kit) selon la spec dans `docs/prompts/tasks/T04-extraction-ui-kit.md`.
>
> Étapes :
> 1. Crée `packages/ui-kit/` avec sa structure (package.json, tsconfig.json, README.md, src/components/, src/lib/, src/index.ts)
> 2. Copie les 8 composants depuis `apps/care-suite/src/components/ui/` vers `packages/ui-kit/src/components/` SANS MODIFIER LE CODE
> 3. Copie `cn` depuis `apps/care-suite/src/lib/utils.ts` vers `packages/ui-kit/src/lib/cn.ts`
> 4. Refactor tous les imports dans `apps/care-suite/src/` pour utiliser `@carein/ui-kit`
> 5. Supprime `apps/care-suite/src/components/ui/`
> 6. Mets à jour `apps/care-suite/tailwind.config.ts` pour scanner ui-kit
> 7. Lance `pnpm install` puis `pnpm --filter @carein/care-suite typecheck`
> 8. Confirme la Definition of Done point par point
>
> NE MODIFIE PAS LE CODE DES COMPOSANTS. Le refactor des couleurs vient en T06."
