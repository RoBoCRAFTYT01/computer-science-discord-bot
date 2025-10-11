import type { copyright } from "type/embed";
import type { PermissionResolvable } from "discord.js";
import { AccessRules } from "@config/access";
import { GuildMember } from "discord.js";

interface SlashCommandOption {
    defaultCooldown: number;
    ownerOnly: boolean;
    devGuild: string;
    embedDefault: copyright;
}

interface RoleAccess {
    roles: {
        names: string[];
        ids: string[];
    };
    perms: PermissionResolvable[];
}

type AccessLevel = "CEO" | "admin" | "mod" | "support";

type CheckPermission = {
    level: AccessLevel;
    access: boolean;
}

type AccessRuleMap = {
    [key in AccessLevel]: RoleAccess;
};

interface hasAccessProps {
    member: GuildMember;
    level: keyof typeof AccessRules;
}