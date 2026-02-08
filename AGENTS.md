# AGENTS.md

## Commands
- `pnpm dev` - Start dev server with .env.development
- `pnpm dev2` - Start dev server with .env.development2
- `pnpm build` - Production build (runs scripts/build.js)
- `pnpm generate` - Generate static site with .env.production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint (no tests in project)
- `pnpm lint:fix` - Auto-fix ESLint issues
- `pnpm db:migrate` - Run Prisma migrations (dev)
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:studio` - Open Prisma Studio

## Libraries
- **UI**: @nuxt/ui v4.3.0 for buttons/forms (https://ui.nuxt.com/docs/components)
- **Images**: @nuxt/image v1.11.0 - use `NuxtImg` component (never raw `<img>`)
- **Device**: @nuxtjs/device v4.0.0 - use `useDeviceDetection()` composable
- **State**: Pinia + pinia-plugin-persistedstate for persistent stores
- **Notifications**: vue-toastification - use `$toast` from toast plugin

## Code Style

### Vue Components
- Use `<script setup lang="ts">` with Composition API
- Add JSDoc comments on exported composables and complex functions
- Define interfaces for TypeScript types (avoid `any` when possible, though lint allows it)
- Navigation: always use `navigateTo()`, never `router.push()`
- Use `ClientOnly` wrapper for client-only components (UIcon, etc.)

### Imports
- Composables: use `const { foo } = useBar()` pattern
- Plugins: access via `const { $custom } = useNuxtApp()` or `const config = useRuntimeConfig()`
- Components: Nuxt auto-imports, no manual imports needed
- Images: use `const { buildImageUrl, buildBackendImageUrl } = useImageUrl()`

### TypeScript
- Strict TypeScript is configured via tsconfig.json
- ESLint allows `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-unused-vars` (lenient)
- Use `Record<string, any>` for flexible prop types when needed

### Error Handling
- API calls: use `$customFetch` or `$customUseFetch` from fetch-interceptor plugin
- Wrap async requests in try/catch blocks
- Log errors to console
- Show user-friendly messages with `$toast.error()`, `$toast.success()`, etc.
- 401 responses auto-redirect to login via fetch-interceptor

## Responsive Design
- **Fonts**: `clamp(min_px, vw_value, max_px)` for PC+Mobile unification
  ```scss
  font-size: clamp(14px, 1.0417vw, 20px);
  ```
- **Mobile spacing**: padding/margin/gap/border-radius in `vw` units
- **Device detection**: `const { isMobile } = useDeviceDetection()` in composables
- **Template**: add `:class="{ 'is-mobile': isMobile }"` to root/container elements
- **Layout preference**: Use CSS (grid/flex) over v-if for layout differences
- **v-if usage**: Only when structure completely differs (not just layout)

## SCSS Organization
- **Order**: PC styles first, Mobile styles after
- **Marker comment**: `/* ------------------------------------Mobile样式----------------------------*/`
- **After @include**: wrap extra styles in `&{}` block
  ```scss
  .button {
    @include default-btn;
    & {
      font-size: clamp(12px, 3.2vw, 14px);
    }
  }
  ```
- **Mobile styles**: use `.is-mobile` class or `.mobile-xxx` prefixes
- **Variables**: defined in `app/assets/scss/variables.scss` (colors, mixins)
- **Mixins available**: `flex-center`, `transition-base`, `default-btn`, `hover-lift-effect`, `chat-btn`

## API Integration
- **Fetch methods**: `$customFetch` (direct), `$customUseFetch`, `$customUseLazyFetch`
- **Base URL**: Auto-appends `NUXT_PUBLIC_API_BASE` (dev: proxy, prod: real URL)
- **Credentials**: `include` for cookies (SSR-compatible)
- **Image URLs**: Use `buildImageUrl()` for static, `buildBackendImageUrl()` for API images
- **Environment vars**: Access via `useRuntimeConfig().public.xxx` or `config.xxx` (server-only)

## Project Structure
- `app/api/` - API endpoint definitions
- `app/assets/` - SCSS, images, fonts, iconfont
- `app/components/` - Vue components (editor/, reNew/, pages/, mobEditor/)
- `app/composables/` - Reusable composition functions
- `app/layouts/` - Page layouts (default, account)
- `app/middleware/` - Route middleware (auth)
- `app/pages/` - File-based routing
- `app/plugins/` - Nuxt plugins (fetch-interceptor, toast, error-handler, auth, aos, cookieconsent)
- `app/stores/` - Pinia stores
- `server/` - Server API/middleware
- `scripts/` - Build scripts
