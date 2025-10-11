import type { AccessRuleMap } from "types/config";

export const AccessRules: AccessRuleMap = {
    CEO: {
        roles: {
            names: ["CEO", "Overlord"],
            ids: [],
        },
        perms: ["Administrator"]
    },
    admin: {
        roles: {
            names: ["Manager", "GuildManager"],
            ids: ["1321791118047969310"],
        },
        perms: [
            "ManageGuild",
            "ManageRoles",
            "ManageChannels",
            "BanMembers",
            "KickMembers"
        ]
    },
    mod: {
        roles: {
            names: ["Mod", "Staff"],
            ids: [],
        },
        perms: ["KickMembers", "MuteMembers"]
    },
    support: {
        roles: {
            names: ["Support"],
            ids: [],
        },
        perms: []
    }
};
