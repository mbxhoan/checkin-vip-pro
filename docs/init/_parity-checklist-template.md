# Parity Checklist Template

Dung file nay de review tung module truoc khi cat sang UI moi.

## Module

- Ten module:
- Owner:
- Phase:
- Legacy references:
- New routes/screens:

## 1. Functional parity

- [ ] Co du man hinh list/create/edit/detail/runtime can thiet
- [ ] Co du filter/search/sort
- [ ] Co du import/export/generate actions neu module can
- [ ] Co du empty/loading/error states
- [ ] Co success/error feedback ro rang

## 2. Data parity

- [ ] Field hien thi du va dung meaning
- [ ] Status badge/map dung
- [ ] Cross-company isolation dung
- [ ] Event scope dung
- [ ] Async progress/job state hien thi dung
- [ ] Mapping MySQL cu -> PostgreSQL moi khong mat nghia du lieu
- [ ] Sample query doi chieu ket qua cu va moi khop

## 3. RBAC parity

- [ ] Dung role template
- [ ] Dung permission key
- [ ] Dung scope
- [ ] Hidden/disabled state hop ly
- [ ] Backend chan duoc action trai quyen

## 4. UX parity

- [ ] Khong tang so click cho critical path
- [ ] Operator/scanner flow nhanh va ro
- [ ] Desktop dung tot
- [ ] Mobile/tablet dung duoc neu co yeu cau

## 5. Integration parity

- [ ] Queue/job
- [ ] File upload/download
- [ ] Postmark/N8N/printing/scan runtime neu lien quan
- [ ] Logging/history neu lien quan

## 6. Release decision

- [ ] Ready for internal UAT
- [ ] Ready for pilot cutover
- [ ] Ready for full cutover

## Notes

- Rui ro con lai:
- Fallback plan:
- Owner ky xac nhan:
