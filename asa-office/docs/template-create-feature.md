# 🎯 Template — Créer une nouvelle feature complète

> **Type** : Template réutilisable pour Sprint A et toutes les features futures
> **Quand l'utiliser** : à chaque fois qu'on ajoute une nouvelle entité métier ou un nouveau module
> **Estimation** : 2-4 jours par feature (selon complexité)

---

## 🎯 À quoi sert ce template

Ce document est le **mode d'emploi** pour ajouter une feature au projet CareIN. Il garantit que **chaque nouvelle feature suit la même structure**, les mêmes patterns, les mêmes conventions.

Tu remplaces `<feature-name>` (kebab-case, ex: `tablet-bindings`) et `<FeatureName>` (PascalCase, ex: `TabletBinding`) dans tout le document.

Tu suis l'ordre **back → front**. Pas l'inverse.

---

## 📋 Checklist pré-démarrage

Avant de commencer, valider :

- [ ] La feature est documentée dans un ADR ou la roadmap (sinon créer un ADR avant)
- [ ] Le contrat API est défini (au moins en draft) avec les endpoints + schémas
- [ ] La feature a un scope clair : "user story" testable
- [ ] On sait dans quelle app elle vit (`care-suite` ou `carein-suite`)
- [ ] On sait quels scopes/business_roles peuvent y accéder

---

## 🏗️ Étape 1 — Backend Laravel

### 1.1 Migration DB

```php
// database/migrations/YYYY_MM_DD_create_<feature-name>_table.php
return new class extends Migration {
    public function up(): void
    {
        Schema::create('<feature_name_plural>', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->unique();

            // Multi-tenancy obligatoire (cf. ADR-0001)
            $table->foreignId('brand_operator_id')->constrained('carein.brand_operators');
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();

            // Champs métier
            // ...

            // Audit
            $table->foreignId('created_by_user_id')->constrained('users');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['tenant_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('<feature_name_plural>');
    }
};
```

**Règles non négociables** :
- ✅ `brand_operator_id` ET `tenant_id` non NULL (sauf cas justifié documenté)
- ✅ `uuid` indépendant de `id` pour les URLs publiques
- ✅ `created_by_user_id` pour l'audit
- ✅ `softDeletes` pour ne jamais perdre d'historique médical

### 1.2 Domain Layer

```
app/Domain/<BoundedContext>/<FeatureName>/
├── Entities/
│   └── <FeatureName>.php           ← entité riche (PAS un modèle Eloquent !)
├── ValueObjects/
│   ├── <FeatureName>Status.php     ← enum si applicable
│   └── <FeatureName>Code.php       ← VO si applicable
├── Events/
│   ├── <FeatureName>Created.php
│   ├── <FeatureName>Updated.php
│   └── <FeatureName>Deleted.php
├── Repositories/
│   └── <FeatureName>RepositoryInterface.php
└── Services/
    └── <FeatureName>Service.php    ← logique métier complexe (si applicable)
```

**Exemple Repository interface** :

```php
namespace Domain\<BoundedContext>\<FeatureName>\Repositories;

interface <FeatureName>RepositoryInterface
{
    public function findById(int $id): ?<FeatureName>;
    public function findByUuid(string $uuid): ?<FeatureName>;
    public function paginate(array $filters, int $perPage): LengthAwarePaginator;
    public function create(array $data): <FeatureName>;
    public function update(<FeatureName> $entity, array $data): <FeatureName>;
    public function delete(<FeatureName> $entity): void;
}
```

### 1.3 Application Layer (CQRS)

Pour chaque action métier, créer un dossier `<ActionName>/` avec :

```
app/Application/<BoundedContext>/<FeatureName>/Commands/
├── Create<FeatureName>/
│   ├── Create<FeatureName>Command.php   ← DTO immutable
│   └── Create<FeatureName>Handler.php   ← logique
├── Update<FeatureName>/
└── Delete<FeatureName>/

app/Application/<BoundedContext>/<FeatureName>/Queries/
├── Get<FeatureName>/
├── List<FeatureName>s/
└── Search<FeatureName>s/
```

