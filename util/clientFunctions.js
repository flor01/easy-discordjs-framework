module.exports = (client) => {

    client.awaitReply = async ({ msg, question, limit = 60000 }) => {
        const filter = m => m.author.id === msg.author.id;
        await msg.channel.send(question);
        try {
            const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
            return collected.first().content;
        } catch (e) {
            return false;
        }
    };

    client.awaitReaction = async ({ msg, max, limit = 60000, reaction }) => {
        let reactions = reaction;
        if (typeof reaction == "string") reactions = [reaction];
        reactions.forEach(async r => await msg.react(r));

        let filter = (r, user) => reactions.includes(r.emoji.name) && user.id == msg.author.id;
        return msg.awaitReactions(filter, { max: max || 1, time: limit }).then(collected => collected.first() && collected.first().emoji.name);
    };

    client.wait = require("util").promisify(setTimeout);

    Object.defineProperty(String.prototype, "clean", {
        value: function (caps = true) {
            let text = this
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203))
                .replace(client.config.token, "");
            if (caps) text = text.charAt(0).toUpperCase() + text.slice(1);
            return text;
        }
    });

    Object.defineProperty(Array.prototype, "random", {
        value: function () {
            return this[Math.floor(Math.random() * this.length)];
        }
    });
}