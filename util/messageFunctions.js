const { MessageEmbed } = require("discord.js");

module.exports = exports = class MessageFunctions {
    constructor(message, client) {

        message.embed = () => {
            return new MessageEmbed()
                .setColor(client.config.getSetting("embedColor") || "#0e64ed")
                .setTimestamp()
                .setFooter(`© ${client.config.getSetting("servername") || message.guild && message.guild.name || ""} - ${message.author ? `${client.l._by} ${message.author.username}` : ""}`);
        }

        message.error = (text) => {
            return message.channel.send(message.embed()
                .setTitle(text == "noMember" ? client.l.err.noMember : text == "noPerms" ? client.l.err.noPerms.replace("%COMMAND% :\n%MISSING%", "this command.") : text)
                .setColor("#fc0303")
            )
        }
        message.succes = (text) => {
            return message.channel.send(message.embed()
                .setDescription(text)
            )
        }
        message.sendEmbed = ({ title: title, desc: desc, color: color }) => {
            let embed = message.embed();
            if (title) embed.setTitle(title);
            if (desc) {
                if (desc.length >= 2048) desc = desc.substr(0, 2044) + "...";
                embed.setDescription(desc);
            }
            if (color) embed.setColor(color);
            return message.channel.send(embed);
        }

        if (message.guild) {
            message.canModifyQueue = () => {
                const { channelID } = message.member.voice;
                if (!channelID) {
                    message.error(client.l.err.notInVoice);
                    return false;
                }
                const botChannel = message.member.guild.voice ? message.member.guild.voice.channelID : null;
                if (!botChannel) return true;
                if (channelID !== botChannel) {
                    message.error(client.l.err.notInSameVoice).catch(console.error);
                    return false;
                }
                return true;
            }

            message.getMember = (member) => {
                return message.mentions.members.first() || message.guild.members.cache.get(member) || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(member ? member.toLowerCase() : member)) || message.guild.members.cache.find(m => m.user.tag.toLowerCase().includes(member ? member.toLowerCase() : member));
            }

            message.getChannel = (channel) => {
                return message.mentions.channels.first() || message.guild.channels.cache.get(channel) || message.guild.channels.cache.find(c => c.name.toLowerCase().includes(channel));
            }

            message.getRole = (role) => {
                return message.mentions.roles.first() || message.guild.roles.cache.get(role) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(role));
            }

            let memberPos = message.member.roles.cache.sort((a, b) => a.rawPosition - b.rawPosition).last().rawPosition;

            message.member.isStaff = () => {
                return !!message.member.roles.cache.find(r => r.name.toLowerCase().includes("staff"));
            }

            message.member.isMod = () => {
                if (message.member.hasPermission("ADMINISTRATOR")) return true;
                let mod = message.guild.roles.cache.find(r => r.name.toLowerCase().includes("moderator"));
                if (!mod) return false;
                return memberPos >= mod.rawPosition;
            }

            message.member.isAdmin = () => {
                if (message.member.hasPermission("ADMINISTRATOR")) return true;
                let admin = message.guild.roles.cache.find(r => r.name.toLowerCase().includes("admin"));
                if (!admin) return false;
                return memberPos >= admin.rawPosition;
            }

            message.member.highestPos = () => {
                return message.member.roles.cache.sort((a, b) => a.rawPosition - b.rawPosition).last().rawPosition;
            }
        }

        if (client.db) {
            message.loadMember = async function (member) {
                let settings = await client.db.get(`${message.guild.id}-${member.user.id}`) || client.config.getSetting("settings").user;
                return settings;
            }
            message.updateMember = async function (member, settings) {
                await client.db.set(`${message.guild.id}-${member.user.id}`, settings || member.user.settings);
                return true;
            }
            if (!message.author) return message;
            if (!message.author.settings) {
                message.author.settings = client.db.get(`${message.guild.id}-${message.author.id}`);
                if (!message.author.settings) {
                    message.author.settings = client.config.userSettings;
                    client.db.set(`${message.guild.id}-${message.author.id}`, message.author.settings);
                }
            }
            message.author.updateDB = async function () {
                client.db.set(`${message.guild.id}-${message.author.id}`, message.author.settings);
                return message.author.settings;
            }
            message.author.updateDB();

            if (message.guild) {
                message.guild.settings = client.db.get(`guild-${message.guild.id}`);
                if (!message.guild.settings || !message.guild.settings.prefix) message.guild.settings = client.config.getSetting("settings").guild;
                message.guild.updateDB = async function () {
                    client.db.set(`guild-${message.guild.id}`, message.guild.settings);
                    return message.author.guildSettings;
                }
                message.guild.updateDB();
            }
        }

        return message;
    }
}