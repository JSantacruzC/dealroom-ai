
# Plan — DealRooms vacíos, IA de enriquecimiento LinkedIn, auth real con DB, demo separada

Objetivo: dejar la app lista para uso empresarial. Cada usuario autenticado tiene su propio espacio en la base de datos, los DealRooms se crean vacíos, una herramienta IA enriquece empresa/persona desde "LinkedIn", la demo de la landing es un sandbox lleno solo para inspirarse, y todo el resto del usuario empieza vacío.

Mantengo intacto el diseño actual (paleta, tipografía, layout, gradientes, sidebar, animaciones). Solo cambia comportamiento + se añade lo nuevo.

---

## 1. Autenticación real con verificación

Reemplazo del mock por **Lovable Cloud Auth (email + password con verificación de email + Google)**.

- `useAuthStore` desaparece. `useAuth` pasa a leer `supabase.auth` con `onAuthStateChange` + `getSession`. Listener montado **antes** de `getSession` (regla del template).
- `LoginForm`: `supabase.auth.signInWithPassword`. Errores reales (credenciales inválidas, email sin verificar) mapeados a mensajes claros.
- `SignUpForm`: `supabase.auth.signUp` con `emailRedirectTo: window.location.origin + "/login"`. Tras signup, mostrar pantalla "Revisa tu correo para verificar".
- `ResetPasswordForm`: `resetPasswordForEmail` con `redirectTo: origin + "/reset-password"`. La página `/reset-password` ya existe; le añado handler real `updateUser({ password })` + detección de `type=recovery` en hash.
- Botón "Sign in with Google" en login y signup (Lovable Cloud managed Google OAuth).
- `auth.users` queda con verificación de email **activada** (no auto-confirm).
- `password_hibp_enabled = true`.
- `_authenticated` layout route: `beforeLoad` hace `supabase.auth.getUser()` y redirige a `/login` si no hay sesión, conservando `redirect` en search. La guard actual en `app.tsx` se reemplaza por este patrón canónico.
- TopBar avatar dropdown: muestra email real, botón "Sign out" llama `supabase.auth.signOut()`.

## 2. Modelo de datos por usuario en Lovable Cloud

Migración SQL nueva (todo con RLS estricto, dueño = `auth.uid()`):

- `profiles` (`user_id` UNIQUE FK a `auth.users`, `display_name`, `avatar_url`). Trigger `on_auth_user_created` rellena `profiles` y rol `user`.
- `user_roles` (`user_id`, `role app_role`) + enum `app_role ('admin','user')` + función `has_role(_uid,_role) security definer` (patrón obligatorio).
- `companies` (id uuid, `owner_id`, name, domain, industry, stage, employees, employee_growth, funding, hq, tech_stack text[], icp_score, status, why_now, risk_flags text[], strategy text[], reply_rate, last_activity, created_at).
- `stakeholders` (id, `company_id` FK cascade, `owner_id` denormalizado para RLS, name, title, email, linkedin_url, role, influence, status, touches, last_touch, sentiment, copy jsonb).
- `touchpoints` (id, `company_id`, `stakeholder_id`, `owner_id`, channel, direction, content, sentiment, created_at).
- `activity_events` (id, `owner_id`, `company_id`, type, description, actor, created_at).
- `automations` (id, `owner_id`, name, status, trigger, nodes jsonb, runs, last_run, error_rate).
- `notifications` (id, `owner_id`, title, body, type, read_at, created_at).
- `chat_threads` + `chat_messages` para Deal Captain por DealRoom (`owner_id`, `company_id`).

RLS: para cada tabla, policies SELECT/INSERT/UPDATE/DELETE filtran por `owner_id = auth.uid()`. Validaciones de longitud/tipo via triggers (no CHECK con `now()`).

Realtime: habilitar `supabase_realtime` para `companies`, `stakeholders`, `activity_events`, `notifications` para que la UI se actualice en vivo entre pestañas/dispositivos.

## 3. Stores → backend real

