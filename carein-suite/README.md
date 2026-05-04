# CareIN Suite — Cockpit Éditeur

Interface d'administration interne CareIN. Usage réservé à l'équipe CareIN.

## Stack

- **Next.js** — App Router, Server Components, Server Actions
- **Tailwind CSS v4** — thème CareIN statique via CSS variables
- **TypeScript** strict
- **Backend** — API Laravel DDD (`api.asa`) via Sanctum

## Lancer en local

```bash
npm install
npm run dev      # port 3000
```

Variables d'environnement requises dans `.env.local` :

```
NEXT_PUBLIC_API_URL=http://localhost/api/v1
NEXT_PUBLIC_CLIENT_APP_URL=http://localhost:3001
```

## Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | Vue d'ensemble cross-BO (métriques + activité) |
| `/brand-operators` | Liste, création, édition des Brand Operators |
| `/invitations` | Génération et suivi des invitations BO |
| `/impersonation` | Sessions de support dans le contexte d'un BO |
| `/audit` | Logs cross-BO avec filtres et pagination |
| `/analytics` | Statistiques agrégées + graphiques |
| `/modules` | Configuration des modules par BO |
| `/carein-team` | Gestion des comptes superadmin CareIN |

## Authentification

Login via `POST /api/v1/auth/login` — token Sanctum stocké en cookie `carein_auth_token`. Seuls les comptes avec le rôle `superadmin` peuvent accéder.

Créer un superadmin :

```bash
php artisan db:seed --class=CareInSuperAdminSeeder
```

## Conventions

- Toutes les couleurs passent par des CSS variables (`var(--color-primary)`, etc.) — zéro hex dans les composants
- Pas de mock ni de donnée en dur — tout branché sur le backend réel
- Pages Server Components par défaut, Client Components uniquement pour l'interactivité
