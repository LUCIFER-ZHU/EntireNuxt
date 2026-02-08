# AGENTS.md

## Commands
- `pnpm dev` - Start dev server with .env.development
- `pnpm dev2` - Start dev server with .env.development2
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint (no tests in project)
- `pnpm lint:fix` - Auto-fix ESLint issues

## Libraries
- UI: @nuxt/ui v4.1.0 for buttons/forms
- Images: @nuxt/image v1.11.0, use NuxtImg component
- Device: @nuxtjs/device for device detection

## Code Style
- Use `<script setup lang="ts">` with Composition API
- Add JSDoc comments on exported functions
- Define interfaces for TypeScript types
- Navigation: use `navigateTo()`, never `router.push()`
- API calls: use `$customFetch` from fetch-interceptor plugin
- Notifications: use `$toast` from toast plugin

## Responsive Design
- Fonts: `clamp(min_px, vw_value, max_px)` for PC+Mobile
- Mobile spacing: padding/margin/gap/border-radius in `vw` units
- Use `const { isMobile } = useDeviceDetection()` in composables
- Add `:class="{ 'is-mobile': isMobile }"` in templates
- Prefer CSS (grid/flex) over v-if for layout differences
- Use v-if only when structure completely differs

## SCSS Organization
- PC styles first, Mobile styles after
- Marker comment: `/* ------------------------------------Mobile样式----------------------------*/`
- After `@include`, wrap extra styles in `&{}` block
- Use `.is-mobile` class or `.mobile-xxx` prefixes for mobile-specific styles

## Error Handling
- Try/catch API calls, log errors, show user-friendly $toast messages
- ESLint rules are lenient: no-explicit-any allowed, no unused-var checks
