# T01 — Setup monorepo Turborepo + pnpm workspaces

> **Type** : Infrastructure / Setup
> **Phase** : 0 — Fondations monorepo
> **Estimation** : 1 jour
> **Profil idéal** : Senior fullstack (lead frontend ou DevOps)

---

## 🎯 Objectif

Créer la structure monorepo vide qui accueillera les apps (`care-suite`, `carein-suite`) et les packages partagés (`ui-kit`, `theme-engine`, etc.). À la fin de cette tâche, l'équipe peut cloner le repo et lancer `pnpm install` sans erreur.

**Cette tâche ne touche AUCUN code applicatif.** C'est uniquement de la fondation infrastructure.

---

## 📋 Pré-requis

- ✅ Aucune dépendance bloquante (c'est la première tâche)
- ✅ Node 20 LTS installé
- ✅ pnpm 9+ installé globalement (`npm install -g pnpm`)
- ✅ Accès écriture au repo Git (privilèges admin pour créer le repo si besoin)

---

## 🚦 Tâches qui dépendent de T01

- **T02** (migration care-suite) — bloquée tant que la structure n'existe pas
- **T03** (CI/CD) — peut commencer en parallèle dès que T01 est livré
- **T04** (extraction ui-kit) — bloquée
- **T05** (tailwind-preset) — peut commencer en parallèle dès que T01 est livré

---

## 📦 Livrables

### 1. Structure de dossiers

```
carein-platform/                    ← repo Git (nouveau ou réutilisé)
├── apps/                           ← VIDE pour l'instant
├── packages/                       ← VIDE pour l'instant
├── tools/
│   ├── eslint-config/
│   │   ├── package.json
│   │   ├── index.js
│   │   └── README.md
│   └── tsconfig/
│       ├── package.json
│       ├── base.json
│       └── README.md
├── .github/                        ← workflows à compléter en T03
├── docs/                           ← déjà existant, à reprendre
├── package.json                    ← scripts globaux
├── pnpm-workspace.yaml             ← config workspaces
├── turbo.json                      ← config Turborepo
├── .gitignore
├── .nvmrc                          ← contient "20"
├── .npmrc
├── README.md
└── CONTRIBUTING.md
```

### 2. Fichiers de configuration

#### `/package.json` (racine)

```json
{
  "name": "carein-platform",
  "private": true,
  "version": "0.0.1",
  "description": "CareIN Platform — Multi-tenant medical platform",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint -- --fix",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "prettier": "^3.3.0",
    "typescript": "^5.5.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

#### `/pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

#### `/turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "env": ["NEXT_PUBLIC_*"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

#### `/.gitignore`

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
.next/
.turbo/
dist/
out/
build/

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
*.lcov

# Misc
*.tsbuildinfo
```

#### `/.nvmrc`

```
20
```

#### `/.npmrc`

```
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false
```

#### `/tools/tsconfig/base.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Base CareIN config",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    "skipLibCheck": true,
    "incremental": true,

    "jsx": "preserve",
    "allowJs": true
  },
  "exclude": ["node_modules", "dist", ".next", "build"]
}
```

#### `/tools/tsconfig/package.json`

```json
{
  "name": "@carein/tsconfig",
  "version": "0.0.1",
  "private": true,
  "files": ["base.json"]
}
```

#### `/tools/eslint-config/package.json`

```json
{
  "name": "@carein/eslint-config",
  "version": "0.0.1",
  "private": true,
  "main": "./index.js",
  "dependencies": {
    "eslint": "^9.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

#### `/tools/eslint-config/index.js`

```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: false,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  settings: {
    react: { version: 'detect' },
  },
}
```

#### `/README.md`

```markdown
# CareIN Platform

Plateforme médicale connectée multi-tenant en marque blanche.

## 🚀 Démarrage rapide

### Pré-requis

- Node 20 LTS (`nvm use` si nvm installé)
- pnpm 9+ (`npm install -g pnpm`)

### Installation

\`\`\`bash
git clone https://github.com/carein/platform.git
cd platform
pnpm install
\`\`\`

### Commandes principales

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lance toutes les apps en mode dev |
| `pnpm --filter @carein/care-suite dev` | Lance uniquement Care Suite |
| `pnpm --filter @carein/carein-suite dev` | Lance uniquement CareIN Suite |
| `pnpm build` | Build toutes les apps en production |
| `pnpm lint` | Lint tout le monorepo |
| `pnpm typecheck` | TypeCheck tout le monorepo |
| `pnpm test` | Tests tout le monorepo |

## 📁 Structure

\`\`\`
apps/
├── care-suite/         # Backoffice marque-blanchable (BO + Tenants)
└── carein-suite/       # Cockpit interne CareIN

packages/
├── ui-kit/             # Composants UI partagés
├── theme-engine/       # Theming runtime
├── tenancy/            # Contexte BO/Tenant
├── api-client/         # Client HTTP typé depuis OpenAPI
├── fhir-types/         # Types FHIR
└── domain-rules/       # Règles métier partageables

tools/
├── eslint-config/      # Config ESLint partagée
├── tsconfig/           # Configs TypeScript de base
└── tailwind-preset/    # Preset Tailwind

docs/
├── adr/                # Architectural Decision Records
├── coordination/       # Documents de coordination
├── roadmap/            # Roadmap d'exécution
├── api/                # OpenAPI spec
└── prompts/            # Prompts IDE + tâches
\`\`\`

## 📚 Documentation

- [ADR (Architectural Decision Records)](./docs/adr/README.md) — décisions structurantes
- [Roadmap Option C](./docs/roadmap/option-c-monorepo-ui-kit-refactor.md) — plan d'exécution
- [Convention de contribution](./CONTRIBUTING.md) — règles pour contribuer

## 🤝 Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) avant de soumettre une PR.
```

#### `/CONTRIBUTING.md`

```markdown
# Contributing to CareIN Platform

## Conventions de PR

- **Branche** : `feature/T<NN>-description-courte` ou `fix/issue-NNN-description`
- **Commits** : format Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`)
- **Taille** : max 500 lignes par PR. Au-delà, découper.
- **Review** : minimum 1 review par un autre dev avant merge
- **CI** : tous les jobs CI doivent passer avant merge

## Convention de code

Voir le fichier `.cursorrules` à la racine pour les règles complètes.

Règles non négociables :

1. Pas de couleur hardcodée (cf. ADR-0006)
2. Pas de `fetch()` direct (cf. ADR-0008)
3. Pas de "ASA TECH" en dur (cf. ADR-0004)
4. Imports via `index.ts` jamais en profondeur
5. Annotations OpenAPI obligatoires sur tout nouveau controller
```

### 3. Initialisation Git

```bash
# Si nouveau repo
cd carein-platform
git init
git add .
git commit -m "chore(monorepo): initial setup with pnpm workspaces and Turborepo"
git branch -M main
git remote add origin https://github.com/carein/platform.git
git push -u origin main

# Si repo existant à reconvertir
# (commande à adapter selon contexte, idéalement avec backup avant)
```

### 4. Validation locale

```bash
# Vérifier que tout fonctionne
cd carein-platform
pnpm install
pnpm turbo run lint   # Doit dire "no projects affected" (rien à linter encore)
pnpm turbo run typecheck   # Idem

# Vérifier la structure
ls apps/        # → vide
ls packages/    # → vide
ls tools/       # → eslint-config, tsconfig
```

---

## ✅ Definition of Done

- [ ] Repo Git créé et poussé
- [ ] `pnpm install` à la racine fonctionne sans erreur
- [ ] `pnpm turbo run lint` ne plante pas (même si rien à linter)
- [ ] `pnpm turbo run typecheck` ne plante pas
- [ ] Le README guide un nouveau dev en 5 minutes
- [ ] `.gitignore` couvre les artefacts de build
- [ ] `.nvmrc` et `.npmrc` présents
- [ ] Tools `eslint-config` et `tsconfig` créés mais minimaux
- [ ] CONTRIBUTING.md référence `.cursorrules`

---

## 🚧 Pièges à éviter

### ❌ Mélanger npm et pnpm

Si quelqu'un fait `npm install` au lieu de `pnpm install`, les `node_modules` sont structurés différemment et les workspaces cassent.

**Mitigation** : ajouter `"engines": { "pnpm": ">=9.0.0" }` dans `package.json` racine. Ajouter dans `.npmrc` :

```
engine-strict=true
```

### ❌ Oublier `auto-install-peers`

Sans ça, certains packages (React, Next.js) qui ont des peerDependencies ne fonctionnent pas. Présent dans le `.npmrc` proposé.

### ❌ Mettre Node 22 ou Node 21

Ces versions ne sont pas LTS au moment de l'écriture. Bugs potentiels avec Next.js, Tailwind v4. **Rester sur Node 20 LTS**.

### ❌ Activer le mode "shamefully-hoist"

Ça simule npm mais casse l'isolation des packages. **Le laisser à `false`** dans `.npmrc`.

### ❌ Oublier d'exclure `.turbo/` du Git

C'est un cache local qui ne doit pas être versionné. Présent dans `.gitignore`.

---

## 🔗 Documents de référence

- [`docs/roadmap/option-c-monorepo-ui-kit-refactor.md`](../../roadmap/option-c-monorepo-ui-kit-refactor.md) — vue d'ensemble Option C
- [`docs/adr/0003-frontend-separation-monorepo.md`](../../adr/0003-frontend-separation-monorepo.md) — ADR-0003 monorepo
- [Turborepo docs](https://turbo.build/repo/docs)
- [pnpm workspaces docs](https://pnpm.io/workspaces)

---

## 💡 Prompt suggéré pour l'IDE

Si tu utilises Cursor/Windsurf et que tu veux exécuter cette tâche :

> "Exécute T01 (setup monorepo Turborepo) selon la spec dans `docs/prompts/tasks/T01-setup-monorepo.md`. Crée tous les fichiers à la racine du repo. Lance ensuite `pnpm install` pour vérifier que tout fonctionne. Confirme la Definition of Done point par point."
