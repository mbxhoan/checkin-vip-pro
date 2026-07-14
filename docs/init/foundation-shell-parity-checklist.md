# Foundation Shell Parity Checklist

Module này cover app shell nền cho Giltech Solutions Check-in: root dashboard, sidebar/header/footer, auth shell, RBAC entry points, và legal pages.

## Module

- Ten module: Foundation shell
- Owner: Codex
- Phase: 1
- Legacy references: admin shell, public shell, scan shell, NextAdmin template shell
- New routes/screens: `/`, `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/reset-password`, `/rbac`, `/system/template-vault`, `/terms-of-use`, `/privacy-policy`, `/payment-refund-policy`

## 1. Functional parity

- [x] Co root dashboard shell thay cho template dashboard
- [x] Co branded sidebar va header khong con menu template
- [x] Co footer va legal navigation cho public-facing routes
- [x] Co auth routes cho sign-in, sign-up, forgot password, reset password
- [x] Co RBAC entry points de vao company/user/role/permission console

## 2. Data parity

- [x] Session bootstrap doc duoc Supabase Auth
- [x] `auth.users -> public.users` mapping co trong seed va backend bootstrap
- [x] Demo seed co companies, events, users, roles, permissions, access scopes
- [x] No schema meaning change trong foundation shell

## 3. RBAC parity

- [x] Root shell khong dung menu visibility lam authorization
- [x] Permission gate primitive co san cho UI phia sau
- [x] RBAC aware quick links chi trinh bay route da co
- [x] Guest state va signed-in state deu render an toan

## 4. UX parity

- [x] Root page khong con NextAdmin copy/visual shell
- [x] Browser title va metadata phu hop Giltech
- [x] Responsive desktop/mobile co ho tro sidebar toggle
- [x] Notification, footer, va workspace copy da Giltech-facing

## 5. Integration parity

- [x] Supabase Auth route co sign-in/sign-up/recovery
- [x] Server bootstrap co doc session va RBAC payload
- [x] Footer co legal links cho release sau

## 6. Release decision

- [x] Ready for internal UAT
- [ ] Ready for pilot cutover
- [ ] Ready for full cutover

## Notes

- Rui ro con lai: cac legacy demo routes nhu `/calendar`, `/tables`, `/charts/*`, `/forms/*`, `/ui-elements/*`, `/profile`, va `/pages/settings` van ton tai trong repo nhung da duoc dua vao template vault, khong con duoc link tu shell chinh.
- Fallback plan: neu can, route do co the bi redirect hoac de xoa o cleanup pass tiep theo; template vault la dau moi chinh de tim lai demo surfaces.
- Owner ky xac nhan: Codex
