import { ColorResolvable } from "discord.js";

type FieldInput = {
    name: string;
    value: string;
    inline?: boolean;
};

type EmbedType = "default" | "success" | "error" | "info" | "warning";

interface EmbedOptions {
    title: string;
    description: string;
    fields?: FieldInput[];
    thumbnail?: string;
    image?: string;
    type?: EmbedType;
}

type footer = {
    text: string;
    iconURL?: string;
}

type author = {
    name: string;
    iconURL?: string;
}

interface copyright {
    footer: footer;
    author: author
}