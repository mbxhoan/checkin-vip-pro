# AGENTS.md

Tai lieu nay danh cho agent o app moi `Next.js + Supabase/PostgreSQL`.
Hay dat file nay o root cua repo moi khi bat dau build.

## 1. Mission

Xay dung app moi thay the he thong `checkin-v3-cloud` (legacy Delfi) voi target brand moi:

- product: `Giltech Solutions Check-in`
- owner company: `Giltech Solutions`

- UI viet bang `Next.js`;
- du lieu tren `Supabase PostgreSQL`;
- domain/business meaning giu lai khoang `70%`;
- authorization duoc nang cap thanh `RBAC = role + permission + scope`.

Muc tieu khong phai la lam giao dien dep. Muc tieu la `replatform` ma van giu du nghiep vu, dung quyen, dung du lieu, dung runtime.

## 2. Mandatory reading order

Truoc khi code, phai doc theo thu tu nay:

1. `docs/ui-replatform/README.md`
2. `docs/ui-replatform/legacy-scope.md`
3. `docs/ui-replatform/target-architecture.md`
4. `docs/ui-replatform/schema-migration-strategy.md`
5. `docs/ui-replatform/rbac-design.md`
6. `docs/ui-replatform/permission-registry.md`
7. `docs/ui-replatform/route-to-module-map.md`
8. `docs/ui-replatform/delivery-playbook.md`
9. `docs/ui-replatform/migration-tracker.md`
10. `docs/ui-replatform/brand-migration-checklist.md`

Neu lam theo module, doc them:

- `docs/ui-replatform/_module-spec-template.md`
- `docs/ui-replatform/_parity-checklist-template.md`
- `docs/ui-replatform/_vibe-coder-prompts.md`

Neu task lien quan den thuong hieu, legal, domain, mail sender, doc them:

- `docs/ui-replatform/brand-migration-checklist.md`

## 3. Non-negotiables

### 3.1 Replatform, not blind rewrite

- Khong duoc tu y doi business meaning cua field, status, scope.
- Khong duoc bo sot flow import/export, print, chatbot, lucky draw, scan runtime.
- Khong duoc dong nhat "UI moi" voi "schema moi dep hon".
- Khong duoc de sot thuong hieu/owner cu `Delfi` trong output moi (tru khi dang ghi chu legacy mapping).

### 3.2 Server-side control is mandatory

- Khong cho client app truy cap truc tiep vao toan bo business tables cua Supabase.
- CRUD nghiep vu phai di qua `server actions`, `route handlers`, hoac `BFF/service layer`.
- RLS chi la lop bao ve bo sung, khong thay the authorization app layer.

### 3.3 RBAC is source of truth

- Menu visibility khong phai authorization.
- Moi page, API action, button action phai map vao permission key.
- Permission phai duoc doc tu `docs/ui-replatform/permission-registry.md`.

### 3.4 Parity first

- Moi module truoc khi done phai co parity checklist.
- Moi thay doi contract/schema phai co mapping `legacy -> new`.
- Moi report/query critical phai co doi chieu ket qua voi he thong cu.

## 4. Target architecture rules

- Frontend: `Next.js App Router`, `TypeScript`.
- Validation: `Zod` cho input/output contract.
- Data layer: query helpers typed, khong rải query raw khap noi.
- Auth: Supabase Auth cho identity/session, business profile va RBAC o bang nghiep vu.
- Async work: worker/job layer rieng cho import, campaign send, card/label generation, print orchestration, chatbot flows.

## 5. Coding rules

- English cho code, ten bien, permission key, table/column moi.
- Giao tiep voi user bang tieng Viet ngan gon.
- Tach code theo feature/domain, khong theo "components dumping ground".
- Tao component theo design system co chu dich, khong tao UI "safe/boilerplate".
- Runtime pages cho operator/scanner phai uu tien toc do, de doc, it click.

## 6. Data and schema rules

- `70% schema retained` phai hieu la giu entity model va relation model chinh.
- Duoc phep redesign auth, membership scope, permission tables, job tables, technical tables.
- Uu tien `jsonb` cho data object thay vi stringified JSON.
- Uu tien `timestamptz`, `boolean`, `check constraints`/enum thay cho kieu MySQL cu khong phu hop.
- Neu doi ten bang/cot, phai ghi ro trong module spec hoac migration log.

## 7. Workflow for every task

1. Xac dinh task thuoc module nao trong `migration-tracker.md`.
2. Doc legacy references lien quan.
3. Chot permission/scope bi anh huong.
4. Chot `legacy -> new` mapping neu co doi contract/schema.
5. Implement voi thay doi nho nhat de dat duoc ket qua.
6. Update tracker/parity checklist/module note.
7. Verify typecheck/lint/test/build muc phu hop.

## 8. Files that must be updated during delivery

### Bat buoc khi mo rong permission

- `docs/ui-replatform/permission-registry.md`

### Bat buoc khi mo rong module/screen/route

- `docs/ui-replatform/migration-tracker.md`
- `docs/ui-replatform/route-to-module-map.md` neu co route group moi

### Bat buoc khi doi contract/schema

- `docs/ui-replatform/_module-spec-template.md` ban da dien
- hoac mot file spec/module note tuong duong

### Bat buoc truoc khi close module

- `docs/ui-replatform/_parity-checklist-template.md` ban copy ra cho module do
- `docs/ui-replatform/migration-tracker.md`
- neu module co touch brand/legal/domain/mail: `docs/ui-replatform/brand-migration-checklist.md`

## 9. Verification expectations

Neu repo moi co script, uu tien chay:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

Neu task co schema/query:

- chay script verify migration/backfill neu co;
- doi chieu it nhat 1-2 sample report/query voi he thong cu.

## 10. Final response expectations

Moi task hoan tat phai bao cao:

- da lam gi;
- file da sua;
- permission/scope nao bi anh huong;
- tracker/checklist da update chua;
- da verify gi;
- rui ro parity con lai.

## 11. Red flags

Dung lai va neu van de neu gap:

- task doi schema nhung khong ai chot mapping tu schema cu;
- task them page nhung khong ro permission key;
- task dung Supabase client tren client side de sua business tables nhay cam;
- task bo qua check-in, print, chatbot, lucky draw vi "de lam sau";
- task lam report moi nhung khong doi chieu voi he thong cu.
