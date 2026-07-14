# Migration Tracker

Day la master file de theo doi tien do replatform.
Dung file nay cung voi `_parity-checklist-template.md`.

## 1. Status legend

- `NS`: Not started
- `IP`: In progress
- `BL`: Blocked
- `RV`: In review
- `UAT`: User acceptance testing
- `PI`: Pilot ready
- `DN`: Done

## 2. Master tracker

| Module | Phase | Status | Legacy refs | New owner | RBAC | Schema | Parity checklist | Verify | Notes/Risks |
|---|---|---|---|---|---|---|---|---|---|
| Foundation shell | 1 | DN | admin shell, public shell, scan shell | Codex (2026-04-07) | Giltech shell layout, branded sidebar/header, permission gate primitive, foundation dashboard page, shell lane navigation, locale switcher, auth gate middleware | `src/app/layout.tsx`, `src/app/(home)/page.tsx`, `src/components/Layouts/header/index.tsx`, `src/components/Layouts/sidebar/data/index.ts`, `src/components/Layouts/footer/index.tsx`, `src/components/rbac/permission-guard.tsx`, `middleware.ts`, `src/lib/i18n/*` | `docs/init/foundation-shell-parity-checklist.md` | local lint + build | Root shell now hides for guests, auth is mandatory through middleware, and the shell shell chrome is bilingual-ready; shell lane copy still needs a deeper VI/EN pass in remaining module pages |
| Shell module surfaces | 1 | DN | workspace, audience, experience, engagement, system shell lanes | Codex (2026-04-07) | Branded lane landing pages for the target architecture contexts | `src/app/workspace/page.tsx`, `src/app/audience/page.tsx`, `src/app/experience/page.tsx`, `src/app/engagement/page.tsx`, `src/app/system/page.tsx`, `src/lib/shell/module-pages.ts`, `src/components/shell/module-landing.tsx` | `docs/init/shell-module-parity-checklist.md` | local lint + build | Shell lanes are live; actual business feature screens inside each lane still need their own rewrite |
| Template vault | 1 | DN | legacy demo routes, profile/settings demo pages, reusable template components | Codex (2026-04-07) | Archived storage surface for demo routes and reusable UI families | `src/app/system/template-vault/page.tsx`, `src/components/template-vault/template-vault-page.tsx`, `src/lib/shell/template-vault.ts` | `docs/init/shell-module-parity-checklist.md` | local lint + build | Demo routes are hidden from primary navigation but remain accessible from the vault |
| Auth and session | 1 | IP | auth routes, users | Codex (2026-04-07) | Supabase auth bootstrap, sign-in, sign-up, forgot/reset password, session provider, sign-out, public.users mapping, locale-aware auth screens | `src/lib/auth/bootstrap.ts`, `src/components/Auth/session-provider.tsx`, `src/app/auth/sign-in/page.tsx`, `src/app/auth/sign-up/page.tsx`, `src/app/auth/forgot-password/page.tsx`, `src/app/auth/reset-password/page.tsx`, `middleware.ts` | `docs/init/brand-migration-checklist.md` | local lint + build | Auth lifecycle is live and guest entry is blocked globally; callback/provider parity on real Supabase config still needs a production smoke test |
| Legal/footer | 1 | DN | terms/privacy/payment/footer | Codex (2026-04-07) | Branded legal pages and shell footer links | `src/app/(legal)/terms-of-use/page.tsx`, `src/app/(legal)/privacy-policy/page.tsx`, `src/app/(legal)/payment-refund-policy/page.tsx`, `src/components/Layouts/footer/index.tsx`, `src/app/layout.tsx` | `docs/init/foundation-shell-parity-checklist.md` | local lint + build | Legal shell now exists and the main legal pages are VI/EN-ready; final jurisdiction-specific copy still needs review before public release |
| RBAC core | 2 | IP | users, roles, policies, role middleware | Codex (2026-04-07) | SQL RBAC helper RPCs, seed dataset, TS authorization contract, server-side bootstrap context, RBAC admin console mutations, baseline RLS policies, expanded RLS coverage | `supabase/migrations/20260316112756_initial_schema_foundation.sql`, `supabase/migrations/20260407143000_rbac_runtime_helpers.sql`, `supabase/migrations/20260407152000_rbac_rls_baseline.sql`, `supabase/migrations/20260407165000_rbac_runtime_rls_expansion.sql` | `docs/init/postgres-schema-foundation-parity-checklist.md` | local apply + lint + build + sanity queries + sql dry-run | Core RBAC contract, auth bridge, and mutation console are in place; broader auth/session polish and deeper parity still pending |
| Postgres schema foundation | 2 | IP | all core legacy domains in `docs/init/*` | Codex (2026-03-16) | roles, permissions, scopes seeded in SQL | `supabase/migrations/20260316112756_initial_schema_foundation.sql`, `supabase/migrations/20260407143000_rbac_runtime_helpers.sql`, `supabase/migrations/20260407152000_rbac_rls_baseline.sql` | `docs/init/postgres-schema-foundation-parity-checklist.md` | local apply + lint + build + sanity queries + sql dry-run | Full DDL done; RBAC helper RPC + seed dataset + baseline RLS added; backfill and dual-run parity chua xong |
| Company | 2 | IP | `admin.companys.*` | Codex (2026-04-07) | RBAC admin company edit screen + server action, plan selector, domain inventory | `src/app/rbac/companies/page.tsx`, `src/app/rbac/actions.ts`, `src/lib/rbac/admin-data.ts` | `docs/init/postgres-schema-foundation-parity-checklist.md` | local lint + build + sql dry-run | Mutation UI exists; need company/domain/subscription parity review on live data |
| User management | 2 | IP | `admin.users.*` | Codex (2026-04-07) | RBAC admin user role assignment screen + server action, multi-scope assignment editor | `src/app/rbac/users/page.tsx`, `src/components/rbac/user-assignment-card.tsx`, `src/app/rbac/actions.ts`, `src/lib/rbac/admin-data.ts` | `docs/init/postgres-schema-foundation-parity-checklist.md` | local lint + build + sql dry-run | Mutation UI now handles scope-dependent inputs better; still needs production smoke testing |
| Event | 2 | NS | `admin.events.*` |  |  |  |  |  |  |
| Event settings | 2 | NS | `admin.event_settings.*` |  |  |  |  |  |  |
| Event files/media relation | 2 | NS | `admin.event_files.*`, `admin.media.*` |  |  |  |  |  |  |
| Dynamic fields | 2 | NS | `admin.custom_field_templates.*`, `admin.language_defines.*` |  |  |  |  |  |  |
| Clients | 3 | IP | `admin.clients.*` | Codex (2026-04-07) | `client.view`, `client.create`, `client.update`, `client.import`, `client.export` | `src/app/workspace/clients/page.tsx`, `src/components/workspace/client-workspace.tsx`, `src/lib/workspace/clients.ts`, `src/app/workspace/actions.ts` | `docs/init/workspace-clients-parity-checklist.md` | local lint + build | Dedicated client workspace is live; bulk import/export and worker parity still pending |
| Check-in | 3 | IP | `admin.checkins.*`, scan routes | Codex (2026-04-07) | `checkin.view`, `checkin.run` | `src/app/checkin/page.tsx`, `src/components/checkin/checkin-runtime.tsx`, `src/lib/checkin/runtime.ts`, `src/app/checkin/actions.ts` | `docs/init/checkin-runtime-parity-checklist.md` | local lint + build | Dedicated check-in runtime is live; live scan parity and production smoke testing still pending |
| Offline sync | 3 | IP | scan offline routes | Codex (2026-04-07) | `checkin.run`, `checkin.manage` | `src/app/sync-offline/page.tsx`, `src/components/checkin/offline-sync.tsx`, `src/lib/checkin/runtime.ts`, `src/app/sync-offline/actions.ts` | `docs/init/checkin-runtime-parity-checklist.md` | local lint + build | Dedicated sync queue is live; reset/replay and worker execution still pending |
| Reports | 3 | IP | `admin.reports.*` | Codex (2026-04-07) | `report.view` | `src/app/reports/page.tsx`, `src/components/reports/report-parity.tsx`, `src/lib/reports/parity.ts` | `docs/init/report-parity-checklist.md` | local lint + build | Dedicated report parity screen is live; drill-down, export, and legacy compare are still open |
| Landing page | 4 | NS | `admin.landing_pages.*`, `/register/{slug}` |  |  |  |  |  |  |
| Registration success/public docs | 4 | NS | public qr/card/document routes |  |  |  |  |  |  |
| Campaigns | 5 | NS | `admin.campaigns.*`, `admin.campaign_details.*` |  |  |  |  |  |  |
| Emails reporting | 5 | NS | `admin.emails.*` |  |  |  |  |  |  |
| Email templates | 5 | NS | `admin.email_templates.*` |  |  |  |  |  |  |
| Email senders | 5 | NS | `admin.email_senders.*` |  |  |  |  |  |  |
| Labels/print templates | 6 | NS | `admin.labels.*`, `admin.label_details.*` |  |  |  |  |  |  |
| Cards | 6 | NS | `admin.cards.*`, `admin.card_details.*` |  |  |  |  |  |  |
| Print runtime | 6 | NS | direct print, render label/card |  |  |  |  |  |  |
| Lucky draw core | 7 | NS | `admin.lucky_draws.*` |  |  |  |  |  |  |
| Lucky draw builder/runtime | 7 | NS | builder/display/draw routes |  |  |  |  |  |  |
| Audio support | 7 | NS | `admin.audios.*` |  |  |  |  |  |  |
| Chatbot | 8 | NS | `admin.chatbot.n8n.*` |  |  |  |  |  |  |
| History/logs | 8 | NS | `admin.histories.*`, `admin.logs` |  |  |  |  |  |  |
| Data backfill | 9 | NS | MySQL -> PostgreSQL |  |  |  |  |  |  |
| Cutover readiness | 9 | NS | all modules |  |  |  |  |  |  |

