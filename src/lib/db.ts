import mongoose, { type ConnectOptions } from "mongoose";
import { handleError, BotError } from "@lib/handlers/ErrorHandler";
import { Logger } from "@lib/Logger";

const connectDB = async ( { ENV } : envProps ): Promise<void> => {
    try {
        const database: string | undefined = ENV.DATABASE;

        if (!database) {
            throw new Error("DATABASE environment variable is not defined.");
        }

        const conn = await mongoose.connect(database, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        } as ConnectOptions);

        Logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        handleError(new BotError("Failed to connect to MongoDB", "DATABASE"), "src/lib/db.ts line 20 ( Database )");
        console.log(error)
        process.exit(1);
    }
};

mongoose.connection.on("connected", () => {
    Logger.success("Mongoose connected to DB")
});

mongoose.connection.on("error", (err) => {
    handleError(new BotError(err.message, "DATABASE"), "src/lib/db.ts line 30 ( MongoConnection )");
});

mongoose.connection.on("disconnected", () => {
    Logger.warn("Mongoose disconnected")
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    Logger.debug("Mongoose connection closed due to app termination");
    process.exit(0);
});

export default connectDB;
