# T06 — Refactor des 8 composants ui-kit → CSS variables

> **Type** : Refactoring critique
> **Phase** : 1 — ui-kit propre
> **Estimation** : 2 jours (1 dev) ou 1 jour (2 devs en parallèle)
> **Profil idéal** : Frontend / design system

---

## 🎯 Objectif

**La tâche la plus importante de Phase 1.** Réécrire les 8 composants `ui-kit` pour qu'ils n'utilisent **AUCUNE** couleur hardcodée. Toutes les couleurs passent par les classes Tailwind sémantiques (`bg-primary`, `text-success`, etc.) qui résolvent vers des CSS variables.

À la fin, **changer les CSS variables dans le navigateur (DevTools) doit changer instantanément l'apparence de tous les composants** — c'est le test final.

---

## 📋 Pré-requis

- ✅ T04 livré (composants dans `packages/ui-kit/`)
- ✅ T05 livré (`@carein/tailwind-preset` disponible avec les CSS variables sémantiques)

---

## 🚦 Tâches qui dépendent de T06

- **T07** — ESLint custom rule no-hardcoded-colors (peut activer en error une fois T06 terminé)
- **T08** — theme-engine (consomme ui-kit propre)
- **T10** — Refactor care-suite layouts (consomme ui-kit propre)
- **T11** — carein-suite (consomme ui-kit propre)

**T06 est le goulot d'étranglement de Phase 1.** Tant que pas livré, T08/T10/T11 peuvent commencer en mode mock mais ne peuvent pas finaliser.

---

## 📦 Livrables

### Mapping global des couleurs

Avant de toucher aux composants, **fixer la table de correspondance** suivante (utilisée par tous les composants) :

| Couleur hex actuelle | Signification | Classe Tailwind cible | CSS variable |
|----------------------|---------------|----------------------|--------------|
| `#00C896` (vert ASA) | Couleur primaire de marque | `primary` / `bg-primary` / `text-primary` | `var(--color-primary)` |
| `#00a87e` (vert foncé) | Hover de la primaire | `primary-hover` / `hover:bg-primary-hover` | `var(--color-primary-hover)` |
| `#1A6FD4` (bleu) | Couleur d'accent | `accent` / `bg-accent` / `text-accent` | `var(--color-accent)` |
| `#155bb5` (bleu foncé) | Hover de l'accent | `hover:bg-accent/90` | (calc via opacity) |
| `#F5A623` (orange) | Statut warning sémantique | `warning` / `bg-warning` / `text-warning` | `var(--color-warning)` |
| `#E85050` (rouge) | Statut danger sémantique | `danger` / `bg-danger` / `text-danger` | `var(--color-danger)` |
| `#c93c3c` (rouge foncé) | Hover du danger | `hover:bg-danger/90` | (calc via opacity) |
| `text-foreground` | Texte principal | déjà `foreground` | `var(--color-foreground)` |
| `var(--surface)` | Fond de carte | `surface` / `bg-surface` | `var(--color-surface)` |
| `var(--border)` | Bordures | `border` / `border-border` | `var(--color-border)` |

### Composant 1 — `button.tsx`

#### Avant

```typescript
const variants: Record<Variant, string> = {
  primary: 'bg-[#00C896] hover:bg-[#00a87e] text-white',
  secondary: 'bg-[#1A6FD4] hover:bg-[#155bb5] text-white',
  outline: 'border border-[#00C896] text-[#00C896] hover:bg-[#00C896]/10',
  ghost: 'text-foreground hover:bg-black/5 dark:hover:bg-white/5',
  danger: 'bg-[#E85050] hover:bg-[#c93c3c] text-white',
}
```

#### Après

```typescript
const variants: Record<Variant, string> = {
  primary: 'bg-primary hover:bg-primary-hover text-primary-foreground',
  secondary: 'bg-accent hover:bg-accent/90 text-accent-foreground',
  outline: 'border border-primary text-primary hover:bg-primary/10',
  ghost: 'text-foreground hover:bg-foreground/5',
  danger: 'bg-danger hover:bg-danger/90 text-danger-foreground',
}
```

**Notes** :
- `text-white` → `text-primary-foreground` (peut être blanc OU noir selon la primaire choisie par le BO)
- `hover:bg-black/5 dark:hover:bg-white/5` → `hover:bg-foreground/5` (suffit, fonctionne en light et dark)

### Composant 2 — `badge.tsx`

#### Avant

