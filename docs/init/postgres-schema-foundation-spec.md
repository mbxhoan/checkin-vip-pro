# Postgres Schema Foundation Spec

## 1. Basic info

- Module name: Postgres schema foundation
- Business owner: Replatform core
- Priority: P0
- Legacy routes: all core bounded contexts from `admin.companys.*`, `admin.events.*`, `admin.clients.*`, `admin.checkins.*`, `admin.reports.*`, `admin.landing_pages.*`, `admin.campaigns.*`, `admin.labels.*`, `admin.cards.*`, `admin.lucky_draws.*`, `admin.chatbot.n8n.*`
- Legacy controllers/services: legacy Laravel admin/public/scan surfaces and associated model layer
- Main entities: companies, users, roles, permissions, user access scopes, events, event settings, custom fields, clients, checkins, reports, landing pages, campaigns, email templates, labels, cards, lucky draws, chatbot sessions/messages, jobs, logs
- New app routes: n/a, schema-only foundation
- Target Postgres tables: `companies`, `company_domains`, `subscription_plans`, `company_subscriptions`, `users`, `roles`, `permissions`, `role_permissions`, `user_access_scopes`, `events`, `event_settings`, `event_areas`, `custom_field_templates`, `language_defines`, `media`, `event_files`, `landing_pages`, `landing_page_submissions`, `clients`, `client_backups`, `client_custom_field_values`, `scanner_devices`, `scan_offline_batches`, `checkins`, `reports`, `report_runs`, `email_senders`, `email_templates`, `email_template_unlock_requests`, `campaigns`, `campaign_details`, `emails`, `labels`, `label_details`, `cards`, `card_details`, `printers`, `print_jobs`, `print_job_items`, `audios`, `lucky_draws`, `lucky_draw_rewards`, `lucky_draw_clients`, `lucky_draw_winners`, `n8n_chat_sessions`, `n8n_chat_messages`, `background_jobs`, `integration_logs`, `histories`, `system_logs`, `legal_documents`, `user_legal_acceptances`

## 2. Business goal

Tao bo schema Supabase/PostgreSQL dau tien cho toan bo he thong moi de:

- giu lai entity model va relationship model cot loi cua he thong cu;
- tach auth identity khoi business profile;
- dat nen tang cho RBAC `role + permission + scope`;
- giu du cho import/export/check-in/print/campaign/chatbot co the map tiep ma khong phai sua schema goc lan nua.

## 3. Personas

- Platform engineer
- Backend engineer
- Data migration owner
- QA/parity reviewer

## 4. User stories

- Toi la `platform engineer`, toi muon co mot migration SQL nen, de cac module sau dung chung cung mot target schema.
- Toi la `data migration owner`, toi muon schema moi giu du y nghia business va FK, de backfill tu MySQL sang Postgres khong mat nghia.
- Toi la `backend engineer`, toi muon auth profile, role, permission va scope tach ro, de co the viet `authorize(user, permission, scope)` o app layer.

## 5. Screen inventory

| Screen | Purpose | Legacy reference | New route |
|---|---|---|---|
| Migration file | DDL cho toan bo domain | legacy DB + docs/init | n/a |
| RBAC seed | seed roles/permissions co ban | policies, role middleware | n/a |
| Auth profile bridge | map `auth.users -> public.users` | legacy users/auth lifecycle | n/a |
| Audit/job foundation | logs, histories, jobs, integrations | logs/history/chatbot/email/print flows | n/a |

## 6. Core actions

| Action | API/handler | Role/permission | Scope | Notes |
|---|---|---|---|---|
| Apply initial migration | Supabase migration runner | platform only | system | Tao toan bo schema goc |
| Seed RBAC contracts | migration seed block | platform only | system | Seed roles/permissions de app layer map tiep |
| Auto-create profile from auth user | `handle_auth_user_created()` trigger | system | self | Supabase Auth identity -> business profile |
| Backfill legacy data | follow-up scripts | platform only | system | Chua nam trong task nay |

## 6.1 Legacy to new mapping

