# Framework

This module makes making bot way easier! The module loads the commands and events without a command handler needed!
The bot also activates the commands when executed.

## Installing the bot
1. Install module: `npm install easy-discordjs-framework`
2. Make index.js with code: 
```javascript
const module = require("easy-discordjs-framework");

const client = new module({
    token: "TOKEN", // Bot token
    language: "NL", // NL/EN
    prefix: "!", // prefix => !help, !rank, ..
});
client.connect();
```
3. Make commands folder with command file

* Command template:
```javascript
module.exports = {
    name: 'example',
    category: '',
    aliases: ['ex'],
    description: 'This is an example command',
    run: async (bot, message, args) => {
        message.reply("hey")
    }
}
```
* Other way to add commands:
```js
client.bind("example", {
    run: async (bot, message, args) => {
        message.reply("hey")
    },
})
```

4. Make an events folder with an event

* Event layout:
```javascript
module.exports.name = 'ready';
module.exports.run = async (client) => {
    console.log("I am online!");
}
```
* Other way to add events:
```js
client.observe("ready", () => {
    console.log("I am ready!");
})
```
## Options
```javascript
new module({
    token: "TOKEN",                     // REQUIRED. Bot token
    language: "EN",                     // Language: NL/EN
    defaultPrefix: "!",                        // prefix: !help, !rank, ..
    config: {
        guildSettings: { prefix: "!" }, // Standard settings when bot joins a new guild
        userSettings: {},               // Standard settings when a new user uses the bot
    },
    igbots: true,                       // Ignore messages from bots
    status: "everyone",                 // Bot stauts
    statusType: "PLAYING"               // Bot status type
})
```
<!-- 
| Option        | Type    | Default| Note   |
| :-----------: |:-------:| :--------:| :-----:|
| token         | string  | (none)    | The secret bot token |
| language      | string  | "EN"      | Languages: EN/NL |
| defaultPrefix | string  | "!"       | The prefix used for commands: !help |
| igbots        | boolean | true      | Can bots execute commands? |
| status        | string  | (none)    | The status message for the bot|
| statusType    | string  |"WATCHING" | The status type for the bot: "WATCHING, PLAYING, LISTENING"|
 -->

## Using custom functions
### Command test.js (in commands folder)


Send embed with standard footer, embed color and timestamp
```javascript
message.sendEmbed({title: "Hello", desc: "Hey!"});
```

Sends the same embed as before, but you can edit this one!
```javascript
let embed = message.embed()
    .setTitle("Hello")
    .setDescription("Hey!")
message.channel.send(embed);
```

Send an automatic error message
```javascript
if(!args[0]) return message.error("You didn't give args!");
```
Send an automatic succes message
```javascript
if(args[0]) message.succes("You did give args, good job!");
```

Find a member
```javascript
        let member = message.getMember(args[0]);
        if(!member) return message.error("Can't find this member!");
```
Find a channel
```javascript
        let channel = message.getChannel(args[0]);
        if(!channel) return message.error("Can't find this channel!");
```
Find a role
```javascript
        let role = message.getRole(args[0]);
        if(!role) return message.error("Can't find this role!");
```
Check if a user is staff
```javascript
        if(!message.member.isStaff()) return message.error("You aren't staff!"); // Same with isMod and isAdmin
```
## Using the database
The bot loads a database automatically. There are 2 different kinds:

### User database
```javascript
if(!message.author.settings.xp) message.author.settings.xp = 0;
message.author.settings.xp + 5;
message.author.updateDB(); // Update the user settings
message.succes(`You have gained 5 XP! You now have ${message.author.settings.xp} xp!`)
```

### Guild database
```javascript
let prefix = message.guild.settings.prefix
message.guild.settings.prefix = "?";
message.guild.updateDB(); // Update the guild settings
```

### The db itself
```javascript
let data = client.db.get("test"); // Get the data of value "test"
client.db.set("test", "hello"); // Set the value "test" to "hello"
client.db.delete("test"); // Delete the data of value "test"
```