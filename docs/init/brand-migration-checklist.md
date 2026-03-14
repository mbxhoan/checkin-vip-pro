# Brand Migration Checklist: Delfi -> Giltech Solutions

Tai lieu nay dung de dam bao app moi khong bi sot thong tin thuong hieu/chu so huu khi doi tu Delfi sang Giltech Solutions.

## 1. Brand source of truth cho app moi

- Product name: `Giltech Solutions Check-in`
- Owner company: `Giltech Solutions`
- Legacy references (`Delfi`) chi duoc giu trong:
  - migration notes
  - legacy mapping docs
  - import/backfill scripts khi can doi chieu

## 2. UI and copy checklist

- [ ] Header, sidebar, footer, login, onboarding, empty states
- [ ] Email templates preview labels
- [ ] PDF/export titles, report headings
- [ ] Browser title, meta tags, OG tags
- [ ] System notifications, toast messages
- [ ] Chatbot intro/system responses

## 3. Asset checklist

- [ ] Logo files
- [ ] Favicon
- [ ] Splash/loading assets
- [ ] Email header/footer brand assets
- [ ] Print templates default logo

## 4. Legal and owner checklist

- [ ] Terms of service owner name
- [ ] Privacy policy owner name
- [ ] Payment/refund owner name
- [ ] Footer legal owner fields
- [ ] Tax code/address/hotline/contact email

## 5. Domain and infra references

- [ ] Web domains
- [ ] API base URLs
- [ ] Auth callback URLs
- [ ] Webhook URLs (n8n/postmark)
- [ ] Storage/CDN public URLs
- [ ] Monitoring/alert destination emails

## 6. Data and config checklist

- [ ] Env defaults
- [ ] Seed data (company_name, sender_name, credits)
- [ ] Permission labels and role display names
- [ ] Documentation links and HDSD assets
- [ ] Template placeholder strings

## 7. Integration checklist

- [ ] Postmark sender identity and template branding
- [ ] n8n workflow labels and system prompts
- [ ] Print headers/footers
- [ ] Scan app splash and runtime branding

## 8. Verification checklist before release

- [ ] `rg -n "Delfi|delfi|DELFI"` tren repo app moi: khong con ket qua brand-facing
- [ ] Spot check 10 man hinh quan trong: dung brand Giltech
- [ ] Spot check 5 email templates: dung brand Giltech
- [ ] Spot check 3 file export (csv/pdf/html): dung brand Giltech
- [ ] Legal/footer da dung owner info Giltech

## 9. Notes on acceptable legacy traces

Cho phep ton tai string `Delfi` trong:

- migration docs
- mapping scripts
- archived historical data
- old audit log snapshots

Khong cho phep ton tai string `Delfi` trong output huong nguoi dung cua app moi.
