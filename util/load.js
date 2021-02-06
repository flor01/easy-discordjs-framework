const fsscanner = require("fsscanner");
const { existsSync, statSync, readFileSync } = require("fs");
const { safeLoad } = require("js-yaml");
const { resolve } = require("path");
const { Collection } = require("discord.js");
module.exports = {
    logAction: function (type, title, desc, files) {
        type = type == "moderation" ? "moderation" : "log";
        let channel = client.channels.cache.get(client.config.getSetting("logs")[type]);
        if (!channel) return console.log(client.chalk.redBright(`There is no channel for ${type}!`));

        let msgObject = new client.util.message({}, client);
        if (!files) channel.send(msgObject.embed().setTitle(title).setDescription(desc));
        else channel.send({ embed: msgObject.embed().setTitle(title).setDescription(desc), files: files });
    },
    language: function (setting) {
        let l;
        let languages = {
            nl: readFileSync(resolve(__dirname, "../language/nl.yml"), "utf8"),
            en: readFileSync(resolve(__dirname, "../language/en.yml"), "utf8")
        };
        if (setting.toLowerCase() == "nl") l = safeLoad(languages.nl)
        else l = safeLoad(languages.en);
        return l;
    },
    cmdloader: function (dir = `${process.cwd()}/commands`) {
        let commands = new Collection();
        if (existsSync(dir)) {
            fsscanner.scan(dir, [], (err, results) => {
                if (err) throw err;
                results.forEach(file => {
                    let stats = statSync(file);
                    if (stats.isDirectory()) this.cmdloader(`${file}`);
                    else {
                        let command = require(file);
                        commands.set(command.name, command);
                    }
                })
            })
        }
        return commands;
    },
    eventloader: function (client, dir = `${process.cwd()}/events`) {
        let events = new Collection();
        if (existsSync(dir)) {
            fsscanner.scan(dir, [fsscanner.criteria.pattern(".js"), fsscanner.criteria.type("F")], (err, results) => {
                results.forEach(file => {
                    const event = require(file);
                    if (event.disabled) return;
                    if (!event.name) return;
                    client.on(event.name, (...eventdata) => event.run(client, ...eventdata))
                    events.set(event.name, event);
                })
            })
        }
        return events;
    },
}