## 3. Schema tracker

| Domain | Legacy status | Target Postgres status | Mapping done | Backfill done | Verification done | Notes |
|---|---|---|---|---|---|---|
| identity/users | legacy-only | IP | IP | NS | IP | `auth.users -> public.users`, `roles`, `permissions`, `user_access_scopes` da apply va lint tren local Supabase |
| companies | legacy-only | IP | IP | NS | IP | `companies`, `company_domains`, `subscription_plans`, `company_subscriptions` |
| events | legacy-only | IP | IP | NS | IP | `events`, `event_settings`, `event_areas`, `event_files`, `custom_field_templates`, `language_defines`, `media` |
| clients/checkins | legacy-only | IP | IP | NS | IP | `clients`, `client_backups`, `client_custom_field_values`, `scanner_devices`, `scan_offline_batches`, `checkins`; dedicated workspace/runtime routes live |
| reports query foundation | legacy-only | IP | IP | NS | IP | `reports`, `report_runs`; dedicated parity route live, legacy compare still pending |
| campaigns/email | legacy-only | IP | IP | NS | IP | `email_senders`, `email_templates`, `email_template_unlock_requests`, `campaigns`, `campaign_details`, `emails` |
| landing pages | legacy-only | IP | IP | NS | IP | `landing_pages`, `landing_page_submissions` |
| labels/cards/print | legacy-only | IP | IP | NS | IP | `labels`, `label_details`, `cards`, `card_details`, `printers`, `print_jobs`, `print_job_items` |
| lucky draw | legacy-only | IP | IP | NS | IP | `audios`, `lucky_draws`, `lucky_draw_rewards`, `lucky_draw_clients`, `lucky_draw_winners` |
| chatbot | legacy-only | IP | IP | NS | IP | `n8n_chat_sessions`, `n8n_chat_messages`, `histories`, `system_logs`, `integration_logs`, `background_jobs` |

