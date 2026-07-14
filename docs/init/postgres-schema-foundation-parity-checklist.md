# Postgres Schema Foundation Parity Checklist

## Module

- Ten module: Postgres schema foundation
- Owner: Codex
- Phase: 2
- Legacy references: `legacy-scope.md`, `schema-migration-strategy.md`, `rbac-design.md`, `route-to-module-map.md`
- New routes/screens: n/a, schema-only

## 1. Functional parity

- [x] Co du domain tables cho company, user, event, audience, experience, engagement, system
- [x] Co du FK backbone `company -> event -> client/checkin/content/runtime`
- [x] Co du bang cho import/export/check-in/print/campaign/chatbot/log/job
- [ ] Co chi tiet tung column contract 1:1 voi legacy schema
- [ ] Co sample migration/backfill script cho moi domain

## 2. Data parity

- [x] Field status/enum cot loi da duoc giu o cap business meaning
- [x] `jsonb` duoc dung cho settings/blocks/payload/metadata thay vi stringified JSON
- [x] Auth identity da tach khoi business profile user
- [ ] Mapping MySQL cu -> PostgreSQL moi khong mat nghia du lieu da duoc doi chieu bang sample data
- [ ] Sample query report/check-in/email/print doi chieu voi he thong cu da khop

## 3. RBAC parity

- [x] Dung role template bang `roles`
- [x] Dung permission key bang `permissions`
- [x] Dung scope bang `user_access_scopes`
- [x] Backend authorize helper da co trong SQL helper RPC + `src/lib/rbac`
- [x] RLS baseline policy da duoc implement cho core company/user/event/client/check-in/report/legal tables

## 4. UX parity

- [ ] Khong ap dung truc tiep o cap schema
- [ ] Khong ap dung truc tiep o cap schema
- [ ] Khong ap dung truc tiep o cap schema
- [ ] Khong ap dung truc tiep o cap schema

## 5. Integration parity

- [x] Queue/job tables co san
- [x] File/media tables co san
- [x] Postmark/N8N/printing/scan runtime tables co san
- [x] Logging/history tables co san
- [ ] Live integration contracts chua duoc test end-to-end

## 6. Release decision

- [x] Ready for internal schema review
- [ ] Ready for pilot cutover
- [ ] Ready for full cutover

## Notes

- Rui ro con lai: thieu legacy ERD/schema dump nen mot so cot chi tiet duoc de trong `jsonb` cho backfill phase.
- Fallback plan: tiep tuc dung migration nen nay, sau do bo sung migration delta khi co them mapping tu legacy.
- Owner ky xac nhan: Codex, 2026-03-16
