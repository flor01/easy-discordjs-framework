module.exports = (message, client) => {
    message = client.util.message(message, client);
    if (client.igbots && message.author.bot) return;
    if (!message.content && !message.embeds) return;

    const prefix = message.guild.settings.prefix || client.config.defaultPrefix;

    this.args = message.content.slice(prefix.length).trim().split(/ +/);
    this.command = this.args.shift().toLowerCase();

    if (client.config.messageFlags) {
        message.flags = [];
        while (this.args[0] && this.args[0][0] === "-") {
            message.flags.push(this.args.shift().slice(1));
        }
    }

    if (!client.igdm && message.channel.type == "dm") {

    } else {

        if (!this.command) return;
        let command = client.commands.get(this.command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(this.command));
        let cmd = command;
        if (cmd && message.content.startsWith(prefix)) {
            if (cmd.permission) {
                if (cmd.permission == 1 && !message.member.isMod()) return message.error(client.l.err.noUserPerms.replace("%ROLE%", "mod"));
                if (cmd.permission == 2 && !message.member.isAdmin()) return message.error(client.l.err.noUserPerms.replace("%ROLE%", "admin"));
            }

            if (cmd.args && this.args.length < cmd.args) {
                if (cmd.usage) return message.error(client.l.err.notEnoughArgs + `\n${client.l.err.useLikeThis} \`${prefix}${cmd.name} ${cmd.usage.replace("%REASON%", client.l._reason)}\``);
                return message.error(client.l.err.notEnoughArgs);
            }

            let options = {};

            cmd.run(client, message, this.args, options).catch(e => {
                return message.error(client.l.err.cmdErr.replace("%COMMAND%", prefix + cmd.name).replace("%ERROR%", e));
            })
        }
    }
}