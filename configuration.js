module.exports = class Configuration {
    constructor() {
        this.loaded = false;
        this.data = {};
    }

    getSetting(option) {
        return this.data[option];
    }
    setSetting(option, value) {
        return this.data[option] = value;
    }

    load(config) {
        const { token, language, defaultPrefix, database, settings, igbots, igdm, commands, events, status, statusType, logs } = config;
        this.data = {
            token: token,
            language: language || "en",
            defaultPrefix: defaultPrefix || "!",
            database: database !== undefined ? database : true,
            settings: {
                guild: settings && settings.guild || { prefix: defaultPrefix || "!" },
                user: settings && settings.user || {}
            },
            igbots: igbots !== undefined ? igbots : true,
            igdm: igdm !== undefined ? igdm : true,
            commands: commands !== undefined ? commands : true,
            events: events !== undefined ? events : true,
            status: status || "test",
            statusType: statusType !== undefined ? statusType.toUpperCase() : "WATCHING",
            logs: {
                log: logs && logs.log || "",
                moderation: logs && logs.moderation || "",
            },
        }
        console.log(this.data);
        return this.data;
    }
}