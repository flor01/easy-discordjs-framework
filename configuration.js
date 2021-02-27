module.exports = (config) => {
    return {
        token: config.token,
        language: config.language || "en",
        defaultPrefix: config.defaultPrefix || "!",
        database: config.database !== undefined ? config.database : true,
        settings: {
            guild: config.settings && config.settings.guild || { prefix: config.defaultPrefix || "!" },
            user: config.settings && config.settings.user || {}
        },
        igbots: config.igbots !== undefined ? config.igbots : true,
        igdm: config.igdm !== undefined ? config.igdm : true,
        commands: config.commands !== undefined ? config.commands : true,
        events: config.events !== undefined ? config.events : true,
        status: config.status || "test",
        statusType: config.statusType !== undefined ? config.statusType.toUpperCase() : "WATCHING",
        logs: {
            log: config.logs && config.logs.log || "",
            moderation: config.logs && config.logs.moderation || "",
        },
        messageFlags: config.messageFlags || true,
        embedColor: config.embedColor
    };
}