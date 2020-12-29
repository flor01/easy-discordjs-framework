const { Client } = require("discord.js");
const { resolve } = require("path");
var merge = require('lodash.merge');

module.exports = exports = class Framework {
	constructor(settings) {
		this.client = new Client();
		this.client.configuration = new (require("./configuration"))();
		this.client.handler = new (require("./util/handler"));
		if (typeof settings == "string") settings = { token: settings }
		this.configure(settings);

		this.client.load = new (require("./util/load"))(this.client);

		this.client.scheduler = new (require("./scheduler"))(this);

		if (this.client.configuration.getSetting('commands')) {
			this.client.handler.add('command', {
				'callback': this.client.util.msghandler,
				'context': this.client,
				"class": true
			});
		}
	}
	configure(settings) {
		this.client.configuration.load(settings);

		this.client.on("ready", () => {
			if (this.client.status) this.client.user.setActivity(this.client.status, { type: this.client.statusType });

			console.log(this.client.chalk.black.bgGreen(this.client.l.ready.replace("%CLIENT%", this.client.user.username).replace("%COMMANDS%", this.client.commands.size).replace("%EVENTS%", this.client.events.size).replace("%DEFAULT%", this.client.defaultCommands.size)));
		})
		this.client.on("message", message => {
			this.client.handler.handleAll(message);
		})
		return this;
	}
	async connect() {
		this.client.login(this.client.configuration.getSetting("token"));
		return this;
	}

	disconnect() {
		return this.client.destroy();
	}

	observe(event, callback) {
		this.client.on(event, callback);
		return this;
	}

	getClient() {
		return this.client;
	}

	getGuilds() {
		return this.client.guilds.cache;
	}

	schedule(options) {
		this.client.scheduler.schedule(options);
		return this;
	}

	unschedule(task_name) {
		this.client.scheduler.unschedule(task_name);
		return this;
	}

	addHandler(name, callback) {
		this.client.handler.add(name, callback);
		return this;
	}

	bind(command, options) {
		if (typeof command == "object") {
			if (!command.name || !command.run) throw new Error("You didn't provide a command name/run function!");
			this.client.commands.set(command.name, command);
			return;
		}
		if (typeof options !== "object") throw new Error("You didn't provide any command options!");
		this.client.commands.set(command, options);
		return this;
	}

	registerModules(options = {}) {
		let defaultModules = {
			moderation: { kick: true }, music: {}
		};
		const modules = merge(defaultModules, options);

		for (let module in modules) {
			for (let command in modules[module]) {
				const cmd = modules[module][command]
				if (cmd === true) {
					this.client.load.moduleloader(resolve(__dirname, `./commands/${module}/${command}.js`));
				}
			}
		}
		return this;
	}
} 