# Module Spec Template

Dung mau nay de giao cho AI hoac dev khi build moi module tren UI moi.

## 1. Basic info

- Module name:
- Business owner:
- Priority:
- Legacy routes:
- Legacy controllers/services:
- Main entities:
- New app routes:
- Target Postgres tables:

## 2. Business goal

Mo ta ngan gon module nay giai quyet viec gi cho ai.

## 3. Personas

- Persona 1:
- Persona 2:
- Persona 3:

## 4. User stories

- Toi la `...`, toi muon `...`, de `...`.
- Toi la `...`, toi muon `...`, de `...`.

## 5. Screen inventory

| Screen | Purpose | Legacy reference | New route |
|---|---|---|---|
| List | | | |
| Detail | | | |
| Create | | | |
| Edit | | | |
| Runtime/Preview | | | |

## 6. Core actions

| Action | API/handler | Role/permission | Scope | Notes |
|---|---|---|---|---|
| View list | | | | |
| Create | | | | |
| Update | | | | |
| Delete/Archive | | | | |
| Export | | | | |

## 6.1 Legacy to new mapping

| Legacy item | New item | Keep as-is | Refactor | Redesign |
|---|---|---|---|---|
| Route | | | | |
| Service/action | | | | |
| Table/entity | | | | |
| Status/enum | | | | |

## 7. RBAC matrix

| Role | View | Create | Update | Delete | Export | Special actions |
|---|---|---|---|---|---|---|
| system_admin | | | | | | |
| company_admin | | | | | | |
| event_manager | | | | | | |
| report_analyst | | | | | | |
| scanner_device | | | | | | |

## 8. Data and state requirements

- Filters:
- Sorts:
- Search:
- Bulk actions:
- Loading states:
- Empty state:
- Error state:
- Permission denied state:

## 9. UX rules

- Thu tu thong tin quan trong nhat tren man hinh:
- Quick actions can dat o dau:
- Neu la module runtime, nguoi dung can thao tac nhanh bang 1 tay hay bang ban phim:
- Co can preview side-by-side khong:

## 10. Integration notes

- Queue/job:
- External API:
- File upload/download:
- Realtime/websocket:
- Print/render:
- Supabase auth/RLS:

## 11. Acceptance criteria

- [ ] Cover du screen can co
- [ ] Khong mat flow nghiep vu cu
- [ ] Mapping cu -> moi ro rang
- [ ] Dung permission va scope
- [ ] Dung loading/empty/error states
- [ ] Responsive desktop/mobile
- [ ] Smoke test pass
- [ ] Data semantics tren Postgres dung voi he thong cu

## 12. Prompt template cho AI

Su dung mau prompt nay:

```text
Build module [MODULE_NAME] on the new UI shell.

Business goal:
- ...

Legacy references:
- routes: ...
- controllers/services: ...
- entities: ...
- legacy schema meaning: ...

Screens:
- ...

New target:
- Next.js routes: ...
- Postgres tables: ...
- server actions/BFF handlers: ...

RBAC:
- roles: ...
- permissions: ...
- scope: system/company/event/self

Critical behaviors to preserve:
- ...

Allowed changes:
- UI patterns
- contract shape if documented
- schema refactor within approved migration plan

Do not change:
- existing business rules
- data meaning
- import/export contract

Acceptance criteria:
- ...
```