- `useDataStore` deja de cargar seeds. Pasa a ser un caché en memoria poblado por React Query/`useQuery` apuntando a server functions (`createServerFn` con `requireSupabaseAuth`):
  - `listCompanies`, `getCompany(id)`, `createCompany`, `updateCompany`, `deleteCompany`
  - `listStakeholders(companyId)`, `createStakeholder`, `updateStakeholder`, `updateStakeholderStatus`, `deleteStakeholder`
  - `listActivity`, `pushActivity`
  - `listAutomations`, `upsertAutomation`, `deleteAutomation`
  - `listNotifications`, `markRead`, `markAllRead`, `clearAll`
- Suscripción Realtime en hooks de listado (`useCompanies`, `useStakeholders`) → invalidación de queries.
- `useAutomationsStore` y `useNotificationsStore` mantienen UI state local pero la fuente de verdad es la DB. `persist` localStorage se elimina (la DB ya persiste).
- `useThemeStore` se queda en localStorage (preferencia visual del cliente).

## 4. DealRoom vacío + edición inline en tiempo real

`NewDealRoomModal` se simplifica: pide solo **nombre + dominio** y crea un registro mínimo en `companies` (todo lo demás `null`/`[]`/`0`). Sin pasos falsos de "enriching/generating/slack".

`/app/dealrooms/$id` se rediseña funcionalmente (no visualmente):

- Cada bloque de la sidebar izquierda (industry, employees, funding, hq, techStack, whyNow, risks, strategy) usa un componente `EditableField` / `EditableList` con guardado optimista vía `updateCompany`.
- Estado vacío: cuando un campo es `null`/vacío, se muestra placeholder estilizado "Add industry…" + botón "Enrich with AI".
- Stakeholders: panel central muestra empty state con CTA "Add stakeholder" y "Find on LinkedIn (AI)" cuando no hay ninguno. Modal `AddStakeholderModal` con form (name, title, email, linkedin, role, influence) o pestaña "AI lookup".
- Métricas de la barra superior se calculan sobre datos reales; si todo es 0, se muestran "—" en vez de números falsos.
- Edits emiten un `activity_event` ("Maya updated Why Now") que aparece en el feed live.

## 5. Enriquecimiento IA desde "LinkedIn" (Lovable AI Gateway)

Nuevo server function `enrichEntity` (TanStack `createServerFn`, requireSupabaseAuth) que llama a Gemini vía AI Gateway con **structured output** (`Output.object` + zod):

- Input: `{ kind: "company" | "person", query: string, linkedinUrl?: string, companyContext?: {...} }`.
- Modelo: `google/gemini-3-flash-preview`. Si el usuario pega URL de LinkedIn, se incluye en el prompt; el modelo devuelve datos plausibles estructurados (industry, stage, employees, funding, hq, techStack, whyNow[], riskFlags[], strategy[]) o stakeholder (title, role guess, influence 1-5, sentiment, copy: context/email/linkedinDm/callScript/aiRecs[]).
- Aviso visible en UI: "Generated by AI — verifica antes de actuar". (No hacemos scraping real de LinkedIn; eso violaría sus ToS.)

UI:

- Botón **"Enrich with AI"** en la sidebar de DealRoom: abre drawer con input "company name or LinkedIn URL". Al confirmar, server fn devuelve patch parcial → el usuario revisa diff lado a lado → "Apply" hace `updateCompany`. Inserta `activity_event`.
- Botón **"Find stakeholder with AI"** en panel de stakeholders: input "name + LinkedIn URL". Devuelve borrador → el usuario edita → "Save". Crea `stakeholder` row.
- Manejo de errores 429 (rate limit) y 402 (créditos) mostrados como toast claro con CTA.

## 6. Demo de la landing — sandbox aparte

`DemoModal` actual (5 pasos) se mantiene tal cual. Al final, en lugar de "Launch app", añado dos botones:

- **"Sign up free"** → `/signup`.
- **"Explore demo DealRoom"** → ruta nueva pública `/demo/dealroom` que renderiza el detalle de DealRoom usando los **mocks existentes** (`services/mock/deals.ts`, `stakeholders.ts`) en modo solo lectura. Reusa el mismo componente visual que `/app/dealrooms/$id` pero con un `DemoDataProvider` que sirve los seeds y desactiva mutaciones (botones deshabilitados con tooltip "Sign up to edit"). Banner superior "Demo data — your account starts blank". Sin auth requerida.