| Legacy item | New item | Keep as-is | Refactor | Redesign |
|---|---|---|---|---|
| `companys` | `companies` |  | x |  |
| `users` + auth state | `auth.users` + `public.users` |  | x | x |
| `roles`, `role_user`, policy scope | `roles`, `permissions`, `role_permissions`, `user_access_scopes` |  |  | x |
| `events` | `events` | x |  |  |
| `event_settings` | `event_settings` | x |  |  |
| `custom_field_templates` | `custom_field_templates` | x |  |  |
| `language_defines` | `language_defines` | x |  |  |
| `clients` | `clients` | x |  |  |
| dynamic field values dang string/json | `client_custom_field_values` + `jsonb` |  | x |  |
| `checkins` | `checkins` | x |  |  |
| scanner runtime state | `scanner_devices`, `scan_offline_batches` |  | x | x |
| `reports` + runtime cache | `reports`, `report_runs` |  | x |  |
| `landing_pages` | `landing_pages` | x |  |  |
| `campaigns`, `campaign_details`, `emails` | same table set | x |  |  |
| `email_templates` | `email_templates` | x |  |  |
| `labels`, `label_details` | same table set | x |  |  |
| `cards`, `card_details` | same table set | x |  |  |
| print runtime/logging | `printers`, `print_jobs`, `print_job_items` |  | x | x |
| `lucky_draws`, `rewards`, `clients` | same table set + `lucky_draw_winners` | x | x |  |
| `n8n_chat_sessions`, `n8n_chat_messages` | same table set | x |  |  |
| histories/logs | `histories`, `system_logs`, `integration_logs` |  | x |  |

## 7. RBAC matrix

| Role | View | Create | Update | Delete | Export | Special actions |
|---|---|---|---|---|---|---|
| system_admin | all | all | all | all | all | cross-company, billing, legal, logs |
| company_admin | company/event/audience/content | yes | yes | limited by permission | yes | assign roles, manage company scope |
| event_manager | event/audience/report | yes | yes | limited by permission | yes | check-in/report operations |
| report_analyst | report/client/checkin read | no | no | no | yes | analytics only |
| scanner_device | client/checkin read | no | runtime only | no | no | scan/check-in only |

## 8. Data and state requirements

- Filters: theo company, event, status, schedule, provider, job status
- Sorts: `created_at`, `updated_at`, `starts_at`, `scheduled_at`, `sort_order`
- Search: slug/code/name/email/public_id/provider ids
- Bulk actions: import/export/send/generate/print/draw se dua vao tables job/runtime da co san
- Loading states: de cho app layer xu ly sau, schema da co `status`, `metadata`, `result_payload`, `error_message`
- Empty state: khong ap dung o cap schema
- Error state: `error_message`, `metadata`, `integration_logs`, `system_logs`
- Permission denied state: de app layer xu ly, schema cung cap `roles/permissions/scopes`

## 9. UX rules

- Khong ap dung truc tiep vi day la schema foundation.
- Uu tien query ownership qua server layer, khong expose business CRUD truc tiep tu client.
- Runtime check-in/print/chatbot can co bang rieng cho state/log de UI sau nay toi uu toc do.

## 10. Integration notes

- Queue/job: `background_jobs`
- External API: `integration_logs`, `email_senders`, `emails`, `n8n_chat_*`
- File upload/download: `media`, `event_files`
- Realtime/websocket: de sau, schema hien tai giu event/log table de pub/sub
- Print/render: `printers`, `print_jobs`, `print_job_items`, `labels`, `cards`
- Supabase auth/RLS: co trigger `auth.users -> public.users`; RLS baseline policies da co cho core company/user/event/client/check-in/report/legal tables

## 11. Acceptance criteria

- [x] Cover toan bo domain cot loi thanh bang Postgres/Supabase
- [x] Co relationship/FK cho company -> event -> audience/content/runtime
- [x] Co auth/business split va RBAC seed tables
- [x] Co mapping table giu, table refactor, table redesign
- [ ] Co mysql-to-postgres column map chi tiet tung cot
- [ ] Co backfill scripts
- [ ] Co dual-run verification voi he thong cu
- [x] Co RLS baseline policies cho core tables

## 12. Assumptions and known gaps

- Repo hien khong co `docs/ERD.md` hay legacy schema dump, nen migration nay duoc suy ra tu `docs/init/*` va route/module inventory.
- Uu tien `jsonb` cho cac payload/chieu rong domain chua duoc chot chi tiet thay vi doan sai tung cot.
- Co seed role/permission co ban, app-layer authorization helpers/FE payload, bootstrap context, va baseline RLS da co; mutation flows chua xong.
- Chua co backfill uniqueness strategy cho `legacy_id`; cot duoc giu lai de task backfill sau map du lieu.
