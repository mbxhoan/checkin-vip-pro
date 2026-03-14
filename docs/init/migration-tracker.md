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
| Foundation shell | 1 | NS | admin shell, public shell, scan shell |  |  |  |  |  |  |
| Auth and session | 1 | NS | auth routes, users |  |  |  |  |  |  |
| Legal/footer | 1 | NS | terms/privacy/payment/footer |  |  |  |  |  |  |
| RBAC core | 2 | NS | users, roles, policies, role middleware |  |  |  |  |  |  |
| Company | 2 | NS | `admin.companys.*` |  |  |  |  |  |  |
| User management | 2 | NS | `admin.users.*` |  |  |  |  |  |  |
| Event | 2 | NS | `admin.events.*` |  |  |  |  |  |  |
| Event settings | 2 | NS | `admin.event_settings.*` |  |  |  |  |  |  |
| Event files/media relation | 2 | NS | `admin.event_files.*`, `admin.media.*` |  |  |  |  |  |  |
| Dynamic fields | 2 | NS | `admin.custom_field_templates.*`, `admin.language_defines.*` |  |  |  |  |  |  |
| Clients | 3 | NS | `admin.clients.*` |  |  |  |  |  |  |
| Check-in | 3 | NS | `admin.checkins.*`, scan routes |  |  |  |  |  |  |
| Reports | 3 | NS | `admin.reports.*` |  |  |  |  |  |  |
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
| identity/users | legacy-only | NS | NS | NS | NS |  |
| companies | legacy-only | NS | NS | NS | NS |  |
| events | legacy-only | NS | NS | NS | NS |  |
| clients/checkins | legacy-only | NS | NS | NS | NS |  |
| reports query foundation | legacy-only | NS | NS | NS | NS |  |
| campaigns/email | legacy-only | NS | NS | NS | NS |  |
| landing pages | legacy-only | NS | NS | NS | NS |  |
| labels/cards/print | legacy-only | NS | NS | NS | NS |  |
| lucky draw | legacy-only | NS | NS | NS | NS |  |
| chatbot | legacy-only | NS | NS | NS | NS |  |

## 4. RBAC tracker

| Item | Status | Notes |
|---|---|---|
| Role templates defined | NS |  |
| Permission registry approved | NS |  |
| Scope model approved | NS |  |
| Auth user -> profile user mapping | NS |  |
| Server authorize helper | NS |  |
| Frontend permission payload | NS |  |
| RLS baseline policies | NS |  |
| Admin role assignment UI | NS |  |

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
