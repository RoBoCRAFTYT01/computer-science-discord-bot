import type { AccessRuleMap } from "types/config";

export const AccessRules: AccessRuleMap = {
    CEO: {
        roles: {
            names: ["CEO", "Overlord"],
            ids: ["1291056365594345553"],
        },
        perms: ["Administrator"]
    },
    admin: {
        roles: {
            names: ["Manager", "GuildManager"],
            ids: ["1291058592019120220", "1419762304748359942"],
        },
        perms: []
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
