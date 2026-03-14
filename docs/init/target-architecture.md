# Target Architecture: Next.js + Supabase

Tai lieu nay chot target architecture cho app moi. Day la bai toan `replatform`, khong phai render lai giao dien tren cung Laravel app.

## 1. Muc tieu kien truc

- Frontend chinh duoc viet bang `Next.js`.
- Database chinh la `PostgreSQL` tren `Supabase`.
- Giu lai khoang `70%` domain va schema semantics cua he thong cu.
- Tach ro:
  - UI layer
  - authorization layer
  - background job/integration layer
  - reporting/query layer

## 2. Kien truc de xuat

### 2.1 Lop ung dung

1. `Next.js App Router`
   Admin app, public registration, scan UI, legal, chatbot widget shell.
2. `Server-side BFF/API layer`
   Dung route handlers, server actions, hoac mot service layer rieng de bao ve business rules.
3. `Supabase PostgreSQL`
   Nguon du lieu chinh.
4. `Background workers`
   Xu ly import, send mail, generate card, export file, print orchestration, chatbot async tasks.
5. `External integrations`
   Postmark, n8n, direct print bridge, file storage, scanner runtime.

## 3. Khuyen nghi quan trong

### 3.1 Khong cho client app noi truc tiep den moi bang nghiep vu

Voi app nay, chi dung Supabase client/RLS theo kieu thuần frontend la khong du:

- RBAC cua ban phuc tap hon role đơn.
- Co company scope, event scope, package gating, paid templates, check-in runtime.
- Co nhieu flow async va external integrations.

Khuyen nghi:

- UI goi `Next.js server layer`.
- Server layer moi truy cap Supabase bang service role hoac context duoc kiem soat.
- Authorization di qua 1 ham chung `authorize(user, permission, scope)`.

### 3.2 Supabase Auth khong nen la noi chua toan bo business role

Co the dung Supabase Auth cho:

- dang nhap;
- session;
- refresh token;
- email verify co ban.

Nhung role/permission/scope nen luu trong bang nghiep vu rieng, khong dua het vao JWT claims co dinh.

### 3.3 Background jobs phai la service rieng

Next.js khong phu hop de chay:

- import attendee lon;
- send campaign hang loat;
- generate card/label batch;
- export report nang;
- print orchestration;
- chatbot workflows phuc tap.

Can co worker layer. Co the chon:

- Supabase Edge Functions cho viec nhe/ngan;
- mot worker service Node/Nest/BullMQ cho viec dai va stateful;
- hoac giu mot backend worker/service rieng neu can.

## 4. Bounded contexts de xay trong app moi

### 4.1 Identity and Access

- users
- roles
- permissions
- scopes
- auth session

### 4.2 Workspace

- companies
- events
- event settings
- event files
- dynamic fields

### 4.3 Audience Operations

- clients
- checkins
- reports
- scanners

### 4.4 Experience and Communication

- landing pages
- campaigns
- email templates
- cards
- labels

### 4.5 Engagement Runtime

- lucky draw
- chatbot
- print runtime

## 5. Monorepo/codestructure khuyen nghi

Neu ban muon vibe code nhanh ma van co ky luat, nen chia:

- `apps/web`
  Next.js app chinh
- `packages/ui`
  design system/component library
- `packages/domain`
  types, zod schema, permission constants, shared business contracts
- `packages/db`
  SQL migrations, generated types, query helpers
- `packages/workflows`
  mail/chatbot/print/report orchestration

Neu chua muon monorepo ngay, it nhat van nen tach trong app:

- `src/app`
- `src/features`
- `src/lib/auth`
- `src/lib/rbac`
- `src/lib/db`
- `src/lib/services`
- `src/lib/contracts`

## 6. Runtime surfaces trong Next.js

### 6.1 Admin app

- dashboard
- workspace
- audience
- experience
- engagement
- system

### 6.2 Public app

- registration pages
- legal pages
- success pages
- public qr/card/document views

### 6.3 Scan app

Khuyen nghi tach thanh route group rieng hoac sub-app rieng trong cung Next.js:

- login scan
- select event
- check-in runtime
- offline buffer
- print on-site

Ly do: scanner/operator co UX va performance requirement khac admin app.

## 7. Data access strategy

### 7.1 Query ownership

- List/report page: query qua server layer.
- Public lightweight page: server-rendered query co cache control.
- Runtime check-in: action endpoint toi uu, it round-trip.

### 7.2 Validation

- UI validate de UX.
- Server validate la bat buoc.
- DB constraints de chan loi cuoi.

## 8. RLS strategy

Supabase co RLS, nhung voi bai toan nay nen dung nhu lop bao ve bo sung, khong phai noi chua toan bo authorization logic.

Khuyen nghi:

- Bang nhay cam/CRUD phuc tap: di qua server layer.
- RLS chu yeu chan cross-tenant doc truc tiep.
- Logic permission/action-level van dat o app layer.

## 9. Logging and observability

App moi can co:

- audit trail cho action quan tri;
- app logs;
- failed job tracking;
- integration logs cho Postmark/n8n/print;
- performance metrics cho report/import/export/check-in.

## 10. Definition of Done cho target architecture

- UI khong truy cap truc tiep vao business tables theo kieu tu phat.
- Role/permission/scope duoc centralize.
- Worker layer cover du async flows.
- PostgreSQL schema moi map du domain nghiep vu cu.
- Scanner, chatbot, print va campaign khong bi day ve cung mot loai contract voi CRUD thuong.