```typescript
const variants: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  planned: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  active: 'bg-[#00C896]/15 text-[#00C896]',
  completed: 'bg-[#1A6FD4]/15 text-[#1A6FD4]',
  anomaly: 'bg-[#F5A623]/15 text-[#F5A623]',
  critical: 'bg-[#E85050]/15 text-[#E85050]',
  pending: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  in_progress: 'bg-[#1A6FD4]/15 text-[#1A6FD4]',
}
```

#### Après

```typescript
const variants: Record<BadgeVariant, string> = {
  default: 'bg-muted text-muted-foreground',
  planned: 'bg-muted text-muted-foreground',
  active: 'bg-success/15 text-success',
  completed: 'bg-accent/15 text-accent',
  anomaly: 'bg-warning/15 text-warning',
  critical: 'bg-danger/15 text-danger',
  pending: 'bg-muted text-muted-foreground',
  in_progress: 'bg-accent/15 text-accent',
}
```

**Choix sémantique important** :
- `active` est mappé sur `success` (vert sémantique), pas `primary` (couleur de marque)
- Cohérence : un badge "active" reste vert même si la primaire devient orange chez MEDIKAS

### Composant 3 — `input.tsx`

#### Avant (extraits)

```typescript
'bg-[var(--surface)] border-[var(--border)]',
'focus:outline-none focus:ring-2 focus:ring-[#00C896]/30 focus:border-[#00C896]',
error && 'border-[#E85050] focus:ring-[#E85050]/30',
{error && <p className="text-xs text-[#E85050]">{error}</p>}
```

#### Après

```typescript
'bg-surface border-border',
'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
error && 'border-danger focus:ring-danger/30',
{error && <p className="text-xs text-danger">{error}</p>}
```

### Composant 4 — `risk-gauge.tsx`

C'est le composant le plus subtil parce qu'il utilise les couleurs **dans des SVG** (impossible avec Tailwind, doit passer par `style={{ stroke: ... }}`).

#### Avant

```typescript
function getRiskLabel(score: number): { label: string; color: string } {
  if (score < 25) return { label: 'Faible', color: '#00C896' }
  if (score < 50) return { label: 'Modéré', color: '#F5A623' }
  if (score < 75) return { label: 'Élevé', color: '#F5A623' }
  return { label: 'Critique', color: '#E85050' }
}
```

#### Après

```typescript
type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'

const RISK_CONFIG: Record<RiskLevel, { label: string; cssVar: string; className: string }> = {
  low:      { label: 'Faible',   cssVar: 'var(--color-success)', className: 'text-success' },
  moderate: { label: 'Modéré',   cssVar: 'var(--color-warning)', className: 'text-warning' },
  high:     { label: 'Élevé',    cssVar: 'var(--color-warning)', className: 'text-warning' },
  critical: { label: 'Critique', cssVar: 'var(--color-danger)',  className: 'text-danger' },
}

function getRiskLevel(score: number): RiskLevel {
  if (score < 25) return 'low'
  if (score < 50) return 'moderate'
  if (score < 75) return 'high'
  return 'critical'
}

// Dans le composant :
const level = getRiskLevel(normalized)
const { label, cssVar, className } = RISK_CONFIG[level]

// Pour le SVG circle :
<circle stroke={cssVar} ... />

// Pour le texte :
<span className={cn(className, 'absolute inset-0 ...')}>{normalized}</span>
<span className={cn('text-xs font-semibold', className)}>{label}</span>
```

**Important** : pour les SVG, on garde `style={{ stroke: cssVar }}` — c'est le seul cas où on utilise une CSS variable directement (impossible de passer par Tailwind).

### Composant 5 — `metric-card.tsx`

#### Avant

```typescript
type MetricCardProps = {
  // ...
  iconColor?: string  // attend un hex code
}

export function MetricCard({ iconColor = '#00C896', ... }) {
  return (
    <Card>
      <span style={{ background: `${iconColor}18`, color: iconColor }}>
        <Icon size={16} />
      </span>
      {/* ... */}
      <p className={cn('text-xs font-medium', trend.value >= 0 ? 'text-[#00C896]' : 'text-[#E85050]')}>
        {/* ... */}
      </p>
    </Card>
  )
}
```

#### Après

