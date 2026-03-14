# Legacy Scope And Migration Boundaries

Tai lieu nay xac dinh pham vi chuc nang cua app hien tai can duoc dua sang app moi `Next.js + Supabase/Postgres`. Day la scope nghiep vu, khong chi la danh sach man hinh.

## 1. Product surfaces hien tai

### 1.1 Admin web

He thong quan tri chinh cho van hanh su kien, marketing, mau in, landing page, lucky draw, user va bao cao.

Route nguon: `routes/admin.php`

### 1.2 Public web

Bao gom dang ky tai khoan, terms/legal, landing page dang ky tham du, trang success va cac endpoint public xem QR/card/document.

Route nguon: `routes/web.php`, `routes/auth.php`

### 1.3 Scan app

Man hinh check-in van hanh su kien, login scanner, scan QR, dong bo offline, render label.

Route nguon: `routes/scan.php`

### 1.4 Embedded AI chatbot

Chatbot huong dan, bao cao, ho tro loi va lich su hoi dap.

Route nguon: `routes/admin.php` phan `chatbot/n8n`

## 2. Domain modules bat buoc phai giu

| Module | Muc dich | Domain/data chinh | Flow phai giu |
|---|---|---|---|
| Dashboard | Tong quan he thong va nhanh vao cong viec | users, companys, events, reports | Xem dashboard theo scope user |
| Company | Quan ly tenant/cong ty | companys, users, events | Tao/sua cong ty, sync event settings |
| Event | Trung tam nghiep vu cua he thong | events, event_settings, event_files, event_areas | Tao event, sua event, clone, feature toggle, upload media |
| Dynamic fields | Cau hinh form va truong dong | custom_field_templates, language_defines | Sap xep field, show/hide, field theo LP/check-in |
| Client/Attendee | Quan ly danh sach nguoi tham du | clients, client_backups | Tao/import/sua/export/generate QR/send email/generate card |
| Check-in | Van hanh check-in tai su kien | checkins | Check-in, xoa log, export check-in, runtime config |
| Report | Bao cao va thong ke | reports + query runtime | Bao cao theo event, bang du lieu, render report |
| Landing page | Dang ky tham du | landing_pages, media, custom fields | Tao landing page, chon giao dien, dang ky, success |
| Campaign/Email | Gui mail va thong ke chien dich | campaigns, campaign_details, emails, attachments | Tao campaign, sync data, gui mail, lich su, cancel |
| Email template | Thu vien noi dung mail | external Postmark + local metadata | Sync template, preview, edit, clone, paid lock/unlock |
| Label print | Mau in tem | labels, label_details, printers, print logs | Tao mau in, design, render, in hang loat, live update |
| Card | The/thiệp | cards, card_details | Tao mau the, generate, export image |
| Lucky draw | Quay so trung thuong | lucky_draws, rewards, layouts, winners | Quan ly giai, dong bo danh sach, builder, draw machine |
| User management | Quan ly user trong tenant | users, roles | Tao user, edit, sign-out, approve access, send verification |
| Media library | Thu vien media | media | Upload, chon media cho module khac |
| History/logs | Theo doi thao tac va audit | histories, logs | Xem lich su, system logs |
| AI chatbot | Tro ly ao | n8n_chat_sessions, n8n_chat_messages | Chon mode, hoi dap, reset, history |

## 3. Luong nghiep vu cot loi can khong thay doi

### 3.1 Event operations backbone

`Company -> Event -> Event settings -> Dynamic fields -> Clients -> Check-in -> Reports`

Neu UI moi dep hon nhung lam vo chuoi nay thi xem nhu that bai.

### 3.2 Registration funnel

`Landing page -> Register attendee -> QR/Card/Email tai lieu -> Check-in tai event -> Bao cao`

### 3.3 Communication funnel

`Event -> Select audience -> Campaign -> Email template -> Send/track/cancel -> Export report`

### 3.4 Print fulfillment

`Event -> Label/Card template -> Preview -> Generate/render -> Print single/batch -> Log`

### 3.5 Lucky draw runtime

`Event -> Lucky draw -> Rewards -> Participant sync -> Layout builder -> Display -> Start/stop/confirm`

### 3.6 Access lifecycle

`Register company admin -> Verify email -> Approve access -> Assign role/scope -> Use feature by permission`

## 4. Khu vuc can co parity 1:1 voi he thong cu

- Import/export du lieu khach moi.
- Check-in runtime va offline sync.
- Rendering QR, card, label.
- Postmark email template va campaign sending.
- Lucky draw builder/display.
- N8N chatbot.
- Legal/terms/onboarding.

## 5. Khu vuc co the nang cap trong UI moi

- Navigation, layout shell, search, filter, quick actions.
- Form UX, wizard, preview side panel, autosave.
- State handling, loading/empty/error states.
- RBAC va permission management.
- Cross-module breadcrumbs va contextual help.
- Design system va component consistency.

## 6. Khu vuc khong nen doi trong phase dau

- Business meaning cua schema nghiep vu chinh.
- Queue/job flow cho import, send email, generate card.
- Logic tinh bao cao va check-in.
- Integrations: Postmark, N8N, printing bridge, scan app auth.

Luu y:

- Tech stack va physical schema co the doi.
- Domain model va quy trinh nghiep vu khong nen doi som.

## 7. Target information architecture de build UI moi

De xay UI moi gon va de mo rong RBAC, nen nhom lai menu thanh 6 cum:

1. Overview
   Dashboard, notifications, pending approvals.
2. Workspace
   Companies, events, event settings, users.
3. Audience
   Clients, check-in, reports.
4. Experience
   Landing pages, emails, templates, cards, labels.
5. Engagement
   Lucky draw, chatbot, media.
6. System
   History, logs, legal, billing, integration settings.

## 8. Quy tac migration boundary

- UI moi duoc phep doi layout, component, luong thao tac.
- UI moi khong duoc tu y doi meaning cua field, status, event scope.
- Duoc phep doi tu Laravel/MySQL sang Next.js/Postgres, nhung phai co contract moi da duoc dinh nghia ro.
- Authorization phai di qua RBAC moi, nhung can ton trong company/event scope cu.
