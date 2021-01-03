const fsscanner = require("fsscanner");
const { existsSync, statSync, readFileSync } = require("fs");
const { Collection } = require("discord.js");
const { safeLoad } = require("js-yaml");
const { resolve } = require("path");
module.exports = exports = class Load {
    constructor(client) {
        this.client = client;
        this.client.chalk = require("chalk");

        this.client.commands = new Collection();
        this.client.events = new Collection();
        this.client.defaultCommands = new Collection();
        if (this.client.config.getSetting('commands')) this.cmdloader();
        if (this.client.config.getSetting('events')) this.eventloader();

        this.client.util = {
            load: require("./load"),
            msghandler: require("./messageHandler"),
            message: require("./messageFunctions"),
            database: require("./database"),
            handler: require("./handler"),
        }
        if (this.client.config.getSetting("database") === true) {
            this.client.db = new this.client.util.database({
                development: false
            });
            this.client.db.isReady().then(() => {
                console.log(this.client.chalk.greenBright("Database is ready!"));
            });
        }

        this.client.handler = new this.client.util.handler()


        this.languages = { nl: readFileSync(resolve(__dirname, "../language/nl.yml"), "utf8"), en: readFileSync(resolve(__dirname, "../language/en.yml"), "utf8") };
        if (this.client.config.getSetting("language").toLowerCase() == "nl") this.client.l = safeLoad(this.languages.nl)
        else this.client.l = safeLoad(this.languages.en);


        this.client.logAction = async (type, title, desc, files) => {
            type = type == "moderation" ? "moderation" : "log";
            let channel = this.client.channels.cache.get(this.client.config.getSetting("logs")[type]);
            if (!channel) return console.log(this.client.chalk.redBright(`There is no channel for ${type}!`));

            let msgObject = new this.client.util.message({}, this.client);
            if (!files) channel.send(msgObject.embed().setTitle(title).setDescription(desc));
            else channel.send({ embed: msgObject.embed().setTitle(title).setDescription(desc), files: files });
        }

    }
    cmdloader(dir = `${process.cwd()}/commands`) {
        if (existsSync(dir)) {
            fsscanner.scan(dir, [], (err, results) => {
                if (err) throw err;
                results.forEach(file => {
                    let stats = statSync(file);
                    if (stats.isDirectory()) cmdloader(`${file}`);
                    else {
                        let command = require(file);
                        this.client.commands.set(command.name, command);
                    }
                })
            })
        }
    }
    eventloader(dir = `${process.cwd()}/events`) {
        if (existsSync(dir)) {
            fsscanner.scan(dir, [fsscanner.criteria.pattern(".js"), fsscanner.criteria.type("F")], (err, results) => {
                results.forEach(file => {
                    const event = require(file);
                    if (event.disabled) return;
                    if (!event.name) return;
                    this.client.on(event.name, (...eventdata) => event.run(this.client, ...eventdata))
                    this.client.events.set(event.name, event);
                })
            })
        }
    }
    moduleloader(dir) {
        try {
            let command = require(dir)
            this.client.defaultCommands.set(command.name, command);
        } catch (e) {
            if (e.code !== "MODULE_NOT_FOUND") throw e;
        }
    }
    modulegrouploader(dir) {
        if (existsSync(dir)) {
            fsscanner.scan(dir, [], (err, results) => {
                if (err) throw err;
                results.forEach(file => {
                    if (statSync(file).isDirectory()) this.modulegrouploader(file);
                    else this.moduleloader(file);
                })
            })
        } else console.log(`Can't find group: ${dir}`);
    }

}