```typescript
type MetricColorScheme = 'primary' | 'accent' | 'success' | 'warning' | 'danger'

type MetricCardProps = {
  // ...
  colorScheme?: MetricColorScheme  // par défaut 'primary'
}

const COLOR_CONFIG: Record<MetricColorScheme, { bg: string; text: string; trend: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', trend: 'text-success' },
  accent:  { bg: 'bg-accent/10',  text: 'text-accent',  trend: 'text-success' },
  success: { bg: 'bg-success/10', text: 'text-success', trend: 'text-success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', trend: 'text-warning' },
  danger:  { bg: 'bg-danger/10',  text: 'text-danger',  trend: 'text-danger' },
}

export function MetricCard({ colorScheme = 'primary', trend, ... }) {
  const colors = COLOR_CONFIG[colorScheme]
  return (
    <Card>
      <span className={cn('w-8 h-8 rounded-[8px] flex items-center justify-center', colors.bg, colors.text)}>
        <Icon size={16} />
      </span>
      {/* ... */}
      {trend && (
        <p className={cn('text-xs font-medium', trend.value >= 0 ? 'text-success' : 'text-danger')}>
          {/* ... */}
        </p>
      )}
    </Card>
  )
}
```

**Breaking change** : la prop `iconColor` (string) devient `colorScheme` (enum sémantique). Il faut adapter les usages dans `apps/care-suite` (au moins 6 endroits dans le code actuel).

### Composant 6 — `card.tsx`

Déjà presque OK. Vérifier :

#### Avant

```typescript
'bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4',
```

#### Après

```typescript
'bg-surface border border-border rounded-card p-4',
```

(`rounded-card` est défini dans le preset Tailwind via `borderRadius.card: 'var(--radius-card)'`)

### Composant 7 — `data-table.tsx`

Déjà mostly OK. Vérifier :

#### Avant

```typescript
'border-b border-[var(--border)]',
```

#### Après

```typescript
'border-b border-border',
```

### Composant 8 — `skeleton.tsx`

