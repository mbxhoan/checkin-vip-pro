export const PERMISSION_GROUPS = {
  company: [
    "company.view",
    "company.create",
    "company.update",
    "company.manage_settings",
  ],
  user: [
    "user.view",
    "user.create",
    "user.update",
    "user.invite",
    "user.approve_access",
    "user.force_sign_out",
    "user.assign_role",
  ],
  role_permission: ["role.view", "role.manage", "permission.view"],
  event: [
    "event.view",
    "event.create",
    "event.update",
    "event.clone",
    "event.archive",
    "event.feature.manage",
    "event.media.manage",
  ],
  event_settings: ["event_settings.view", "event_settings.update"],
  custom_field: [
    "custom_field.view",
    "custom_field.manage",
    "custom_field.reorder",
  ],
  client: [
    "client.view",
    "client.create",
    "client.update",
    "client.delete",
    "client.import",
    "client.export",
    "client.generate_qr",
    "client.send_email",
    "client.generate_card",
  ],
  checkin: [
    "checkin.view",
    "checkin.run",
    "checkin.manage",
    "checkin.export",
    "checkin.reset",
  ],
  report: ["report.view", "report.export", "report.render"],
  landing_page: [
    "landing_page.view",
    "landing_page.create",
    "landing_page.update",
    "landing_page.clone",
    "landing_page.publish",
  ],
  campaign: [
    "campaign.view",
    "campaign.create",
    "campaign.update",
    "campaign.clone",
    "campaign.cancel",
    "campaign.send",
  ],
  email: [
    "email.view",
    "email.export",
    "email.cancel",
    "email.status.change",
  ],
  email_template: [
    "email_template.view",
    "email_template.sync",
    "email_template.update",
    "email_template.clone",
    "email_template.unlock.manage",
    "email_template.unlock.request",
  ],
  email_sender: ["email_sender.view", "email_sender.manage"],
  label: [
    "label.view",
    "label.create",
    "label.update",
    "label.clone",
    "label.print",
    "label.render",
  ],
  card: [
    "card.view",
    "card.create",
    "card.update",
    "card.generate",
    "card.export",
    "card.render",
  ],
  media: ["media.view", "media.upload", "media.delete"],
  lucky_draw: [
    "lucky_draw.view",
    "lucky_draw.create",
    "lucky_draw.update",
    "lucky_draw.manage_rewards",
    "lucky_draw.run",
    "lucky_draw.reset",
    "lucky_draw.export_winners",
    "lucky_draw.builder.manage",
  ],
  audio: ["audio.assign"],
  history: ["history.view"],
  system_log: ["system_log.view"],
  chatbot: ["chatbot.use", "chatbot.mode.change", "chatbot.history.view", "chatbot.admin"],
  legal_billing: ["legal.view", "billing.view", "billing.manage"],
} as const;

export type PermissionResource = keyof typeof PERMISSION_GROUPS;
export type PermissionKey = (typeof PERMISSION_GROUPS)[PermissionResource][number];

export const PERMISSION_KEYS = Object.values(PERMISSION_GROUPS).flat() as PermissionKey[];

export const PERMISSION_SET = new Set<PermissionKey>(PERMISSION_KEYS);

export function isPermissionKey(value: string): value is PermissionKey {
  return PERMISSION_SET.has(value as PermissionKey);
}

export function permissionResourceFromKey(
  permissionKey: PermissionKey,
): PermissionResource {
  return permissionKey.split(".")[0] as PermissionResource;
}

export function groupPermissionsByResource(
  permissionKeys: readonly PermissionKey[],
): Record<PermissionResource, PermissionKey[]> {
  const grouped = {} as Record<PermissionResource, PermissionKey[]>;

  for (const resource of Object.keys(PERMISSION_GROUPS) as PermissionResource[]) {
    grouped[resource] = [];
  }

  for (const permissionKey of permissionKeys) {
    const resource = permissionResourceFromKey(permissionKey);
    grouped[resource]?.push(permissionKey);
  }

  return grouped;
}

export function getPermissionKeysForResource(
  resource: PermissionResource,
): readonly PermissionKey[] {
  return PERMISSION_GROUPS[resource];
}
