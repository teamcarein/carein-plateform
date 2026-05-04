# T11 — Création `apps/carein-suite/` (Next.js neuf, propre)

> **Type** : Création d'application + UX/UI Design Pro Max
> **Phase** : 3 — CareIN Suite + auth structurée
> **Estimation** : 2 jours (squelette) + features Sprint A en parallèle
> **Profil idéal** : Frontend / design system + UX

---

## 🎯 Objectif

Créer le **cockpit interne CareIN** sur des fondations 100% propres dès le départ. C'est l'outil utilisé par **toi (CTO) et l'équipe CareIN** pour gérer les Brand Operators, générer les invitations, faire de l'impersonation, consulter les audit logs cross-BO, etc.

À la fin de cette tâche, on a une **coquille fonctionnelle** avec :
- Login (différent de Care Suite)
- Sidebar avec 6-8 sections
- Pages stubs prêtes à recevoir les features Sprint A
- Theming statique CareIN (pas de runtime theming, c'est interne)
- Aucun hardcoding (zéro hex, zéro "ASA TECH", zéro "MEDIKAS")

---

## 📋 Pré-requis

- ✅ T01-T03 livrés (monorepo + CI)
- ✅ T04 livré (`@carein/ui-kit` extrait)
- ✅ T06 livré (`@carein/ui-kit` propre, sans hardcoding)
- ✅ T05 livré (`@carein/tailwind-preset` disponible)

**Note** : T11 peut commencer **dès T06 livré**, n'a pas besoin de T08 (theme-engine) car CareIN Suite n'utilise pas le theming runtime.

---

## 🚦 Tâches qui dépendent de T11

- **Sprint A — F1** : Brand Operator Invitations (vit dans carein-suite)
- **Sprint A — F2** : Brand Operator CRUD (vit dans carein-suite)
- Toute feature CareIN-side future

---

## 🎨 Différences clés entre CareIN Suite et Care Suite

| Aspect | Care Suite | CareIN Suite |
|--------|------------|--------------|
| **Audience** | BO + Tenants (clients externes) | Équipe CareIN uniquement |
| **Domaine** | `app.<bo>.io` (variable) | `admin.carein.internal` (fixe) |
| **Sécurité réseau** | Public (Internet) | VPN/SSO interne |
| **Theming** | Runtime (consomme `theme-engine`) | Statique (thème CareIN fixe) |
| **Tenancy package** | Consomme `@carein/tenancy` | Pas besoin (CareIN voit tout) |
| **Sidebar** | Patients, Encounters, Campagnes, ... | Brand Operators, Invitations, Audit, ... |
| **Auth** | Login + OTP simple | SSO + 2FA fort obligatoire |
| **Modules métier** | Filtrés selon `modules_enabled` du BO | Tout disponible |
| **Marque blanche** | OUI (totale) | NON (CareIN officielle) |

---

## 🎨 Design System CareIN Suite (UX/UI Pro Max)

### Identité visuelle

CareIN Suite a **sa propre identité** différente d'ASA TECH ou MEDIKAS. C'est l'identité **éditeur**.

```css
/* tools/tailwind-preset/carein-theme.js (à créer) */

:root {
  --color-primary: #1A4A8C;          /* Bleu CareIN éditeur */
  --color-primary-foreground: #FFFFFF;
  --color-primary-hover: #163E75;

  --color-accent: #0A7E5C;            /* Vert santé secondaire */
  --color-accent-foreground: #FFFFFF;

  --color-background: #F4F6F8;        /* Gris très clair */
  --color-foreground: #0F1923;        /* Bleu très foncé */
  --color-surface: #FFFFFF;
  --color-muted: #F0F2F5;
  --color-muted-foreground: #6B7280;
  --color-border: rgba(0, 0, 0, 0.08);

  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;

  --color-sidebar: #0F1923;            /* Sidebar foncé pour différencier */
  --color-sidebar-foreground: #E5E7EB;
  --color-sidebar-active: #1F2937;
  --color-sidebar-active-border: var(--color-primary);

  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --radius-card: 8px;                 /* Plus carré que Care Suite (look "pro/admin") */
  --radius-btn: 6px;
}
```

**Pourquoi ce choix de bleu** : CareIN est l'éditeur, le partenaire technique de confiance. Le bleu inspire la rigueur, l'institutionnel. Différent du vert ASA TECH (santé) ou orange MEDIKAS (humanitaire).

### Layout général

CareIN Suite est un **back-office d'administration**. Les principes :

- **Densité d'information élevée** — l'équipe CareIN gère N BO, doit voir beaucoup en un coup d'œil
- **Pas d'animations gratuites** — c'est un outil pro, pas une démo client
- **Tables très utilisées** — listes de BO, d'invitations, d'audit logs
- **Filters et recherche partout** — recherche globale dans la topbar
- **Breadcrumb important** — navigation profonde (BO → Tenants → Users)

### Sidebar

```
┌─────────────────────────┐
│ 🏥 CareIN Cockpit       │  ← logo + texte CareIN (pas de marque blanche)
├─────────────────────────┤
│ 📊 Dashboard            │  ← métriques cross-BO
│ 🏢 Brand Operators      │  ← gestion des BO
│ 📨 Invitations          │  ← générer des invitations
│ 🎭 Impersonation        │  ← démarrer une session de support
│ 📜 Audit                │  ← logs cross-BO
│ 📈 Analytics            │  ← stats cross-BO
│ ⚙️  Modules             │  ← config modules par BO
│ 👥 CareIN Team          │  ← gestion équipe CareIN
├─────────────────────────┤
│ 👤 Sarah K.             │  ← user actuel
│ 🚪 Déconnexion          │
└─────────────────────────┘
```

**Largeur** : 240px (un peu plus large que Care Suite à 220px parce que les labels sont plus longs).

### Topbar

```
┌──────────────────────────────────────────────────────────────┐
│ Brand Operators › ASA TECH › Tenants    [🔍 Recherche]  [⚙] │
└──────────────────────────────────────────────────────────────┘
```

- Breadcrumb à gauche
- Recherche globale au centre/droite (pour chercher un BO, un user, un audit log...)
- Avatar + menu user en haut à droite

### Patterns spécifiques CareIN Suite

#### 1. **Page liste avec filtres avancés**

Toutes les pages de liste (BO, Invitations, Audit) suivent le même pattern :

```
┌──────────────────────────────────────────────────────────────┐
│ <h1> Brand Operators                       [+ Nouveau BO]    │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ 🔍 Rechercher...   [Statut ▾] [Pays ▾] [Mode ▾]  [Reset]││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Code    Nom       Pays  Tenants  Statut    Activé le    ││
│ │ ASATECH ASA TECH  CI    3        ✓ Actif   23/04/2026   ││
│ │ MEDIKAS MEDIKAS   CG    1        ✓ Actif   15/05/2026   ││
│ │ ...                                                      ││
│ │                                  [< 1 / 5 >]             ││
│ └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

#### 2. **Page détail avec onglets**

Pour un BO, un Tenant, un audit log, etc :

```
┌──────────────────────────────────────────────────────────────┐
│ < Retour    ASA TECH                  [Suspendre] [Editer]   │
│                                                              │
│ [ Vue d'ensemble ] [ Tenants (3) ] [ Audit (47) ] [ Theme ]  │
│ ─────────────────                                            │
│                                                              │
│ ┌────────────────┬─────────────────┬───────────────────┐    │
│ │ Code           │ Pays            │ Statut            │    │
│ │ ASATECH        │ Côte d'Ivoire   │ ✓ Actif           │    │
│ ├────────────────┼─────────────────┼───────────────────┤    │
│ │ Owner          │ Tenants actifs  │ Activé le         │    │
│ │ Marc Kouassi   │ 3               │ 23/04/2026        │    │
│ └────────────────┴─────────────────┴───────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

#### 3. **Modale de génération d'invitation** (ADR-0015)

Action critique → modale avec confirmation :

```
┌─────────────────────────────────────────┐
│ Générer une invitation Brand Operator   │
├─────────────────────────────────────────┤
│                                         │
│ Email du futur Owner *                  │
│ ┌─────────────────────────────────────┐ │
│ │ marc.kouassi@asatech.ci             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Nom du Brand Operator *                 │
│ ┌─────────────────────────────────────┐ │
│ │ ASA TECH                            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Code interne *                          │
│ ┌─────────────────────────────────────┐ │
│ │ ASATECH                             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Pays *                Mode opération    │
│ ┌──────────────────┐  ┌───────────────┐│
│ │ Côte d'Ivoire ▾ │  │ Multi-service▾││
│ └──────────────────┘  └───────────────┘│
│                                         │
│ Modules activés                         │
│ ☑ Clinical (BC1)                        │
│ ☑ Téléconsultation (BC2)               │
│ ☑ Campagnes (BC3)                       │
│ ☑ Imaging DICOM                         │
│                                         │
│ Durée de validité    Notes (optionnel) │
│ [14 jours      ▾]    [...           ] │
│                                         │
│              [Annuler] [Générer →]      │
└─────────────────────────────────────────┘
```

Après génération → **affichage du lien** avec bouton "Copier" et "Envoyer par email".

---

## 📦 Livrables

### 1. Structure de l'app

```
apps/carein-suite/
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── .eslintrc.cjs
├── README.md
├── public/
│   ├── favicon.ico                 ← logo CareIN officiel
│   └── carein-logo.svg
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                ← redirect /dashboard
    │   ├── globals.css             ← thème CareIN statique
    │   ├── providers.tsx           ← React Query + Auth
    │   ├── error.tsx
    │   ├── not-found.tsx
    │   │
    │   ├── (auth)/
    │   │   └── login/
    │   │       └── page.tsx        ← login CareIN (SSO + 2FA)
    │   │
    │   └── (dashboard)/
    │       ├── layout.tsx          ← sidebar CareIN + topbar
    │       │
    │       ├── dashboard/
    │       │   └── page.tsx
    │       │
    │       ├── brand-operators/
    │       │   ├── page.tsx        ← stub : liste BO
    │       │   ├── new/
    │       │   │   └── page.tsx    ← stub : création BO
    │       │   └── [id]/
    │       │       └── page.tsx    ← stub : détail BO
    │       │
    │       ├── invitations/
    │       │   ├── page.tsx        ← stub : liste invitations
    │       │   ├── new/
    │       │   │   └── page.tsx    ← stub : nouvelle invitation
    │       │   └── [id]/
    │       │       └── page.tsx
    │       │
    │       ├── impersonation/
    │       │   ├── page.tsx        ← stub
    │       │   └── logs/
    │       │       └── page.tsx
    │       │
    │       ├── audit/
    │       │   └── page.tsx        ← stub
    │       │
    │       ├── analytics/
    │       │   └── page.tsx        ← stub
    │       │
    │       ├── modules/
    │       │   └── page.tsx        ← stub
    │       │
    │       └── carein-team/
    │           └── page.tsx        ← stub
    │
    ├── components/
    │   ├── layout/
    │   │   ├── sidebar.tsx         ← sidebar CareIN spécifique
    │   │   ├── topbar.tsx
    │   │   └── breadcrumb.tsx
    │   └── ui/                     ← composants spécifiques CareIN (vide pour l'instant)
    │
    ├── features/
    │   └── auth/
    │       ├── actions.ts          ← Server Actions login + logout
    │       ├── session.ts
    │       └── types.ts
    │
    ├── hooks/
    │   └── use-current-user.ts
    │
    ├── lib/
    │   ├── api-client.ts           ← wrapper @carein/api-client avec base URL CareIN
    │   ├── formatters.ts
    │   ├── routes.ts
    │   └── mocks.ts                ← mocks de BO, invitations pour dev
    │
    └── middleware.ts               ← auth + redirect login
```

### 2. Configuration

#### `apps/carein-suite/package.json`

```json
{
  "name": "@carein/carein-suite",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@carein/ui-kit": "workspace:*",
    "@carein/api-client": "workspace:*",
    "@hookform/resolvers": "^3.9.0",
    "@tanstack/react-query": "^5.50.0",
    "@tanstack/react-query-devtools": "^5.50.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.400.0",
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-hook-form": "^7.52.0",
    "tailwind-merge": "^2.5.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@carein/eslint-config": "workspace:*",
    "@carein/tailwind-preset": "workspace:*",
    "@carein/tsconfig": "workspace:*",
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.5.0"
  }
}
```

**Note importante** : `dev -p 3001` car care-suite tourne sur 3000. Évite les conflits.

#### `apps/carein-suite/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'
import careinPreset from '@carein/tailwind-preset'

export default {
  presets: [careinPreset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui-kit/src/**/*.{ts,tsx}',
  ],
} satisfies Config
```

#### `apps/carein-suite/src/app/globals.css`

```css
@import "tailwindcss";

/* Theme CareIN STATIQUE — pas de theming runtime, c'est interne */
:root {
  --color-primary: #1A4A8C;
  --color-primary-foreground: #FFFFFF;
  --color-primary-hover: #163E75;

  --color-accent: #0A7E5C;
  --color-accent-foreground: #FFFFFF;

  --color-background: #F4F6F8;
  --color-foreground: #0F1923;
  --color-surface: #FFFFFF;
  --color-muted: #F0F2F5;
  --color-muted-foreground: #6B7280;
  --color-border: rgba(0, 0, 0, 0.08);

  --color-success: #10B981;
  --color-success-foreground: #FFFFFF;
  --color-warning: #F59E0B;
  --color-warning-foreground: #FFFFFF;
  --color-danger: #EF4444;
  --color-danger-foreground: #FFFFFF;

  --color-sidebar: #0F1923;
  --color-sidebar-foreground: #E5E7EB;
  --color-sidebar-active: #1F2937;
  --color-sidebar-active-border: #1A4A8C;

  --radius-card: 8px;
  --radius-btn: 6px;
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
}

/* Scrollbar cohérent avec Care Suite */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-muted-foreground);
}
```

#### `apps/carein-suite/src/app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CareIN Cockpit',
  description: 'Plateforme d\'administration CareIN — usage interne uniquement',
  robots: {
    index: false,         // pas indexé par les moteurs
    follow: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${jetbrains.variable} h-full`}>
      <body className="h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

#### `apps/carein-suite/src/components/layout/sidebar.tsx`

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Mail,
  UserCheck,
  ScrollText,
  TrendingUp,
  Settings,
  Users,
  LogOut,
} from 'lucide-react'
import { cn } from '@carein/ui-kit'
import { useAuth } from '@/hooks/use-current-user'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/brand-operators', label: 'Brand Operators', icon: Building2 },
  { href: '/invitations', label: 'Invitations', icon: Mail },
  { href: '/impersonation', label: 'Impersonation', icon: UserCheck },
  { href: '/audit', label: 'Audit', icon: ScrollText },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/modules', label: 'Modules', icon: Settings },
  { href: '/carein-team', label: 'Équipe CareIN', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-sidebar text-sidebar-foreground flex flex-col z-30">
      {/* Logo CareIN */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">C</span>
        </div>
        <div>
          <p className="text-sm font-bold leading-none">CareIN</p>
          <p className="text-[10px] text-sidebar-foreground/60 mt-0.5">Cockpit Editor</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm transition-all',
                active
                  ? 'bg-sidebar-active text-foreground border-l-2 border-sidebar-active-border pl-[10px]'
                  : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-white/5'
              )}
            >
              <Icon size={16} className={active ? 'text-primary' : ''} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer user */}
      <div className="px-3 py-3 border-t border-white/10">
        {user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-medium text-sidebar-foreground">{user.name}</p>
            <p className="text-[10px] text-sidebar-foreground/50">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-btn text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-white/5 transition-all"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
```

#### `apps/carein-suite/src/app/(dashboard)/dashboard/page.tsx`

Stub avec metriques cross-BO :

```typescript
import { Building2, Users, Stethoscope, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, MetricCard } from '@carein/ui-kit'

export default function DashboardPage() {
  // TODO: brancher sur GET /api/v1/carein/analytics/overview
  const stats = {
    totalBOs: 2,
    totalTenants: 4,
    totalPatients: 1024,
    pendingInvitations: 1,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard CareIN</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vue d'ensemble cross-Brand Operators
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Brand Operators"
          value={stats.totalBOs}
          subtitle="actifs"
          icon={Building2}
          colorScheme="primary"
        />
        <MetricCard
          title="Tenants"
          value={stats.totalTenants}
          subtitle="services actifs"
          icon={Users}
          colorScheme="accent"
        />
        <MetricCard
          title="Patients suivis"
          value={stats.totalPatients.toLocaleString('fr')}
          subtitle="cross-BO"
          icon={Stethoscope}
          colorScheme="success"
        />
        <MetricCard
          title="Invitations en attente"
          value={stats.pendingInvitations}
          subtitle="à valider"
          icon={AlertCircle}
          colorScheme="warning"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité cross-BO (7 derniers jours)</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted-foreground py-12 text-center">
          Graphique à implémenter — analytics cross-BO
        </p>
      </Card>
    </div>
  )
}
```

#### Page de login CareIN spécifique

Différente de Care Suite : pas de panel marketing avec stats, mais une page sobre admin avec mention "Accès interne" :

```typescript
// apps/carein-suite/src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { Button, Input } from '@carein/ui-kit'
import { Shield, Lock } from 'lucide-react'

export default function CareInLoginPage() {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">CareIN Cockpit</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Accès réservé à l'équipe CareIN
          </p>
        </div>

        {/* Card login */}
        <div className="bg-surface border border-border rounded-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
            <Lock size={12} />
            <span>Connexion sécurisée</span>
          </div>

          {step === 'credentials' ? (
            <CredentialsStep onSuccess={() => setStep('otp')} />
          ) : (
            <OtpStep onBack={() => setStep('credentials')} />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          En cas de problème : <a href="mailto:support@carein.io" className="text-primary hover:underline">support@carein.io</a>
        </p>
      </div>
    </div>
  )
}

// CredentialsStep et OtpStep en sous-composants...
```

### 3. Pages stubs pour les autres sections

Chaque page stub a :
- Un `<h1>` clair
- Un message "Module à implémenter"
- Un placeholder visuel élégant (pas juste du texte gris)

Exemple :

```typescript
// apps/carein-suite/src/app/(dashboard)/brand-operators/page.tsx
import { Building2 } from 'lucide-react'
import { Button, Card } from '@carein/ui-kit'

export default function BrandOperatorsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Brand Operators</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestion des opérateurs marque-blanche
          </p>
        </div>
        <Button>+ Nouveau BO</Button>
      </div>

      <Card className="text-center py-16">
        <Building2 size={40} className="mx-auto text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">
          Aucun Brand Operator pour le moment
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Pour onboarder un BO, génère une invitation depuis la page Invitations.
        </p>
        <Button variant="outline">Voir les invitations</Button>
      </Card>
    </div>
  )
}
```

### 4. Mocks pour le mode dev

```typescript
// apps/carein-suite/src/lib/mocks.ts
export const MOCK_BRAND_OPERATORS = [
  {
    uuid: '...',
    code: 'ASATECH',
    name: 'ASA TECH',
    country: 'CI',
    operatingMode: 'multi_service',
    status: 'active',
    tenantsCount: 3,
    activatedAt: '2026-04-23T10:00:00Z',
  },
  {
    uuid: '...',
    code: 'MEDIKAS',
    name: 'MEDIKAS Health',
    country: 'CG',
    operatingMode: 'single_service',
    status: 'active',
    tenantsCount: 1,
    activatedAt: '2026-05-15T14:30:00Z',
  },
]

export const MOCK_INVITATIONS = [
  {
    uuid: '...',
    email: 'pierre@medikas.cg',
    intendedBoName: 'MEDIKAS Health',
    status: 'consumed',
    expiresAt: '2026-05-29T00:00:00Z',
    consumedAt: '2026-05-15T09:00:00Z',
  },
  // ...
]
```

### 5. Configuration CI

Ajouter dans `.github/workflows/ci.yml` :

```yaml
# ...
- name: Build CareIN Suite
  run: pnpm --filter @carein/carein-suite build

- name: TypeCheck CareIN Suite
  run: pnpm --filter @carein/carein-suite typecheck
```

### 6. Vercel/Netlify config

Si déployé : configuration séparée pour `carein-suite` avec :
- Domaine `admin.carein.internal` (ou un domaine de staging)
- Variables d'env : `NEXT_PUBLIC_API_URL=https://api.carein.io`
- **Pas accessible publiquement** (auth IP allowlist ou VPN)

---

## ✅ Definition of Done

- [ ] `apps/carein-suite/` créé avec toute la structure
- [ ] `pnpm --filter @carein/carein-suite dev` lance l'app sur le port 3001
- [ ] Login affiche un écran sobre admin (différent de Care Suite)
- [ ] Sidebar affiche les 8 sections
- [ ] Toutes les pages stubs ont un titre + un placeholder élégant + un CTA
- [ ] Theme CareIN bleu/vert fonctionne (différent du vert ASA TECH)
- [ ] Aucun hardcoding hex (lint clean) : `grep -rn "#[0-9A-Fa-f]\{6\}" apps/carein-suite/src/` retourne 0
- [ ] Aucune référence "ASA TECH" ni "MEDIKAS" en dur
- [ ] CI passe (build + typecheck + lint)
- [ ] README.md du package créé
- [ ] Page de login fonctionne (peut consommer le backend en mode placeholder)
- [ ] Code review par un autre dev

---

## 🚧 Pièges à éviter

### ❌ Réutiliser le même domaine que Care Suite

CareIN Suite **ne doit pas** être accessible publiquement. Domaine séparé, idéalement derrière VPN.

### ❌ Hardcoder le thème CareIN dans `globals.css`

Ce thème est statique pour CareIN Suite, mais **doit quand même utiliser des CSS variables sémantiques**. Comme ça si demain on veut un mode sombre CareIN, on l'ajoute facilement.

### ❌ Dupliquer des composants depuis Care Suite

Si tu as besoin d'un composant utilisé aussi dans Care Suite → il doit être dans `@carein/ui-kit`. Pas de copie-collage.

### ❌ Oublier que CareIN voit TOUT

Pas de `tenantId` dans les queries CareIN. Pas de filtre par BO automatique. CareIN traverse les schémas via des requêtes spéciales (cross-BO query service côté backend).

### ❌ Sous-estimer le besoin de UX admin

Un dashboard admin est différent d'une UI client :
- Plus de tableaux denses
- Plus de filtres
- Recherche globale
- Breadcrumb important
- Actions destructives = toujours confirmation

Ne pas reproduire bêtement les patterns Care Suite.

---

## 🎨 Inspiration UX/UI (références)

Pour le design admin, s'inspirer de (sans copier) :

- **Linear** — densité d'information, raccourcis clavier
- **Plain.com** — pour les listes/filtres très clean
- **Supabase Dashboard** — pour la gestion multi-projet (= multi-BO)
- **Stripe Dashboard** — pour l'audit log, l'impersonation
- **Vercel Dashboard** — pour la sidebar et la navigation

Ne pas regarder Notion ou Figma : trop client-oriented.

---

## 🔗 Documents de référence

- [`docs/roadmap/option-c-monorepo-ui-kit-refactor.md`](../../roadmap/option-c-monorepo-ui-kit-refactor.md) — vue T11
- [`docs/adr/0004-naming-products.md`](../../adr/0004-naming-products.md) — nommage CareIN Suite
- [`docs/adr/0001-tenancy-architecture-3-niveaux.md`](../../adr/0001-tenancy-architecture-3-niveaux.md) — pourquoi un cockpit séparé
- [`docs/adr/0007-impersonation-cross-niveaux.md`](../../adr/0007-impersonation-cross-niveaux.md) — flow d'impersonation visible dans le cockpit
- [`docs/adr/0015-auto-onboarding-asynchrone.md`](../../adr/0015-auto-onboarding-asynchrone.md) — workflow invitations

---

## 💡 Prompt suggéré pour l'IDE

> "Exécute T11 (création apps/carein-suite) selon la spec dans `docs/prompts/tasks/T11-create-carein-suite.md`.
>
> Étapes :
> 1. Crée `apps/carein-suite/` avec sa structure complète (config Next.js, Tailwind, TS, ESLint)
> 2. Implémente `globals.css` avec le thème CareIN STATIQUE (bleu primaire, vert accent)
> 3. Crée la sidebar CareIN avec les 8 sections (PAS la sidebar de Care Suite)
> 4. Crée le layout dashboard avec sidebar + topbar
> 5. Crée la page login spécifique CareIN (sobre admin, pas le panel marketing de Care Suite)
> 6. Crée toutes les pages stubs avec un titre + placeholder élégant + CTA
> 7. Implémente les mocks dans `lib/mocks.ts` pour BO et invitations
> 8. Adapte la CI pour builder carein-suite
> 9. Vérifie : pnpm typecheck, pnpm build, pnpm dev (port 3001)
> 10. Confirme la Definition of Done point par point
>
> Règles UX strictes :
> - Densité d'information élevée (c'est un outil pro admin)
> - Pas d'animations gratuites
> - Tables avec filtres au-dessus
> - Empty states actionnables (pas juste 'Aucune donnée')
> - Modale uniquement pour actions destructives ou workflows complexes
> - Inspiration : Linear, Stripe Dashboard, Vercel Dashboard"
