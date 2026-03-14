# UI Replatform Blueprint

Bo tai lieu nay dung de chuyen he thong legacy `checkin-v3-cloud` (Delfi Check-in) sang app moi mang thuong hieu `Giltech Solutions Check-in` voi:

- frontend UI viet bang `Next.js`;
- database chinh dung `PostgreSQL` tren `Supabase`;
- business/domain giu lai khoang `70%` tu he thong hien tai;
- RBAC duoc thiet ke lai bai ban thay cho co che role/scope cu.

## Muc tieu

- Replatform ung dung, khong chi thay giao dien.
- Giu lai domain model, quy trinh nghiep vu va y nghia du lieu o muc cao.
- Cho phep thay doi khoang 30% schema/architecture de phu hop `Next.js + Supabase/Postgres`.
- Nang cap tu he phan quyen hien tai sang RBAC day du: `role + permission + scope`.
- Tao quy trinh de team hoac AI co the build tung module co kiem soat, de review, de test, de cutover.

## Nguon su that can bam vao

- `routes/admin.php`: be mat quan tri va flow nghiep vu chinh.
- `routes/web.php`: dang ky/public web.
- `routes/scan.php`: man hinh scan/check-in runtime.
- `config/sidebar-menu.php`: cau truc menu va phan tach module hien tai.
- `app/Models/User.php`: logic role, `is_admin`, company/event scope.
- `app/Policies/*`: authorization hien tai theo object/event.
- `docs/ERD.md`: du lieu va quan he bang.
- `docs/rag-domains/*.json`: phan loai domain theo nghiep vu.

## Thu tu doc khuyen nghi

1. `legacy-scope.md`
2. `target-architecture.md`
3. `schema-migration-strategy.md`
4. `rbac-design.md`
5. `delivery-playbook.md`
6. `_module-spec-template.md`
7. `permission-registry.md`
8. `route-to-module-map.md`
9. `migration-tracker.md`
10. `_vibe-coder-prompts.md`
11. `AGENTS.md`
12. `brand-migration-checklist.md`
13. `_parity-checklist-template.md`

## Nguyen tac chi dao

1. Day la `replatform`, khong phai chi la skin UI.
2. `70% giu lai` phai duoc hieu la giu `domain va business meaning`, khong phai copy nguyen xi schema MySQL sang Postgres.
3. RBAC moi phai tro thanh source of truth, khong de menu visibility thay authorization.
4. Moi module can co parity checklist voi he thong cu truoc khi go-live.
5. Cac flow async, printing, chatbot, import/export khong duoc nhom chung vao CRUD thong thuong.
6. Uu tien cat chuyen theo module, khong cutover all-in-one.

## Ket qua ky vong

Sau khi theo bo tai lieu nay, team se co:

- mot inventory day du ve module va flow can giu;
- mot target architecture ro rang cho `Next.js + Supabase`;
- mot chien luoc chuyen schema tu `MySQL -> PostgreSQL` ma khong vo nghiep vu;
- mot thiet ke RBAC co the implement duoc;
- mot lo trinh chuyen doi theo phase;
- mot format brief/module spec de giao viec cho AI hoac dev ma khong mat ngu canh;
- mot checklist de doi thuong hieu tu Delfi sang Giltech ma khong sot he thong.
