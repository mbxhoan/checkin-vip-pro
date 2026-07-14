# Shell Module Parity Checklist

Tai lieu nay cover workspace, audience, experience, engagement, system shells va template vault.

## Module

- Ten module: Shell module surfaces
- Owner: Codex
- Phase: 1
- Legacy references: NextAdmin dashboard shell, legacy admin lane groupings, profile/settings demo pages
- New routes/screens: `/workspace`, `/audience`, `/experience`, `/engagement`, `/system`, `/system/template-vault`

## 1. Functional parity

- [x] Co lane pages cho workspace, audience, experience, engagement, va system
- [x] Co template vault de giu demo routes va reusable component families
- [x] Co quick links tu shell sang RBAC va vault
- [x] Khong con link demo route trong primary nav

## 2. Data parity

- [x] Shell pages doc auth bootstrap va RBAC bootstrap
- [x] Template vault doc archived routes and reusable families
- [x] No schema change needed for shell-only pages

## 3. RBAC parity

- [x] Root shell va lane shells dung server-side auth context
- [x] Demo routes remain archived, not primary navigation
- [x] Vault route is discoverable only from shell/system surfaces

## 4. UX parity

- [x] Lane copy aligns with target architecture bounded contexts
- [x] Header labels reflect lane-based navigation
- [x] Home dashboard exposes shell lanes and the vault
- [x] Archived template components preserved for later reuse

## 5. Integration parity

- [x] Sidebar and user menu route to shell pages
- [x] Template vault links archived demo routes
- [x] Root shell continues to render Giltech-branded dashboard

## 6. Release decision

- [x] Ready for internal UAT
- [ ] Ready for pilot cutover
- [ ] Ready for full cutover

## Notes

- Legacy demo routes remain in repo but are hidden from primary nav and referenced only by the template vault.
- Feature modules behind each lane still need real product screens and parity checks.
