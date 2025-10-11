import { Logger } from "@lib/Logger"

export class BotError extends Error {
    constructor(message: string, public type: "COMMAND" | "EVENT" | "DATABASE" = "COMMAND") {
        super(message)
        this.name = `[${type} ERROR]`
    }
}

export const handleError = (err: unknown, location = "Unknown") => {
    if (err instanceof BotError) {
        Logger.error(`${err.name} (${location}): ${err.message}`)
    } else if (err instanceof Error) {
        Logger.error(`[Unhandled Error] (${location}): ${err.stack}`)
    } else {
        Logger.error(`[Unknown Error] (${location}): ${err}`)
    }
}