**Exemple Command + Handler** :

```php
// Command (DTO immutable)
final class CreateTabletBindingCommand
{
    public function __construct(
        public readonly string $tabletUuid,
        public readonly string $deviceUuid,
        public readonly string $connectionType,
        public readonly ?string $bluetoothMac = null,
        public readonly ?string $bluetoothPin = null,
        public readonly bool $isPrimary = false,
        public readonly ?string $nickname = null,
    ) {}
}

// Handler
final class CreateTabletBindingHandler
{
    public function __construct(
        private readonly TabletBindingRepositoryInterface $bindings,
        private readonly TabletRepositoryInterface $tablets,
        private readonly DeviceRepositoryInterface $devices,
    ) {}

    public function handle(CreateTabletBindingCommand $cmd): array
    {
        $tablet = $this->tablets->findByUuid($cmd->tabletUuid)
            ?? throw new DomainException('Tablette introuvable');
        $device = $this->devices->findByUuid($cmd->deviceUuid)
            ?? throw new DomainException('Device introuvable');

        // Vérification : tablet et device doivent être du même tenant
        if ($tablet->tenant_id !== $device->tenant_id) {
            throw new DomainException('Tablette et device de tenants différents');
        }

        $binding = $this->bindings->create([
            'tablet_id' => $tablet->id,
            'device_id' => $device->id,
            'connection_type' => $cmd->connectionType,
            'bluetooth_mac' => $cmd->bluetoothMac,
            'bluetooth_pin_encrypted' => $cmd->bluetoothPin
                ? Crypt::encryptString($cmd->bluetoothPin)
                : null,
            'is_primary' => $cmd->isPrimary,
            'nickname' => $cmd->nickname,
        ]);

        Event::dispatch(new TabletBindingCreated($binding->id));

        return $binding->toArray();
    }
}
```

### 1.4 Infrastructure Layer

```
app/Infrastructure/<BoundedContext>/<FeatureName>/Persistence/
└── Eloquent<FeatureName>Repository.php
```

```php
namespace Infrastructure\<BoundedContext>\<FeatureName>\Persistence;

class EloquentTabletBindingRepository implements TabletBindingRepositoryInterface
{
    public function findByUuid(string $uuid): ?TabletBinding
    {
        return TabletBinding::where('uuid', $uuid)->first();
    }
    // ... autres méthodes
}
```

**Note** : le modèle Eloquent vit dans `app/Models/` et utilise les traits `BelongsToTenant` + `BelongsToBrandOperator` pour le multi-tenancy auto.

```php
namespace App\Models;

class TabletBinding extends Model
{
    use BelongsToTenant, BelongsToBrandOperator, HasFactory, SoftDeletes;

    protected $fillable = [
        'tablet_id', 'device_id', 'connection_type',
        'bluetooth_mac', 'bluetooth_pin_encrypted',
        'is_primary', 'nickname',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(fn ($m) => $m->uuid ??= (string) Str::uuid());
    }
}
```

### 1.5 Interface Layer (Controllers + OpenAPI)

```
app/Interface/Api/V1/Tenant/
└── <FeatureName>Controller.php

app/Interface/Api/V1/Tenant/Resources/
└── <FeatureName>Resource.php
```

**Annotations OpenAPI obligatoires** (cf. ADR-0008) :

