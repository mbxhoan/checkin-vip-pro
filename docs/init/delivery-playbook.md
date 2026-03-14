# Delivery Playbook For The New UI

Tai lieu nay la quy trinh thuc thi de build app moi `Next.js + Supabase/Postgres` ma khong roi vao rewrite loang hoang.

## 1. Khuyen nghi kien truc cho target moi

Voi target moi, huong it rui ro nhat la:

- xay `Next.js` app moi;
- dung `Supabase PostgreSQL` lam database chinh;
- giu domain logic/flow o muc nghiep vu, nhung viet lai app layer cho phu hop target moi;
- cat chuyen tung module;
- RBAC moi duoc xay song song, nhung phai co mapping tam thoi voi auth hien tai.

Khong khuyen nghi:

- de frontend client noi truc tiep vao toan bo business tables;
- vua doi UI, vua doi DB, vua doi toan bo workflow async ma khong chia phase;
- coi Supabase RLS la du thay cho RBAC app layer.

## 2. Muc tieu cho tung phase

### Phase 0. Discovery and freeze

Deliverables:

- inventory module va route;
- target architecture;
- schema migration strategy;
- parity checklist cho tung module;
- quy uoc component/system design;
- target RBAC matrix.

Done khi:

- team thong nhat module nao cat truoc;
- khong con tranh cai "man hinh nay co can giu khong".

### Phase 1. Foundation

Deliverables:

- Next.js shell moi;
- navigation moi;
- auth layout;
- design tokens;
- table, form, drawer, modal, filter bar, empty state, permission guard component;
- db access layer va auth context skeleton.

Done khi:

- co the build 2-3 module dau tien ma khong can phat minh lai component.

### Phase 2. RBAC foundation

Deliverables:

- role templates;
- permission registry;
- scope resolver;
- endpoint authorization strategy;
- FE permission payload.

Done khi:

- co the kiem soat truy cap page, action, data scope theo model moi.

### Phase 3. Module migration

Deliverables:

- tung module duoc dua sang UI moi theo thu tu uu tien;
- table/query/service layer cho Postgres domain moi;
- parity checklist pass;
- smoke test pass.

### Phase 4. Cutover and hardening

Deliverables:

- log monitoring;
- 404/403 audit;
- performance baseline;
- training note cho internal team;
- fallback plan.

### Phase 5. Data backfill and cutover

Deliverables:

- MySQL -> PostgreSQL mapping scripts;
- verification reports;
- dual-run comparison cho cac flow critical;
- final cutover checklist.

## 3. Thu tu migration module khuyen nghi

Thu tu nay dua tren business criticality va muc do phu thuoc:

1. Auth, app shell, dashboard, legal/footer
2. User access, role assignment, company, event
3. Clients, check-in, reports
4. Landing page va registration flow
5. Campaign, email, template library
6. Labels, cards, print flows
7. Lucky draw runtime va builder
8. Chatbot, history, logs, media
9. Data backfill and cutover

Ly do:

- `company/event/clients/check-in/reports` la xuong song cua he thong.
- neu chua migrate xong backbone ma da chuyen sang lucky draw/chatbot thi se gay fake progress.

## 4. Quy trinh cho moi module

### Buoc 1. Lock scope

Xac dinh:

- screen nao thuoc module;
- route nao dang phuc vu;
- entity nao bi anh huong;
- role nao dung module;
- action nao la critical.

### Buoc 2. Viet module spec

Dung mau tai `_module-spec-template.md`.

### Buoc 3. Chot API contract

- khong can giu endpoint Laravel 1:1, nhung phai giu action contract o muc nghiep vu;
- neu doi contract, phai co action map cu -> moi;
- response can co `permissions`, `scope`, `feature_flags` neu FE can;
- query shape phai toi uu cho Next.js page va server actions.

### Buoc 4. Build UI moi

- shell moi;
- list/detail/create/edit;
- loading/empty/error/skeleton;
- filter/search/sort/export;
- mobile va desktop.

### Buoc 5. Wire authorization

- page-level access;
- action-level access;
- data scope filtering;
- hidden state va disabled state phai ro ly do.

### Buoc 6. Verify parity

Check:

- happy path;
- empty state;
- permission denied;
- cross-company isolation;
- import/export;
- async job progress neu co.
- so lieu MySQL va PostgreSQL khong lech o cac report critical.

## 5. Definition of Done cho moi module

Mot module chi duoc xem la xong khi:

- UI moi cover du screen critical cua module;
- data hien thi dung;
- action thanh cong va loi deu ro rang;
- RBAC dung o page, action, data scope;
- khong con phu thuoc menu cu de navigate;
- co checklist parity ky ten.

## 6. Rule giao task cho AI/vibe coding

Moi task phai co 5 phan toi thieu:

1. Muc tieu nghiep vu
2. Legacy references
3. Screen can lam
4. Permission/scope can ap
5. Acceptance criteria

Prompt xau:

- "Lam lai module event dep hon"

Prompt dung:

- "Build Event List va Event Detail tren UI moi, giu lai filter theo company/event status, map voi route `admin.events.*`, role `company_admin` va `event_manager`, khong cho cross-company data, co bulk actions va feature gating."

## 7. Risk register can theo doi

- UI moi dep nhung bo sot flow import/export.
- RBAC moi dung o FE nhung backend chua chan.
- Schema moi Postgres dep hon nhung mat business meaning tu schema cu.
- Lucky draw/check-in/print co runtime requirement khac voi CRUD thuong.
- Chatbot va email template co external integration, khong duoc test hinh thuc.
- Scanner va operator can UX toc do cao, khong nen reuse pattern qua nang.
- Supabase auth/RLS bi lam dung sai muc dich.

## 8. Artefacts can duy tri song song

- `permission-registry.md`
- `route-to-module-map.md`
- `parity-checklist.xlsx` hoac markdown tuong duong
- `api-contract-log.md`
- `cutover-log.md`

Neu khong co cac artefact nay, du an se nhanh chong quay lai tinh trang "AI lam nhanh nhung khong ai biet da doi gi".
