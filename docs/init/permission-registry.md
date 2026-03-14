# Permission Registry

Day la registry khoi tao cho app moi. Dung file nay lam source of truth cho:

- backend authorization;
- frontend menu/button visibility;
- role matrix;
- test cases.

## 1. Naming rule

Quy tac:

`resource.action`

Vi du:

- `event.view`
- `event.update`
- `client.import`
- `report.export`

## 2. Registry khoi tao theo domain

| Domain | Permission keys de xuat |
|---|---|
| company | `company.view`, `company.create`, `company.update`, `company.manage_settings` |
| user | `user.view`, `user.create`, `user.update`, `user.invite`, `user.approve_access`, `user.force_sign_out`, `user.assign_role` |
| role_permission | `role.view`, `role.manage`, `permission.view` |
| event | `event.view`, `event.create`, `event.update`, `event.clone`, `event.archive`, `event.feature.manage`, `event.media.manage` |
| event_settings | `event_settings.view`, `event_settings.update` |
| custom_field | `custom_field.view`, `custom_field.manage`, `custom_field.reorder` |
| client | `client.view`, `client.create`, `client.update`, `client.delete`, `client.import`, `client.export`, `client.generate_qr`, `client.send_email`, `client.generate_card` |
| checkin | `checkin.view`, `checkin.run`, `checkin.manage`, `checkin.export`, `checkin.reset` |
| report | `report.view`, `report.export`, `report.render` |
| landing_page | `landing_page.view`, `landing_page.create`, `landing_page.update`, `landing_page.clone`, `landing_page.publish` |
| campaign | `campaign.view`, `campaign.create`, `campaign.update`, `campaign.clone`, `campaign.cancel`, `campaign.send` |
| email | `email.view`, `email.export`, `email.cancel`, `email.status.change` |
| email_template | `email_template.view`, `email_template.sync`, `email_template.update`, `email_template.clone`, `email_template.unlock.manage`, `email_template.unlock.request` |
| email_sender | `email_sender.view`, `email_sender.manage` |
| label | `label.view`, `label.create`, `label.update`, `label.clone`, `label.print`, `label.render` |
| card | `card.view`, `card.create`, `card.update`, `card.generate`, `card.export`, `card.render` |
| media | `media.view`, `media.upload`, `media.delete` |
| lucky_draw | `lucky_draw.view`, `lucky_draw.create`, `lucky_draw.update`, `lucky_draw.manage_rewards`, `lucky_draw.run`, `lucky_draw.reset`, `lucky_draw.export_winners`, `lucky_draw.builder.manage` |
| audio | `audio.assign` |
| history | `history.view` |
| system_log | `system_log.view` |
| chatbot | `chatbot.use`, `chatbot.mode.change`, `chatbot.history.view`, `chatbot.admin` |
| legal_billing | `legal.view`, `billing.view`, `billing.manage` |

## 3. Mapping role template sang registry

| Role | Permission group default |
|---|---|
| `system_admin` | Tat ca |
| `company_admin` | company, user, event, client, checkin, report, landing_page, campaign, email_template, label, card, lucky_draw, media, chatbot.history.view |
| `event_manager` | event.view, event.update, client.*, checkin.*, report.*, campaign.view, campaign.create, campaign.update |
| `report_analyst` | report.*, client.view, checkin.view, campaign.view |
| `content_operator` | landing_page.*, campaign.*, email_template.view, label.*, card.*, media.* |
| `checkin_operator` | client.view, checkin.run, checkin.view, label.print, card.render |
| `scanner_device` | checkin.run, client.view |
| `support_agent` | history.view, system_log.view, chatbot.admin, chatbot.history.view, user.view |

## 4. Scope note bat buoc

Permission chi tra loi cau hoi "duoc lam gi". Scope tra loi cau hoi "duoc lam tren du lieu nao".

Vi du:

- `client.export` + scope `event:123`
- `report.view` + scope `company:9`
- `user.assign_role` + scope `company:9`

## 5. Change management

Moi khi them module moi hoac button action moi, phai cap nhat file nay truoc khi implement UI.
