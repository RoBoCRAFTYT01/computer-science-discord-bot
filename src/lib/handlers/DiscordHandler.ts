import type { RoBoClient } from '@lib/Client';
import { Events } from 'discord.js';
import { Logger } from '@lib/Logger';

export class DiscordErrorHandler {
    constructor(private client: RoBoClient) { }

    public init() {
        process.on('uncaughtException', this.handleProcessError.bind(this, 'UncaughtException'));
        process.on('unhandledRejection', this.handleProcessError.bind(this, 'UnhandledRejection'));

        this.client.on(Events.Error, (err) => this.handleDiscordError('DiscordClientError', err));
        this.client.on(Events.ShardError, (err, shardId) => this.handleShardError(err, shardId));
    }

    private handleProcessError(type: string, error: unknown) {
        Logger.error(`[❌ ${type}] ${error}`);
    }

    private handleDiscordError(type: string, error: unknown) {
        Logger.error(`[⚠️ ${type}] ${error}`);
    }

    private handleShardError(error: unknown, shardId: number) {
        Logger.error(`[💥 Shard ${shardId} Error] ${error}`);
    }

    public diagnoseAPIError(error: any) {
        if (!error || typeof error !== 'object') return 'Unknown error occurred';

        if ('code' in error && 'message' in error) {
            return `API Error [${error.code}]: ${error.message}`;
        }

        return 'Unexpected error structure received from Discord API';
    }
}