Los seeds dejan de inyectarse en el store autenticado — solo viven dentro del sandbox demo.

## 7. Notificaciones, Captain chat, Automations conectados a DB

- Notificaciones: `useNotificationsStore` se conecta a `notifications` table. Mark read / clear all hacen update real. Realtime push.
- Deal Captain chat (`/api/chat`): persistir mensajes en `chat_messages` por `company_id` para que el hilo se recupere al volver al DealRoom. System prompt sigue igual.
- Automations: CRUD pasa a `automations` table. Logs de ejecución (`automation_runs` table opcional, o jsonb dentro de la fila).

## 8. Limpieza

- `src/services/mock/*` queda restringido al sandbox demo. Se mueven a `src/services/demo/`.
- `mock-auth-store` (`src/store/auth.ts`) se elimina; su lugar lo toma un hook ligero `useSupabaseAuth`.
- Variables de entorno: ninguna nueva (`LOVABLE_API_KEY` ya existe; Supabase ya configurado).

## Detalles técnicos

- Patrón TanStack: `_authenticated` layout route con `beforeLoad` + redirect; loaders solo dentro de `_authenticated/*`. Componentes públicos llaman server fns vía `useServerFn` + `useQuery`.
- Optimistic updates con React Query (`onMutate` / `onError` rollback) para que la edición se sienta instantánea.
- Validación con Zod en cada `inputValidator` server-side y en cada formulario cliente-side.
- Realtime: un solo canal por tipo de tabla, con filtro `owner_id=eq.${userId}`.
- Migraciones SQL en una sola ejecución del `supabase--migration` con todas las tablas, policies, triggers, enums, función `has_role` y publicación realtime.

## Archivos clave a tocar / crear

Crear:
- `src/lib/auth/useSupabaseAuth.ts`
- `src/lib/dealrooms.functions.ts`, `stakeholders.functions.ts`, `activity.functions.ts`, `automations.functions.ts`, `notifications.functions.ts`, `enrich.functions.ts`
- `src/components/dealrooms/EditableField.tsx`, `EditableList.tsx`, `EnrichDrawer.tsx`, `AddStakeholderModal.tsx`
- `src/routes/_authenticated.tsx` (guard único)
- `src/routes/demo.dealroom.tsx` (sandbox público)
- `src/components/demo/DemoDataProvider.tsx`

Modificar:
- `src/components/auth/LoginForm.tsx`, `SignUpForm.tsx`, `ResetPasswordForm.tsx` (Supabase real + Google)
- `src/lib/auth/useAuth.ts`, `src/store/auth.ts` (eliminar mock)
- `src/components/dealrooms/NewDealRoomModal.tsx` (vacío)
- `src/routes/app.dealrooms.$id.tsx` (campos editables + enrich)
- `src/routes/app.dealrooms.tsx`, `app.stakeholders.tsx`, `app.automations.tsx`, `app.overview.tsx`, `app.intelligence.tsx`, `app.analytics.tsx`, `app.touchpoints.tsx` (queries reales)
- `src/components/landing/DemoModal.tsx` (CTA final)
- `src/store/index.ts`, `src/store/notifications.ts`, `src/store/automations.ts` (delegan a server fns)
- `src/routes/app.tsx` → reemplazado por `_authenticated.tsx`
- `src/routes/index.tsx` (CTA → /signup)

Mover:
- `src/services/mock/*` → `src/services/demo/*`

## Lo que NO cambia

- Diseño visual, paleta, tipografía, layout sidebar/topbar, gradientes, animaciones, copy de marketing en la landing.
- DemoModal de 5 pasos en la landing.
- Sistema de tema claro/oscuro y accent color.

## Riesgos / notas

- Migrar de mock auth a Supabase invalida cualquier "sesión" actual. Los usuarios deberán registrarse de nuevo.
- El "scraping de LinkedIn" es realmente generación IA con structured output — se etiqueta como tal en UI para no engañar al usuario.
- Realtime en planes free de Supabase tiene cuotas; el filtro por `owner_id` mantiene el volumen acotado.
