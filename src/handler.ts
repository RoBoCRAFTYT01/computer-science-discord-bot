import { Loader } from "@lib/Loader";
import { client } from "@lib/Client";
import { Logger } from "@lib/Logger";

const loader = new Loader(__dirname);

export async function loadCommands() {
	await loader.load("commands", async (filePath) => {
			const commandModule = await import(filePath);
			const command = commandModule.default;

			if (command.data && command.run) {
				client.commands.set(command.data.name, command);
			} else {
				Logger.error(`Command at ${filePath} is missing "name" or "run"`);
			}
	}, "COMMAND");
}

loader.load("events", async (filePath) => {
        const eventModule = await import(filePath);
        const event = eventModule.default;

        if (event.name && event.execute) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        } else {
            Logger.error(`Event at ${filePath} is missing required properties.`)
        }
}, "EVENT");