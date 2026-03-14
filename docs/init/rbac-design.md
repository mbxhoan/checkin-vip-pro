# RBAC Design For The New App

Tai lieu nay de xuat mo hinh RBAC cho app moi `Next.js + Supabase/Postgres`. Muc tieu la thay the co che hien tai dang bi tach thanh nhieu lop:

- `roles` table don gian (`admin`, `editor`, `user`, `scanner`);
- co `is_admin` de phan biet system admin;
- route middleware `role:*`;
- policy theo object/event;
- menu filtering o `config/sidebar-menu.php`.

Trong app moi, can hop nhat thanh mot mo hinh ro rang: `principal -> role -> permission -> scope`.

Dong thoi can phu hop voi thuc te Supabase:

- auth session co the di qua Supabase Auth;
- role/permission/scope van phai o bang nghiep vu rieng;
- khong dua toan bo authorization vao RLS hoac JWT claims.

## 1. Van de cua authorization hien tai

### 1.1 `is_admin` dang bi overload

- `is_admin = true` thuc te dang nghia la `system admin`.
- `role = admin` voi `is_admin = false` lai gan voi `company admin`.

Hai meaning nay khac nhau nhung hien dang trung ten, rat de lam AI/FE/BE hieu sai.

### 1.2 Menu visibility khong phai source of truth

`config/sidebar-menu.php` dang an/hien menu theo role, nhung backend lai authorization bang middleware/policy. App moi khong duoc dung menu de dai dien cho permission.

### 1.3 Scope dang tron voi role

Nhieu policy cho phep vi user cung `company_id` hoac cung `event_id`, khong vi role thuc su. Nghia la he thong hien tai co "scope control" manh, nhung "action control" con tho.

## 2. Mo hinh de xuat

### 2.1 Ba lop bat buoc

1. Role
   La bo permission template de gan nhanh cho nhom user.
2. Permission
   La quyen thao tac cu the tren resource.
3. Scope
   La pham vi du lieu ma permission do co hieu luc.

### 2.2 Cac scope can ho tro

- `system`
- `company`
- `event`
- `self`

### 2.3 Rule danh gia quyen

Mot request duoc cho phep khi:

- user co permission phu hop;
- va scope cua user bao phu resource dang truy cap;
- va resource khong nam trong trang thai bi khoa/theo package khong duoc dung.

## 3. Role template de xuat

Day la role template de build UI moi. Co the implement bang `spatie/laravel-permission` hoac model tuong duong.

| Role | Pham vi mac dinh | Muc dich |
|---|---|---|
| `system_admin` | system | Quan tri cross-company, billing, legal, logs, integrations |
| `company_admin` | company | Quan tri cong ty, user cong ty, event cong ty |
| `event_manager` | event/company | Quan ly event va audience operations |
| `report_analyst` | event/company | Xem bao cao, export, khong sua cau hinh |
| `content_operator` | event/company | Landing page, email, template, card, label |
| `checkin_operator` | event | Check-in runtime, attendee lookup, print on-site |
| `scanner_device` | event | Tai khoan scanner toi gian, scan/check-in only |
| `support_agent` | company/system | Ho tro loi, xem history/chatbot, khong sua core config |

Neu can toi gian o giai doan dau, co the bat dau voi 5 role:

- `system_admin`
- `company_admin`
- `event_manager`
- `report_analyst`
- `scanner_device`

## 4. Permission taxonomy de xuat

Permission nen dat ten theo quy tac:

`resource.action`

Vi du:

- `company.view`
- `company.manage`
- `event.view`
- `event.create`
- `event.update`
- `event.archive`
- `event.feature.manage`
- `client.view`
- `client.import`
- `client.export`
- `client.update`
- `checkin.run`
- `checkin.manage`
- `report.view`
- `report.export`
- `landing_page.manage`
- `campaign.manage`
- `email_template.manage`
- `email_template.unlock.request`
- `label.manage`
- `card.manage`
- `print.execute`
- `lucky_draw.manage`
- `lucky_draw.run`
- `user.manage`
- `user.invite`
- `media.manage`
- `chatbot.use`
- `chatbot.admin`
- `history.view`
- `log.view`
- `billing.view`
- `billing.manage`

## 5. Resource scope mapping de xuat

| Resource | Scope chinh |
|---|---|
| Company | system |
| User | company, self |
| Event | company |
| Client | event |
| Checkin | event |
| Report | event, company |
| Campaign | event |
| Email template | company, system |
| Label | event |
| Card | event |
| Landing page | event |
| Lucky draw | event |
| Media | company, event |
| Chatbot sessions | company, user |

## 6. Mapping tu he thong cu sang app moi

| He thong cu | Mapping tam thoi sang app moi |
|---|---|
| `is_admin = true` | `system_admin` |
| `role = admin` va `is_admin = false` | `company_admin` |
| `role = user` | `event_manager` hoac `report_analyst` tuy use case |
| `role = scanner` | `scanner_device` |
| `role = editor` | `content_operator` |

Luu y: `role = user` hien tai dang qua rong. Trong app moi nen tach it nhat thanh:

- `event_manager`
- `report_analyst`
- `content_operator`

## 7. Data model de xuat

Neu muon de maintain va de vibe code, nen chuan hoa bang nhu sau:

- `roles`
- `permissions`
- `role_has_permissions`
- `model_has_roles`
- `model_has_permissions`
- `user_company_scopes`
- `user_event_scopes`

Neu muon gon hon, co the luu scope ngay tren membership:

- `user_access_scopes`
  - `user_id`
  - `scope_type` (`system|company|event`)
  - `scope_id`
  - `role_id`

Khuyen nghi cho target moi:

- auth identity o `auth.users`;
- profile/nghiep vu o `public.users`;
- role/permission/scope trong `public.*`;
- server layer cua Next.js la noi evaluate permission;
- RLS dung de bo sung chan cross-tenant, khong thay the app authorization.

## 8. Authorization pipeline de xay trong app moi

1. Xac thuc user.
2. Resolve `auth user -> public user`.
3. Nap role va permission.
4. Nap scope membership.
5. Resolve resource scope cua request.
6. Check permission.
7. Check scope.
8. Check package/feature gating neu co.

## 9. UI quan tri RBAC can co

App moi nen co 3 man hinh rieng:

1. Role templates
   Tao role, sao chep role, xem so user dang dung.
2. Permission matrix
   Bang role x permission theo domain.
3. User access assignment
   Gan role + company/event scope cho tung user.

## 10. Quy tac implement de tranh vo he thong

- Khong viet permission hard-code trong component UI.
- FE chi quyet dinh "show/hide" dua tren permission payload, nhung backend moi la noi chan that su.
- Moi endpoint moi phai gan permission key ro rang.
- Permission key phai tro thanh contract duoc version hoa trong docs.

## 11. Definition of Done cho RBAC

RBAC duoc xem la xong khi:

- menu, page, action button, API deu dung cung 1 bo permission key;
- user co cung role nhung scope khac nhau thi nhin thay data khac nhau;
- scanner khong the vao admin web day du;
- company admin khong thay du lieu cong ty khac;
- system admin co the cross-company;
- regression test duoc cac case truy cap sai quyen.