```php
namespace Interface\Api\V1\Tenant;

class TabletBindingsController extends Controller
{
    public function __construct(
        private readonly CreateTabletBindingHandler $createHandler,
        private readonly ListTabletBindingsHandler $listHandler,
        private readonly TabletBindingRepositoryInterface $bindings,
    ) {}

    #[OA\Get(
        path: '/api/v1/tenant/tablets/{tabletUuid}/device-bindings',
        summary: 'Liste des device bindings d\'une tablette',
        security: [['sanctum' => []]],
        tags: ['Tenant - Fleet - TabletBindings'],
        parameters: [
            new OA\Parameter(name: 'tabletUuid', in: 'path', required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Liste des bindings'),
            new OA\Response(response: 404, description: 'Tablette introuvable'),
        ]
    )]
    public function index(string $tabletUuid): JsonResponse
    {
        $bindings = $this->listHandler->handle(
            new ListTabletBindingsQuery(tabletUuid: $tabletUuid)
        );

        return response()->json([
            'data' => TabletBindingResource::collection($bindings),
        ]);
    }

    #[OA\Post(
        path: '/api/v1/tenant/tablets/{tabletUuid}/device-bindings',
        summary: 'Créer un binding tablette ↔ device',
        security: [['sanctum' => []]],
        tags: ['Tenant - Fleet - TabletBindings'],
        // ... requestBody, responses
    )]
    public function store(Request $request, string $tabletUuid): JsonResponse
    {
        // Permission Spatie : seul technicien ou tenant_admin
        Gate::authorize('tablet_device_binding.manage');

        $data = $request->validate([
            'device_uuid' => ['required', 'uuid'],
            'connection_type' => ['required', 'in:bluetooth_classic,bluetooth_le,usb,wifi_direct,serial,nfc'],
            'bluetooth_mac' => ['nullable', 'string', 'regex:/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/'],
            'bluetooth_pin' => ['nullable', 'string', 'min:4', 'max:20'],
            'is_primary' => ['sometimes', 'boolean'],
            'nickname' => ['nullable', 'string', 'max:100'],
        ]);

        try {
            $result = $this->createHandler->handle(new CreateTabletBindingCommand(
                tabletUuid: $tabletUuid,
                ...$data,
            ));
        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        $binding = $this->bindings->findByUuid($result['uuid']);
        return response()->json(['data' => new TabletBindingResource($binding)], 201);
    }

    // ... update, destroy
}
```

### 1.6 Tests d'isolation (BLOQUANTS en CI)

```php
// tests/Feature/Platform/<FeatureName>IsolationTest.php

it('ne permet pas de voir les bindings d\'un autre BO', function () {
    // ASA TECH crée un binding
    actingAsBrandOperator('ASATECH');
    $binding = TabletBinding::factory()->create();

    // MEDIKAS tente de l'accéder
    actingAsBrandOperator('MEDIKAS');

    $response = $this->getJson("/api/v1/tenant/tablets/.../device-bindings/{$binding->uuid}");

    expect($response->status())->toBe(404);  // pas 403 (info leak)
});

it('ne permet pas de voir les bindings d\'un autre tenant du même BO', function () {
    actingAsTenantAdmin('ASATECH', 'tenant_a');
    $binding = TabletBinding::factory()->create();

    actingAsTenantAdmin('ASATECH', 'tenant_b');
    $response = $this->getJson("/api/v1/tenant/tablets/.../device-bindings/{$binding->uuid}");

    expect($response->status())->toBe(404);
});

it('ne permet pas à un agent terrain de créer un binding', function () {
    actingAsRole('field_agent');

    $response = $this->postJson("/api/v1/tenant/tablets/.../device-bindings", [...]);

    expect($response->status())->toBe(403);  // permission manquante
});
```

### 1.7 Service Provider (DI bindings)

```php
// app/Providers/AppServiceProvider.php — ajouts

$this->app->bind(TabletBindingRepositoryInterface::class, EloquentTabletBindingRepository::class);
$this->app->bind(CreateTabletBindingHandler::class);
$this->app->bind(ListTabletBindingsHandler::class);
// ...
```

---

## 🎨 Étape 2 — Frontend Next.js

### 2.1 Feature folder

```
apps/<app>/src/features/<feature-name>/
├── api.ts          ← fonctions CRUD
├── hooks.ts        ← React Query wrappers
├── types.ts        ← Zod schemas + types TS
└── mocks.ts        ← mocks pour mode dev
```

### 2.2 Types et schemas (Zod)

