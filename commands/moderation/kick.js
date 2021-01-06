module.exports = {
    name: 'kick',
    category: 'moderation',
    aliases: [''],
    usage: "<member> <%REASON%>",
    args: 2,
    run: async (client, message, args, options) => {

        let member = message.getMember(args[0]);
        if (!member) return message.error("noMember");

        member.user.settings = await message.loadMemberSettings(member);

        let reason = args.join(" ").slice(args[0].length + 1);

        console.log(member.user.settings);

        // await member.kick({ reason: reason }).catch(e => {
        //     if (e.message == "Missing Permissions") return message.error("noPerms");
        //     throw e;
        // })

        if (!member.user.settings.moderation) member.user.settings.moderation = { bans: [], kicks: [], warns: [], mutes: [] }
        if (typeof member.user.settings.moderation.kicks !== "object") member.user.settings.moderation.kicks = [];
        member.user.settings.moderation.kicks.push({
            by: {
                id: message.author.id,
                tag: message.author.tag,
                avatar: message.author.displayAvatarURL(),
                highestRole: message.member.roles.highest.name
            },
            time: Date.now(),
            reason: reason,
            channel: {
                id: message.channel.id,
                name: message.channel.name
            }
        });
        await message.updateMember(member);

        message.sendEmbed({ title: `${member.user.username} kicked`, desc: `${client.l.commands.kick.succes.replace("%USER%", member.user)}` });
        client.logAction("moderation", "Member Kicked", `Member: ${member.user.tag} - ${member.user.id}\n${client.l._by}: ${message.author.tag} - ${message.author.id}\n${client.l._channel}: ${message.channel}\n${client.l._reason}: ${reason}`);
    }
}