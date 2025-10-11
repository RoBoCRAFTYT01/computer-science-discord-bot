import chalk from "chalk"
import { ENV } from "@config/env"

export const Logger = {
    info: (msg: string) => console.log(`${chalk.blue("[INFO]")} ${msg}`),
    success: (msg: string) => console.log(`${chalk.green("[SUCCESS]")} ${msg}`),
    warn: (msg: string) => console.warn(`${chalk.yellow("[WARN]")} ${msg}`),
    error: (msg: string) => console.error(`${chalk.red("[ERROR]")} ${msg}`),
    debug: (msg: string) => {
        if (ENV.NODE_ENV === "dev") {
            console.log(`${chalk.magenta("[DEBUG]")} ${msg}`)
        }
    }
}
