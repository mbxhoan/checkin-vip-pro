# Route To Module Map

Tai lieu nay map route hien tai sang module va phase migration. Muc tieu la tranh sot route khi chuyen UI.

## 1. Admin web

| Route prefix/pattern | Module | Phase de xuat |
|---|---|---|
| `admin.dashboard` | Dashboard | 1 |
| `admin.companys.*` | Company | 2 |
| `admin.events.*` | Event | 2 |
| `admin.event_settings.*` | Event settings | 2 |
| `admin.event_files.*` | Event files | 2 |
| `admin.custom_field_templates.*` | Dynamic fields | 2 |
| `admin.clients.*` | Clients | 3 |
| `admin.checkins.*` | Check-in | 3 |
| `admin.reports.*` | Reports | 3 |
| `admin.landing_pages.*` | Landing page | 4 |
| `admin.language_defines.*` | Language define | 4 |
| `admin.campaigns.*` | Campaign | 5 |
| `admin.campaign_details.*` | Campaign detail/send | 5 |
| `admin.emails.*` | Email reporting | 5 |
| `admin.email_templates.*` | Email templates | 5 |
| `admin.email_senders.*` | Email senders | 5 |
| `admin.labels.*` | Label print | 6 |
| `admin.label_details.*` | Label detail | 6 |
| `admin.cards.*` | Cards | 6 |
| `admin.card_details.*` | Card detail | 6 |
| `admin.lucky_draws.*` | Lucky draw | 7 |
| `admin.lucky_draw_rewards.*` | Lucky draw rewards | 7 |
| `admin.lucky_draw_clients.*` | Lucky draw participants | 7 |
| `admin.lucky_draws.builder.*` | Lucky draw builder | 7 |
| `admin.lucky_draws.draw.*` | Lucky draw runtime | 7 |
| `admin.audios.*` | Audio | 7 |
| `admin.chatbot.n8n.*` | AI chatbot | 8 |
| `admin.histories.*` | History | 8 |
| `admin.logs` | System logs | 8 |
| `admin.users.*` | Users | 2 |
| `admin.media.*` | Media | 8 |

## 2. Public web

| Route pattern | Module | Phase de xuat |
|---|---|---|
| `/register/{slug}` | Landing page registration | 4 |
| `/register/{slug}/success/{qrcode}` | Registration success | 4 |
| `/clients/generate/id/{id}` | Public QR generation | 4 |
| `/clients/qrcode/id/{id}` | Public QR view | 4 |
| `/clients/card/view/{cardId}/{clientId}` | Public card view | 6 |
| `/clients/document/view/{clientId}` | Public document view | 5 |
| `/terms-of-use` | Legal | 1 |
| `/privacy-policy` | Legal | 1 |
| `/payment-refund-policy` | Legal | 1 |

## 3. Scan app

| Route pattern | Module | Phase de xuat |
|---|---|---|
| `/login` | Scan auth | 3 |
| `/index` | Event selection for scan | 3 |
| `/scan/{event}` | Check-in runtime | 3 |
| `/scan/{event}/layout` | Check-in layout save | 3 |
| `/checkin` | Check-in action | 3 |
| `/sync-offline` | Offline sync | 3 |
| `/render-label/{label}` | On-site print render | 6 |

## 4. Rule su dung tai lieu nay

- Moi module UI moi phai confirm da cover het route trong bang.
- Moi route chua duoc migrate phai co fallback sang UI cu hoac shell cu.
- Khong go route cu truoc khi parity checklist cua module do pass.