```typescript
// apps/<app>/src/features/<feature-name>/types.ts
import { z } from 'zod'

export const <featureName>Schema = z.object({
  device_uuid: z.string().uuid(),
  connection_type: z.enum(['bluetooth_classic', 'bluetooth_le', 'usb', 'wifi_direct', 'serial', 'nfc']),
  bluetooth_mac: z.string().regex(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/).optional(),
  bluetooth_pin: z.string().min(4).max(20).optional(),
  is_primary: z.boolean().optional(),
  nickname: z.string().max(100).optional(),
})

export type <FeatureName>Input = z.infer<typeof <featureName>Schema>

export type <FeatureName> = {
  uuid: string
  tablet_id: number
  device: {
    uuid: string
    type: string
    model: string
  }
  connection_type: string
  // ... champs présentés (PAS le bluetooth_pin déchiffré côté front !)
  is_primary: boolean
  nickname: string | null
  bound_at: string
  last_seen_at: string | null
}
```

**Règle critique** : le front ne voit JAMAIS les credentials (PIN, password). Le backend les transmet à la tablette uniquement (cf. ADR-0016).

### 2.3 API functions

```typescript
// apps/<app>/src/features/<feature-name>/api.ts
import { apiClient } from '@carein/api-client'
import type { <FeatureName>, <FeatureName>Input } from './types'
import { mock<FeatureName>s } from './mocks'

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

export async function list<FeatureName>s(tabletUuid: string): Promise<<FeatureName>[]> {
  if (USE_MOCKS) return mock<FeatureName>s

  const { data } = await apiClient.GET('/api/v1/tenant/tablets/{tabletUuid}/device-bindings', {
    params: { path: { tabletUuid } },
  })
  return data?.data ?? []
}

export async function create<FeatureName>(
  tabletUuid: string,
  input: <FeatureName>Input,
): Promise<<FeatureName>> {
  if (USE_MOCKS) {
    const created = { ...input, uuid: crypto.randomUUID(), /* ... */ }
    mock<FeatureName>s.push(created as <FeatureName>)
    return created as <FeatureName>
  }

  const { data } = await apiClient.POST('/api/v1/tenant/tablets/{tabletUuid}/device-bindings', {
    params: { path: { tabletUuid } },
    body: input,
  })
  return data!.data
}

// ... update, delete
```

**Mode hybride** : si `NEXT_PUBLIC_USE_MOCKS=true` → utilise `mocks.ts`. Sinon → vrai backend.

### 2.4 React Query hooks

```typescript
// apps/<app>/src/features/<feature-name>/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { <FeatureName>Input } from './types'

export function use<FeatureName>s(tabletUuid: string) {
  return useQuery({
    queryKey: ['<feature-name>s', tabletUuid],
    queryFn: () => api.list<FeatureName>s(tabletUuid),
    enabled: !!tabletUuid,
  })
}

export function useCreate<FeatureName>(tabletUuid: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: <FeatureName>Input) => api.create<FeatureName>(tabletUuid, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['<feature-name>s', tabletUuid] }),
  })
}

// ... useUpdate<FeatureName>, useDelete<FeatureName>
```

### 2.5 Composants UI

```
apps/<app>/src/components/<feature-name>/
├── <feature-name>-form.tsx
├── <feature-name>-table.tsx
└── <feature-name>-empty-state.tsx     ← composant dédié pour empty state
```

**Form (RHF + Zod)** :

```typescript
// apps/<app>/src/components/<feature-name>/<feature-name>-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@carein/ui-kit'
import { <featureName>Schema, type <FeatureName>Input } from '@/features/<feature-name>/types'
import { useCreate<FeatureName> } from '@/features/<feature-name>/hooks'

export function <FeatureName>Form({ tabletUuid, onSuccess }: Props) {
  const create = useCreate<FeatureName>(tabletUuid)

  const { register, handleSubmit, formState: { errors } } = useForm<<FeatureName>Input>({
    resolver: zodResolver(<featureName>Schema),
  })

  function onSubmit(data: <FeatureName>Input) {
    create.mutate(data, {
      onSuccess: () => onSuccess?.(),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {create.error && (
        <div className="px-4 py-3 rounded-card bg-danger/10 text-danger text-sm">
          {create.error.message}
        </div>
      )}

      {/* champs */}

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={create.isPending}>
          Créer
        </Button>
        <Button type="button" variant="ghost" onClick={() => onSuccess?.()}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
```

