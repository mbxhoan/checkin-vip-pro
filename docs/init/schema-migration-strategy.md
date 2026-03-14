# Schema Migration Strategy: MySQL To PostgreSQL

Tai lieu nay dinh nghia cach chuyen schema tu MySQL hien tai sang PostgreSQL/Supabase trong khi van giu khoang 70% y nghia va quan he nghiep vu.

## 1. Nguyen tac

`Giu 70% schema` nen hieu la:

- giu `entity model`;
- giu `relationship model`;
- giu `business meaning`;
- giu `critical fields` va `critical statuses`.

Khong nen hieu la:

- copy ten bang/ten cot 1:1 moi cho;
- copy ky thuat MySQL khong phu hop Postgres;
- giu lai moi technical debt cua schema cu.

## 2. Nen giu nguyen

- Nhom entity chinh:
  - company
  - user
  - role
  - event
  - custom field
  - client
  - checkin
  - campaign
  - email template metadata
  - label
  - card
  - landing page
  - lucky draw
  - chatbot session/message
- Quan he chinh:
  - company -> users/events
  - event -> clients/checkins/campaigns/landing_pages/labels/cards/lucky_draws
  - campaign -> campaign_details
  - label -> label_details
  - card -> card_details
- Cac status nghiep vu va feature flags cot loi.

## 3. Nen doi trong Postgres

### 3.1 Data types

- `TEXT`/JSON string -> `jsonb` neu du lieu la object/array thuc su
  - vi du: `custom_fields`, `settings`, `blocks`
- `tinyint(1)` -> `boolean`
- string status lap lai qua nhieu -> `check constraint` hoac `enum table`
- datetime fields -> `timestamptz`

### 3.2 Naming strategy

Khuyen nghi giu `snake_case`, nhung co the chuan hoa:

- `companys` -> `companies`
- `countrys` -> `countries`
- cac ten bang sai chinh ta nen sua o app moi

Day la mot trong 30% nen doi.

### 3.3 Auth split

Bang `users` nghiep vu nen tach khoi auth identity cua Supabase:

- `auth.users` cho identity
- `public.users` cho profile, company relation, role assignment, status, metadata nghiep vu

Can co mapping:

- `public.users.auth_user_id -> auth.users.id`

### 3.4 Multi-tenant scope tables

Nen them bang membership/scope thay vi phu thuoc qua manh vao `users.company_id` va `users.event_id`.

Vi du:

- `user_company_memberships`
- `user_event_memberships`

Dieu nay giup RBAC moi linh hoat hon schema cu.

## 4. Phan loai bang theo chien luoc migration

### 4.1 Lift-and-shift gan nhu nguyen ven

Nen giu gan nguyen:

- `events`
- `clients`
- `checkins`
- `campaigns`
- `campaign_details`
- `labels`
- `label_details`
- `cards`
- `card_details`
- `landing_pages`
- `lucky_draws`
- `lucky_draw_rewards`
- `lucky_draw_clients`
- `n8n_chat_sessions`
- `n8n_chat_messages`

### 4.2 Refactor nhe

Nen giu domain nhung doi ky thuat:

- `users`
- `roles`
- `role_user`
- `event_settings`
- `custom_field_templates`
- `language_defines`
- `media`
- `event_files`

### 4.3 Redesign

Nen thiet ke lai ro hon:

- auth/identity
- permissions/scope membership
- background job tracking
- print device runtime/logging
- billing/legal/subscription neu ban mo rong SaaS nghiem tuc

## 5. Mapping quy tac cot du lieu

| Kieu cot hien tai | Xu ly trong Postgres |
|---|---|
| `id` int auto increment | `bigint generated` hoac `uuid` tuy domain |
| FK den entity cot loi | uu tien `bigint` neu muon migrate du lieu de hon |
| du lieu runtime cong khai | co the su dung `uuid/public_code` song song voi id noi bo |
| `custom_fields` text json | `jsonb` |
| `settings` text json | `jsonb` |
| `blocks` text json | `jsonb` |
| `status` varchar | enum/check/table |
| `created_at`, `updated_at` | `timestamptz` |

## 6. ID strategy

Khuyen nghi thuc dung:

- Giu `bigint` cho phan lon bang core de de migrate MySQL sang.
- Them `uuid/public_id` cho entity can expose ra ngoai.

Khong nen doi tat ca sang UUID neu team muon build nhanh va import data cu.

## 7. Migration process de xuat

### Phase A. Domain normalization

- ve lai target ERD Postgres
- danh dau bang `giu nguyen`, `refactor`, `redesign`
- chot naming conventions

### Phase B. DDL design

- viet schema Postgres moi
- them constraints/index/jsonb structure
- bo sung membership tables cho RBAC

### Phase C. Data mapping

- map table cu -> table moi
- map column cu -> column moi
- map status/enum
- map auth user sang profile user

### Phase D. Backfill scripts

- import seed/core tables truoc
- import relation tables sau
- verify counts
- verify random samples

### Phase E. Dual-run verification

- chay song song mot vai report/check-in queries
- doi chieu ket qua MySQL cu va Postgres moi
- xu ly mismatch truoc khi cutover

## 8. Bang nao nen uu tien lam truoc

1. users / auth mapping
2. companies
3. events
4. clients
5. checkins
6. custom fields / event settings
7. reports query foundation
8. campaigns / templates
9. labels / cards
10. lucky draw
11. chatbot

## 9. Supabase-specific notes

- File/media co the dua qua Supabase Storage nhung metadata van o Postgres.
- RLS can can nhac ky voi bang multi-tenant.
- Long-running jobs khong nen dua het vao Edge Functions.
- Generated types tu Postgres schema nen tro thanh contract cho app Next.js.

## 10. Artefacts nen tao tiep theo

- `postgres-target-erd.md`
- `mysql-to-postgres-column-map.md`
- `seed-and-backfill-plan.md`
- `auth-and-membership-model.md`

## 11. Definition of Done cho schema migration design

- Da chot bang nao giu, bang nao doi, bang nao redesign.
- Da co mapping cho moi domain cot loi.
- Da co chien luoc auth + RBAC scope trong Postgres.
- Da co ke hoach backfill va doi chieu du lieu.
