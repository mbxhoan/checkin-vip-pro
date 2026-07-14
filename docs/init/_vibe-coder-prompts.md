# Vibe Coder Prompts

Tai lieu nay chua cac prompt mau de giao viec cho agent moi. Dung nguyen van hoac thay thong tin trong `[]`.

## 1. System prompt / bootstrap prompt

Dung prompt nay cho turn dau tien khi agent vua vao repo moi:

```text
You are building a new app that replaces the legacy checkin-v3-cloud system.
Legacy product/company: Delfi Check-in / Delfi Technologies.
Target product/company: Giltech Solutions Check-in / Giltech Solutions.

Target stack:
- Next.js App Router
- TypeScript
- Supabase PostgreSQL
- RBAC with role + permission + scope

Before coding, read these files in order:
1. docs/init/README.md
2. docs/init/legacy-scope.md
3. docs/init/target-architecture.md
4. docs/init/schema-migration-strategy.md
5. docs/init/rbac-design.md
6. docs/init/permission-registry.md
7. docs/init/route-to-module-map.md
8. docs/init/delivery-playbook.md
9. docs/init/migration-tracker.md
10. docs/init/AGENTS.md
11. docs/init/brand-migration-checklist.md

Operating rules:
- Preserve business meaning and runtime parity with the legacy app.
- Keep all new-facing branding/company identity on Giltech Solutions.
- Run brand migration checks before closing any module touching UI, legal, domain, mail, exports, or templates.
- Do not let the client directly mutate sensitive Supabase business tables.
- Use server-side authorization for all privileged actions.
- Treat RLS as defense in depth, not the whole authorization model.
- Update migration tracker and parity checklist when a module changes.

When you start a task:
- identify module
- identify permissions and scopes
- identify legacy-to-new mapping
- implement the smallest safe change
- report parity risks explicitly
```

## 2. Prompt de build 1 module

```text
Implement module [MODULE_NAME] in the new Next.js app.

Business goal:
- [ghi muc dich nghiep vu]

Legacy references:
- routes: [vi du admin.events.*, admin.clients.*, ...]
- legacy controllers/services: [liet ke]
- legacy entities/tables: [liet ke]
- old behavior that must be preserved: [liet ke]

New target:
- Next.js routes/screens: [liet ke]
- Postgres tables: [liet ke]
- server actions / route handlers / BFF services: [liet ke]

RBAC:
- roles involved: [liet ke]
- permissions involved: [liet ke tu permission-registry.md]
- scope: [system/company/event/self]

Constraints:
- Keep business meaning and critical statuses unchanged.
- Replace legacy Delfi-facing brand strings with Giltech-facing strings in new app outputs.
- Do not bypass server-side authorization.
- Do not break import/export/reporting/printing/chatbot flows if touched.
- If you refactor schema or contract, document the legacy-to-new mapping.

Deliverables:
- working screens
- typed data contract
- permission-aware actions
- loading/empty/error states
- updated migration tracker

Verification:
- lint
- typecheck
- tests relevant to the module
- parity notes and unresolved gaps
```

## 3. Prompt de build schema/domain

```text
Design and implement the PostgreSQL/Supabase schema for [DOMAIN_NAME].

Inputs:
- docs/init/schema-migration-strategy.md
- docs/init/legacy-scope.md
- docs/ERD.md
- docs/rag-domains/[DOMAIN_FILE].json

Requirements:
- keep legacy business meaning
- keep approximately 70% domain semantics
- use PostgreSQL-appropriate types and constraints
- separate auth identity from business user profile if relevant
- design for RBAC scope and server-side authorization

Output:
- target tables
- legacy-to-new table mapping
- critical columns and statuses
- indexes and constraints
- migration notes
- risks if data backfill may lose meaning
```

## 4. Prompt de build RBAC

```text
Implement RBAC foundation for the new app.

Source of truth:
- docs/init/rbac-design.md
- docs/init/permission-registry.md
- docs/init/AGENTS.md

Requirements:
- support role + permission + scope
- support system/company/event/self scopes
- integrate with Supabase auth but keep business RBAC in app tables
- provide server-side authorization utilities
- provide a frontend-safe permission payload for conditional UI

Deliverables:
- data model
- authorization helpers
- permission constants/types
- example protected server action
- example protected page
```

## 5. Prompt de review parity

```text
Review module [MODULE_NAME] in the new app for parity against the legacy system.

Compare:
- business flow
- screen coverage
- permissions and scope behavior
- reporting/export behavior
- runtime requirements if applicable

Use:
- docs/init/_parity-checklist-template.md
- docs/init/migration-tracker.md
- docs/init/route-to-module-map.md

Return:
- missing behaviors
- broken or risky permissions
- schema/contract mismatches
- test gaps
- release recommendation: not ready / pilot ready / cutover ready
```

## 6. Prompt de update tracker

```text
Update docs/init/migration-tracker.md after finishing the task.

You must update:
- module status
- owner/date
- permissions touched
- schema touched
- parity status
- verification status
- outstanding risks
```

## 7. Prompt xau can tranh

- "Lam lai app dep hon"
- "Doi sang Next.js va Supabase"
- "Lam module event"
- "Viet schema Postgres cho he thong"

Nhung prompt nay qua mo. Agent se nhanh chong code theo gia dinh rieng va mat parity.

## 8. Prompt nhanh de bat dau phase 1

```text
Set up the new Next.js app foundation for the check-in replatform.

Read:
- docs/init/README.md
- docs/init/target-architecture.md
- docs/init/rbac-design.md
- docs/init/delivery-playbook.md
- docs/init/AGENTS.md
- docs/init/brand-migration-checklist.md

Build:
- app shell
- navigation skeleton
- auth layout
- role/permission guard primitives
- server-side Supabase access pattern
- module folder structure

Do not implement business modules yet beyond shell placeholders.
Update the migration tracker when done.
```

## 9. Trang thai thuc te hien tai

Danh dau theo repo `checkin-vip-pro` hien tai:

- Prompt 1: `done`
- Prompt 2: `partial`
- Prompt 3: `done`
- Prompt 4: `done`
- Prompt 5: `partial`
- Prompt 6: `done`
- Prompt 7: `not started` theo nghia khong dung
- Prompt 8: `done`

Ghi chu:
- `partial` nghia la da co implementation co ban va tracker/parity note, nhung chua dong flow hoan chinh.
- Hien tai `auth bootstrap`, `mutation screens`, `RLS expansion`, va `foundation shell` da duoc dong goi xong, nhung parity module layer van con mo o prompt 2 va 5.
