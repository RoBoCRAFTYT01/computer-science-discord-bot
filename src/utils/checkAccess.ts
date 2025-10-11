import {
    GuildMember,
    type PermissionResolvable
} from "discord.js";
import { AccessRules } from "@config/access";

export function hasAccess(
    member: GuildMember,
    level: keyof typeof AccessRules
): boolean {
    const { roles, perms } = AccessRules[level];

    const hasRole = roles.names.some(name =>
        member.roles.cache.some(role => role.name === name)
    ) || roles.ids.some(id => member.roles.cache.has(id));

    const hasPerm = perms.some(perm => member.permissions.has(perm as PermissionResolvable));

    return hasRole || hasPerm;
}