Quasi rien à changer. `bg-foreground/8` est déjà bien (utilise une opacité d'une CSS variable). Vérifier :

#### Avant

```typescript
'animate-pulse rounded bg-foreground/8 dark:bg-white/8',
'bg-[var(--surface)] border border-[var(--border)]',
```

#### Après

```typescript
'animate-pulse rounded bg-foreground/8',
'bg-surface border border-border',
```

(Le `dark:bg-white/8` était redondant avec `bg-foreground/8` — le foreground change déjà selon le mode.)

---

## 🔄 Adaptation des consommateurs

Les composants qui consomment `MetricCard` avec l'ancienne API (`iconColor="#00C896"`) doivent être adaptés. Recherche :

```bash
grep -rln "iconColor=" apps/care-suite/src/
```

Remplacer :

```typescript
// AVANT
<MetricCard iconColor="#00C896" ... />
<MetricCard iconColor="#1A6FD4" ... />
<MetricCard iconColor="#F5A623" ... />

// APRÈS
<MetricCard colorScheme="primary" ... />
<MetricCard colorScheme="accent" ... />
<MetricCard colorScheme="warning" ... />
```

---

## ✅ Validation

### 1. Test visuel double-thème (CRITIQUE)

Lancer `pnpm --filter @carein/care-suite dev`. Ouvrir les DevTools navigateur. Modifier les CSS variables :

```css
/* Dans :root, override : */
--color-primary: #C75B12;          /* Orange MEDIKAS */
--color-primary-hover: #A04A0E;
--color-accent: #1B2A4E;
--color-success: #00C896;          /* Inchangé : success reste vert sémantique */
--color-warning: #F5A623;
--color-danger: #E85050;
```

**Résultat attendu** :
- Tous les boutons primary deviennent orange
- Les badges "active" restent verts (parce que sémantiquement `success`)
- Les badges "completed" deviennent bleu nuit (parce que `accent`)
- Le RiskGauge "Faible" reste vert (success), "Critique" reste rouge (danger)
- Les inputs ont leur ring de focus en orange

**Si quelque chose ne change pas alors qu'il le devrait** : il reste un hardcoding caché.

**Si quelque chose change alors qu'il ne devrait pas** (ex: badge "active" qui devient orange) : la classe sémantique est mal mappée.

### 2. Grep zéro tolérance

```bash
# Doit retourner 0 résultat (sauf les imports de lucide-react ou des commentaires)
grep -rn "#[0-9A-Fa-f]\{6\}" packages/ui-kit/src/

# Doit retourner 0 résultat
grep -rn "bg-\[#" packages/ui-kit/src/
grep -rn "text-\[#" packages/ui-kit/src/

# Doit retourner 0 résultat (couleurs Tailwind palette)
grep -rEn "(bg|text|border)-(red|blue|green|yellow|gray|amber|emerald|cyan|indigo|purple|pink|rose|orange)-[0-9]" packages/ui-kit/src/
```

### 3. Tests fonctionnels

```bash
pnpm --filter @carein/ui-kit typecheck
pnpm --filter @carein/care-suite typecheck
pnpm --filter @carein/care-suite build
pnpm --filter @carein/care-suite dev
```

### 4. Test de régression visuelle

Naviguer dans **toutes les pages** de Care Suite avec le thème ASA TECH par défaut :
- `/dashboard` — métriques, charts
- `/campaigns` — table, filtres, badges
- `/patients` — table avec BMI surpoids (warning)
- `/exams` — risk score (success/warning/danger)
- `/login` — RiskGauge si présent

Tout doit être **visuellement identique** à avant. Si screenshot avant/après fait, ils doivent être pixel-perfect.

---

## ✅ Definition of Done

- [ ] Les 8 composants ui-kit utilisent uniquement des classes Tailwind sémantiques
- [ ] `grep -rn "#[0-9A-Fa-f]\{6\}" packages/ui-kit/src/` retourne 0 résultats applicatifs
- [ ] `grep -rn "bg-\[#\|text-\[#" packages/ui-kit/src/` retourne 0 résultats
- [ ] Les consommateurs de `MetricCard` ont migré vers `colorScheme`
- [ ] Test visuel double-thème : changer CSS vars dans DevTools change instantanément les couleurs
- [ ] Test régression : ASA TECH voit son backoffice **identiquement** à avant
- [ ] Build production OK
- [ ] Code review par un autre dev avec checklist de pages testées
- [ ] PR ouverte avec captures d'écran avant/après pour les principales pages
- [ ] Mise à jour du `README.md` du package ui-kit avec la table des classes sémantiques disponibles

---

## 🚧 Pièges à éviter

### ❌ Mapper "active" sur `primary` au lieu de `success`

**MAUVAIS** : `active: 'bg-primary/15 text-primary'`

Ça veut dire que sur MEDIKAS (orange), un badge "active" devient orange. Sémantiquement faux : "active" est un statut sémantique vert, pas une couleur de marque.

**BON** : `active: 'bg-success/15 text-success'`

### ❌ Oublier `text-primary-foreground`

`text-white` est facile à hardcoder. Mais sur certains thèmes (ex: thème clair avec primaire jaune pâle), le blanc devient illisible. Toujours utiliser `text-primary-foreground` qui s'adapte.

### ❌ SVG avec classes Tailwind

Les attributs SVG `stroke`, `fill`, `stop-color` ne supportent pas les classes Tailwind. Toujours utiliser `style={{ stroke: 'var(--color-...)' }}`.

### ❌ Ne pas tester avec un thème exotique

Tester juste avec ASA TECH (le thème actuel) ne prouve rien. **Il faut absolument tester avec un thème radicalement différent** (orange MEDIKAS) pour révéler les hardcoding cachés.

### ❌ Casser l'API publique sans communiquer

Le breaking change `iconColor: string` → `colorScheme: enum` casse les usages existants. Documenter ce changement dans le CHANGELOG et le PR description.

### ❌ Toucher la logique métier "tant qu'on y est"

T06 = **refactor visuel uniquement**. Le calcul de score (`if score < 25`), les seuils, les conditions ne changent pas. Si l'envie te prend de "améliorer un peu", ouvre une issue séparée.

---

## 🔗 Documents de référence

- [`docs/roadmap/option-c-monorepo-ui-kit-refactor.md`](../../roadmap/option-c-monorepo-ui-kit-refactor.md) — vue T06
- [`docs/adr/0006-theming-runtime-cascade.md`](../../adr/0006-theming-runtime-cascade.md) — ADR-0006
- [`tools/tailwind-preset/README.md`](../../../tools/tailwind-preset/README.md) — liste des CSS variables sémantiques

---

## 💡 Prompt suggéré pour l'IDE

> "Exécute T06 (refactor ui-kit pour CSS variables) selon la spec dans `docs/prompts/tasks/T06-refactor-ui-kit-css-variables.md`.
>
> Étapes :
> 1. Vérifie que T05 est livré : `tools/tailwind-preset/index.js` exporte les classes sémantiques
> 2. Refactor les 8 composants un par un dans cet ordre : button, badge, input, risk-gauge, metric-card, card, data-table, skeleton
> 3. Pour chaque composant, suis le mapping documenté dans la spec
> 4. Adapte les consommateurs de MetricCard (breaking change iconColor → colorScheme)
> 5. Lance les vérifications grep zéro tolérance
> 6. Lance le test visuel double-thème (modifier CSS vars dans DevTools)
> 7. Confirme la Definition of Done point par point
>
> Règles strictes :
> - Pas de modification de la logique métier
> - Tester chaque composant en isolation avant de passer au suivant
> - Si tu doutes du mapping (ex: doit-on utiliser primary ou success ?), demande avant de faire."