**Table (DataTable du ui-kit)** :

```typescript
'use client'

import { DataTable, Column, Badge, Button } from '@carein/ui-kit'
import { use<FeatureName>s } from '@/features/<feature-name>/hooks'
import { <FeatureName>EmptyState } from './<feature-name>-empty-state'
import { formatDate } from '@/lib/formatters'

export function <FeatureName>Table({ tabletUuid }: Props) {
  const { data, isLoading, isError, refetch } = use<FeatureName>s(tabletUuid)

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-3">Erreur lors du chargement</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Réessayer</Button>
      </div>
    )
  }

  if (!isLoading && !data?.length) {
    return <<FeatureName>EmptyState />
  }

  const columns: Column<<FeatureName>>[] = [
    // ...
  ]

  return (
    <DataTable
      columns={columns}
      data={data ?? []}
      loading={isLoading}
      keyExtractor={(row) => row.uuid}
    />
  )
}
```

**Empty state actionnable** :

```typescript
import { Button } from '@carein/ui-kit'
import { Bluetooth } from 'lucide-react'

export function <FeatureName>EmptyState({ onAdd }: Props) {
  return (
    <div className="text-center py-16">
      <Bluetooth size={40} className="mx-auto text-muted-foreground/40 mb-3" />
      <p className="text-sm font-medium mb-1">
        Aucun device appairé pour cette tablette
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Le pré-appairage évite à l'agent terrain de chercher le signal.
      </p>
      <Button onClick={onAdd}>+ Appairer un device</Button>
    </div>
  )
}
```

### 2.6 Pages Next.js

```
apps/<app>/src/app/(dashboard)/<route-segment>/
├── page.tsx          ← liste
├── new/page.tsx      ← création
└── [id]/page.tsx     ← détail
```

**Pattern de page liste** :

```typescript
import { Topbar } from '@/components/layout/topbar'
import { Card, Button } from '@carein/ui-kit'
import { <FeatureName>Table } from '@/components/<feature-name>/<feature-name>-table'
import Link from 'next/link'

export default function <FeatureName>sPage() {
  return (
    <div>
      <Topbar
        actions={
          <Link href="/<route>/new">
            <Button size="sm">+ Nouveau</Button>
          </Link>
        }
      />
      <div className="p-6">
        <Card>
          <<FeatureName>Table />
        </Card>
      </div>
    </div>
  )
}
```

### 2.7 Permissions front (gating)

Si la feature est limitée à certains rôles métier :

```typescript
import { Can } from '@carein/ui-kit'

export default function Page() {
  return (
    <Can role={['technician', 'tenant_admin']} fallback={<NotAuthorized />}>
      <<FeatureName>Table />
    </Can>
  )
}
```

---

## ✅ Definition of Done de la feature

### Backend
- [ ] Migration créée et appliquée
- [ ] Domain Layer (Entity, VO, Repository interface, Events)
- [ ] Application Layer (Commands + Handlers, Queries + Handlers)
- [ ] Infrastructure Layer (Eloquent Repository)
- [ ] Interface Layer (Controller + Resources + OpenAPI annotations)
- [ ] Service Provider bindings
- [ ] Tests d'isolation cross-BO et cross-Tenant
- [ ] Tests Handlers (happy path + error cases)
- [ ] OpenAPI generated et committed

### Frontend
- [ ] Types + Zod schemas
- [ ] API functions avec mode hybride mocks/backend
- [ ] React Query hooks
- [ ] Composants UI (form, table, empty state)
- [ ] Pages Next.js (list, new, detail)
- [ ] Gating avec `<Can>` si applicable
- [ ] Aucun hardcoding (lint clean)
- [ ] Mocks dev en place
- [ ] Tests d'intégration (au moins le happy path)