## 4. RBAC tracker

| Item | Status | Notes |
|---|---|---|
| Role templates defined | DN | Seed role records va TS role templates da align |
| Permission registry approved | DN | `docs/init/permission-registry.md` da phu hop voi migration va TS registry |
| Scope model approved | DN | `user_access_scopes` + helper RPCs + TS scope contract da co |
| Auth user -> profile user mapping | IP | Trigger `handle_auth_user_created()` da co trong migration nen |
| Server authorize helper | DN | `current_user_has_permission()`, `user_has_permission()`, `get_user_rbac_context()` |
| Frontend permission payload | DN | `createRbacPayload()` trong `src/lib/rbac/authorize.ts` |
| RLS baseline policies | DN | Baseline policies da co cho core company/user/event/client/check-in/report/legal tables |
| Admin role assignment UI | IP | Read-only RBAC console routes da co; mutation flow va assign actions chua xong |

## 5. Critical parity gates

Khong duoc full cutover neu chua pass tat ca:

- [ ] Company/Event/User access parity
- [ ] Client import/export parity
- [ ] Check-in runtime parity
- [ ] Report numbers parity
- [ ] Landing page registration parity
- [ ] Campaign send/report parity
- [ ] Label/Card/Print parity
- [ ] Lucky draw runtime parity
- [ ] Chatbot parity
- [ ] Legal/footer/auth parity
- [ ] Brand migration parity (Delfi -> Giltech)

## 6. Brand migration tracker

| Area | Status | Owner | Notes |
|---|---|---|---|
| Product name in UI | NS |  |  |
| Company legal name | NS |  |  |
| Logos/favicon/assets | NS |  |  |
| Legal pages/company owner info | NS |  |  |
| Email sender/from-name templates | NS |  |  |
| Domain/URL references | NS |  |  |
| Docs/help/hotline/contact | NS |  |  |
| Seed/default config values | NS |  |  |

## 7. How to use

Sau moi task/module:

1. Update bang `Master tracker`.
2. Neu doi schema, update `Schema tracker`.
3. Neu dung vao auth/quyen, update `RBAC tracker`.
4. Tao parity checklist rieng cho module do dua tren `_parity-checklist-template.md`.
5. Ghi ro risk neu chua dat parity.
6. Neu module co touch brand/legal/domain/mail, update them `Brand migration tracker`.
