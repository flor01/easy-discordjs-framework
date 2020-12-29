module.exports = exports = class MessageHandler extends require("./messageFunctions") {
    constructor(message, client) {
        super(message, client);
        if (client.igbots && message.author.bot) return;

        const prefix = message.guild.settings.prefix || client.configuration.getSetting("defaultPrefix")
        if (!message.content.startsWith(prefix)) return;

        this.args = message.content.slice(prefix.length).trim().split(/ +/);
        this.command = this.args.shift().toLowerCase();
        this.arg = [];
        message.flags = [];
        this.args.forEach(arg => {
            if (arg.toLowerCase().startsWith("-")) message.flags.push(arg.split("-")[1].toLowerCase());
            else this.arg.push(arg);
        });
        this.args = this.arg;

        if (!client.igdm && message.channel.type == "dm") {

        } else {

            if (!this.command) return;
            let defaultCommand = client.defaultCommands.get(this.command) || client.defaultCommands.find(cmd => cmd.aliases && cmd.aliases.includes(this.command))
            let cmd = client.commands.get(this.command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(this.command));
            if (cmd) {
                cmd.run(client, message, this.args).catch(e => {
                    return message.error(client.l.err.cmdErr.replace("%COMMAND%", message.guild.settings.prefix || client.defaultPrefix + cmd.name).replace("%ERROR%", e));
                })
            } else if (defaultCommand) {
                defaultCommand.run(client, message, this.args, {}).catch(e => {
                    message.error(client.l.err.defcmdErr.replace("%COMMAND%", prefix + defaultCommand.name).replace("%ERROR%", e));
                })
                return;
            }
        }
    }
}