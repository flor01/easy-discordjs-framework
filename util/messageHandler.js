module.exports = exports = class MessageHandler extends require("./messageFunctions") {
    constructor(message, client) {
        super(message, client);
        if (client.igbots && message.author.bot) return;
        if (!message.content && !message.embeds) return;

        const prefix = message.guild.settings.prefix || client.configuration.getSetting("defaultPrefix");

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
            let cmd = client.commands.get(this.command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(this.command)) || client.defaultCommands.get(this.command) || client.defaultCommands.find(cmd => cmd.aliases && cmd.aliases.includes(this.command))
            if (cmd && message.content.startsWith(prefix)) {
                if (cmd.permission) {
                    if (cmd.permission == 1 && !message.member.isMod()) return message.error(client.l.err.noUserPerms.replace("%ROLE%", "mod"));
                    if (cmd.permission == 2 && !message.member.isAdmin()) return message.error(client.l.err.noUserPerms.replace("%ROLE%", "admin"))
                }

                if (cmd.args && this.args.length < cmd.args) {
                    let reply = client.l.err.notEnoughArgs;
                    if (cmd.usage) reply += `\n${client.l.err.useLikeThis} \`${client.config.prefix}${cmd.name} ${cmd.usage}\``;
                    return message.error(reply)
                }
                cmd.run(client, message, this.args).catch(e => {
                    return message.error(client.l.err.cmdErr.replace("%COMMAND%", message.guild.settings.prefix || client.defaultPrefix + cmd.name).replace("%ERROR%", e));
                })
            }
        }
    }
}