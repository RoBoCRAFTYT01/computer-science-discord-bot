import BotLogin from "./bot";
import connectDB from "@lib/db";
import { ENV } from "@config/env";

import { loadCommands } from "./handler";
import { registerCommands } from "@lib/RegisterCommands";


async function start() {
	await loadCommands();
	await registerCommands();
	BotLogin({ ENV });
	connectDB({ ENV });
}

start();