### Documentation
- [ ] Section ajoutée au README de l'app si nécessaire
- [ ] ADR créé ou mis à jour si décision structurante

### Validation
- [ ] Code review par 1 dev senior minimum
- [ ] Test manuel complet : créer, lister, modifier, supprimer
- [ ] Test isolation manuel : vérifier qu'un autre BO ne voit pas
- [ ] Build production OK
- [ ] CI verte

---

## 🚧 Pièges à éviter

### ❌ Sauter les tests d'isolation

C'est tentant parce que c'est long à écrire. **Ne le fais pas.** Ces tests sont la garantie que la marque blanche ne fuite pas. Si on les saute, on découvre la fuite en prod.

### ❌ Faire le front sans le contrat backend stable

Si tu fais le front avant que les routes Laravel existent, tu vas devoir tout refaire quand la vraie route est livrée. **Toujours figer le contrat OpenAPI avant de commencer le front**.

Exception : si tu utilises le mode hybride mocks, tu peux avancer sur l'UX en parallèle. Mais le contrat doit être figé en parallèle.

### ❌ Mettre la logique métier dans le front

Calcul de score, validation métier complexe, transition de statut → **côté backend uniquement**. Le front affiche, ne calcule pas.

### ❌ Hardcoder un `tenant_id` ou `brand_operator_id`

Jamais dans le code. Toujours résolu par le middleware.

### ❌ Oublier l'empty state

C'est le piège #1 des features. Une UI sans empty state semble cassée quand il n'y a pas de données. Toujours **proposer une action** dans l'empty state.

### ❌ Oublier l'audit log

Pour toute action importante (create, update, delete), enregistrer dans les audit logs. Surtout en mode impersonation.

### ❌ Faire les Server Actions pour des CRUD simples

Les Server Actions Next.js sont **pour les mutations sensibles** (auth, onboarding). Pour les CRUD, on utilise React Query + le client API typé.

---

## 🎨 Checklist UX/UI (Pro Max)

Pour chaque feature, vérifier les **4 états obligatoires** :

- [ ] Loading state (Skeleton)
- [ ] Empty state (avec CTA)
- [ ] Error state (avec bouton réessayer)
- [ ] Success/normal state

Et :

- [ ] Tous les forms ont labels + errors inline + bouton submit avec loading
- [ ] Tables ont header sticky, pagination, click sur ligne → détail
- [ ] Modales seulement pour actions destructives ou workflows complexes
- [ ] Touch targets ≥ 44px sur mobile, 24px sur web
- [ ] Pas de hardcoding (couleurs sémantiques uniquement)
- [ ] Mots-clés métier en français cohérents (pas "Patient" en anglais ailleurs)
- [ ] Empty state actionnable, pas juste "Aucune donnée"
- [ ] Test avec thème ASA TECH ET un thème simulé (orange) si dans care-suite

---

## 💡 Prompt suggéré pour l'IDE

> "Je veux créer la feature `<feature-name>` (ex: `tablet-bindings`). Suis le template `docs/prompts/tasks/template-create-feature.md`.
>
> Commence par me poser ces questions :
> 1. Dans quelle app vit-elle (`care-suite` ou `carein-suite`) ?
> 2. Quelle est l'entité métier (PascalCase) ?
> 3. Quels endpoints API faut-il (GET list, GET detail, POST, PUT, DELETE) ?
> 4. Quels scopes/business_roles peuvent y accéder ?
> 5. Un ADR la couvre-t-elle ? Lequel ?
>
> Puis livre dans cet ordre :
> 1. Migration Laravel
> 2. Domain Layer
> 3. Application Layer (Commands + Queries)
> 4. Infrastructure Layer
> 5. Interface Layer avec annotations OpenAPI
> 6. Service Provider bindings
> 7. Tests d'isolation
> 8. Types + Zod côté front
> 9. API functions avec mode hybride
> 10. React Query hooks
> 11. Composants UI (form, table, empty state)
> 12. Pages Next.js
>
> Confirme la Definition of Done point par point à la fin."
