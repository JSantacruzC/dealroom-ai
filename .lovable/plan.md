# Plan de correcciones — DealRoom Orchestrator

Mantengo intacto el diseño, tipografía, sidebar, gradientes y aesthetic premium. Solo se corrige funcionalidad y se añaden controles donde faltan.

## 1. Inicio de sesión funcional (modo mock)

Como el backend ya está stripped a mock, el login real de Supabase no encaja. Voy a:

- Reescribir `LoginForm` y `SignUpForm` para usar un **mock auth store** (`useAuthStore` en zustand con `persist` en localStorage). Cualquier email/contraseña válidos crean una sesión local.
- Reescribir `useAuth` para leer del store (sin Supabase).
- Añadir `ProtectedRoute` lógico en `/app` (`beforeLoad` redirige a `/login` si no hay sesión).
- En la landing, el botón **Launch app** y los CTA llevan a `/login` si no hay sesión, o directo a `/app/overview` si sí.
- Tras login → `/app/overview` con un **onboarding banner** (dismissible) que enlaza a las acciones clave para “empezar a usar la app en serio”: crear DealRoom, importar/añadir stakeholder, conectar integración, configurar ICP. Esto no rediseña nada, solo añade un card en la parte superior del overview con 4 quick-actions.
- TopBar: añadir avatar con dropdown (perfil + Logout).

## 2. Botón “Watch demo” en la landing

Reemplazar el ancla `#how` por un botón que abre un **DemoModal** (Dialog full-screen sobre fondo oscuro con blur). El modal reproduce un tour guiado autoplay de ~45s:

- Pasos animados (framer-motion) que recorren mockups de las 5 pantallas clave: ICP trigger → Enrich → DealRoom Mission Control → Captain chat → Analytics.
- Barra de progreso, controles Play/Pause/Skip, botón “Launch app” al final.
- Reutiliza estilos existentes (cards, gradientes, dot grid). Sin rediseño.

## 3. Panel de notificaciones

Reemplazar el botón Bell que solo resetea el contador por un **Popover real** anclado al icono:

- Nuevo store `useNotificationsStore` (zustand + persist) con lista tipada `{id, title, body, type, unreadAt, read}`.
- TopBar: el `bumpNotification` ahora inyecta una notificación realista desde un pool (nuevo reply, riesgo detectado, reunión reservada, etc.).
- Popover (max-h con scroll interno, ancho ~380px, alineado a la derecha, no rompe layout):
  - Header: título “Notifications” + dos botones pequeños: **Mark all read** y **Clear all**.
  - Lista ordenada por timestamp desc, agrupada por “Today / Earlier”.
  - Cada item: icono por tipo, título, body corto, hora relativa, dot azul si unread.
  - **Hover** sobre item revela dos micro-botones: ✓ marcar leído, ✕ borrar.
  - Empty state ilustrado.
- Badge rojo solo cuenta los `unread`.

## 4. Tema claro/oscuro y color de acento reales

Actualmente `:root` y `.dark` definen la misma paleta oscura → el toggle no hace nada.

- En `styles.css` añadir una paleta clara real bajo `:root` (mantener la actual bajo `.dark`). Mismos tokens semánticos, recalibrados en oklch para light mode (background claro, foreground oscuro, surfaces, etc.). Gradientes y shadows ajustados.
- Crear `useThemeStore` (zustand + persist): `theme: "dark" | "light" | "system"` y `accent: hex`. En mount, aplica `document.documentElement.classList.toggle("dark", ...)` y setea `--primary`/`--ring`/`--gradient-primary` derivados del accent.
- TopBar: el icono Moon/Sun ahora togglea `dark`/`light` y persiste.
- Settings → Appearance: los botones de Theme y los swatches de Accent se vuelven controlados (`onClick` que llama al store). El swatch activo refleja el estado real, no el índice 0 hardcoded.
- Verificar contrastes en todas las páginas clave (Sidebar, TopBar, cards, Intelligence terminal).

## 5. Automations — totalmente funcional

Estado actual: ya hay drag-and-drop de la librería y config controlada, pero el usuario reporta que sigue sin servir. Lo que falta:

- **Crear automatización**: ya existe; añadir prompt de nombre y selector de trigger inicial al crear (modal pequeño). Persistir en zustand (no solo state local) para que sobrevivan navegación.
- **Editar nodo**: además de Display name / Timeout / Retry, permitir **renombrar** (refleja en el canvas), **eliminar nodo** (botón 🗑 en el panel de config), y **reordenar** (botones ←/→).
- **Eliminar automatización** y **duplicar** desde menú en cada tab.
- **Renombrar automatización** inline (doble clic en el tab).
- **Activar/Pausar** ya funciona; añadir **“Run now”** que inyecta un log nuevo en Execution Logs con estado `running` → `success` tras 1.2s (toast incluido).
- **Conexiones del canvas**: dejar de calcularse desde índices; usar un grafo simple `{nodes, edges}` por automatización para que reorder/delete actualice las flechas correctamente.
- **Persistencia**: mover `automations`, `extraNodes`, `statusOverrides`, `nodeConfigs` a `useAutomationsStore` (zustand + persist en localStorage).
- **Validación visual**: si una automatización no tiene trigger, mostrar warning chip en su tab.

## Archivos a tocar

- `src/lib/auth/useAuth.ts` (mock), `src/components/auth/LoginForm.tsx`, `SignUpForm.tsx`, `ResetPasswordForm.tsx`, `ProtectedRoute.tsx`
- `src/store/index.ts` (+ nuevos slices: theme, notifications, automations) o nuevos archivos en `src/store/`
- `src/styles.css` (paleta light + tokens dinámicos de accent)
- `src/routes/index.tsx` (Watch demo → modal, CTA → login)
- `src/components/landing/DemoModal.tsx` (nuevo)
- `src/components/layout/TopBar.tsx` (Bell popover, theme toggle real, avatar)
- `src/components/notifications/NotificationsPanel.tsx` (nuevo)
- `src/routes/app.settings.tsx` (Appearance controlado)
- `src/routes/app.automations.tsx` (CRUD completo, persistencia)
- `src/routes/app.overview.tsx` (banner onboarding 4 quick-actions)
- `src/routes/app.tsx` (`beforeLoad` guard mock)

## Detalle técnico

- Auth: cero llamadas a Supabase en este flujo. El cliente Supabase queda solo para edge function de chat (Gemini), no toca auth.
- Tokens dinámicos: el accent override se hace inyectando un `<style>` en `<head>` con `:root { --primary: ... }` calculado vía oklch a partir del hex elegido (helper `hexToOklch`).
- Notificaciones popover: usar `@/components/ui/popover` ya disponible en shadcn; max-height con scroll interno, animación fade+scale.
- Demo modal: framer-motion `AnimatePresence`, autoplay con `useEffect`+`setTimeout`, pausable.
- Automations grafo: tipo `{ id, label, icon, type }` para nodos y `{from, to}` para edges; el SVG itera edges en lugar de pares consecutivos.

No se introducen migraciones de base de datos ni nuevas dependencias.
