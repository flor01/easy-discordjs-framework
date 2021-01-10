module.exports = {
    name: 'ban',
    category: '',
    aliases: [''],
    description: '',
    args: 0,
    usage: "",
    run: async (client, message, args) => {

        const col = await client.awaitReply(message, "Hoe gaat het?");
        console.log("collected:", col)

    }
}