# Report Parity Checklist

Tai lieu nay cover report catalog, run history, va parity comparison trong audience/report lane.

## Module

- Ten module: Reports
- Owner: Codex
- Phase: 3
- Legacy references: `admin.reports.*`
- New routes/screens: `/reports`

## 1. Functional parity

- [x] Report catalog snapshot is available in the dedicated reports route
- [x] Run history is visible in the dedicated reports route
- [x] Coverage snapshot highlights which active reports have successful runs
- [ ] Report drill-down view
- [ ] Report export flow

## 2. Data parity

- [x] Read-model uses `public.reports` and `public.report_runs`
- [x] Scope-aware event resolution respects company and event grants
- [ ] Legacy-to-new parity query comparison for report totals
- [ ] Legacy-to-new parity query comparison for run history

## 3. RBAC parity

- [x] Report read access is gated by `report.view`
- [ ] Report export permission
- [ ] Analyst-specific report drill-down scope

## 4. UX parity

- [x] Dedicated report screen exists
- [x] Report parity notes are visible before the UX/UI rewrite
- [ ] Filter and parameter controls
- [ ] Drill-down export drawer or modal

## 5. Integration parity

- [x] Reports route pulls auth bootstrap and RBAC bootstrap server-side
- [x] Snapshot uses service-role reads only
- [ ] End-to-end verification against production Supabase auth/session
- [ ] Legacy compare smoke test

## 6. Release decision

- [x] Ready for internal UAT
- [ ] Ready for pilot cutover
- [ ] Ready for full cutover

## Notes

- The dedicated report parity screen is live, but legacy comparison and export workflows still need parity work.
