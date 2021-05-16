const { Client } = require("discord.js");
const { greenBright, black } = require("chalk");
module.exports = class Framework extends Client {
    constructor(settings, options = {}) {
        super(options);
        this.util = {
            load: require("./util/load"),
            msghandler: require("./util/messageHandler"),
            message: require("./util/messageFunctions"),
            database: require("./util/database"),
            handler: require("./util/handler"),
        }
        this.config = require("./configuration")(settings);
        this.handler = this.util.handler;
        this.load = this.util.load;

        if (this.config.commands) this.commands = this.load.cmdloader();
        if (this.config.events) this.events = this.load.eventloader(this);
        this.l = this.load.language(settings.language);

        if (this.config.database) {
            this.db = this.util.database;
            this.db.start();
            this.db.isReady().then(() => console.log(greenBright("Database is ready!")));
        }
        if (this.config.commands) {
            this.handler.add('command', {
                'callback': this.util.msghandler,
                'context': this,
                "class": true
            });
        }

        super.on("ready", () => {
            if (this.config.status) this.user.setActivity(this.config.status, { type: this.config.statusType });

            console.log(black.bgGreen(this.l.ready.replace("%CLIENT%", this.user.username).replace("%COMMANDS%", this.commands ? this.commands.size : "0").replace("%EVENTS%", this.events ? this.events.size : "0")));
        })
        super.on("message", message => this.handler.handleAll(message));

        require("./util/clientFunctions")(this);
    }
    async connect() {
        await this.login(this.config.token);
        return this;
    }

    disconnect() {
        return this.destroy();
    }

    observe(event, callback) {
        super.on(event, callback);
        return this;
    }

    getGuilds() {
        return this.guilds.cache;
    }

    addHandler(name, callback) {
        this.handler.add(name, callback);
        return this;
    }

    bind(command, options) {
        if (typeof command == "object") {
            if (!command.name || !command.run) throw new Error("You didn't provide a command name/run function!");
            this.commands.set(command.name, command);
            return;
        }
        if (typeof options !== "object") throw new Error("You didn't provide any command options!");
        this.commands.set(command.run || command, options);
        return this;
    }
}