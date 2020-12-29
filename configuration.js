module.exports = class Configuration {
    constructor() {
        this.loaded = false;
        this.data = new Map();
        this.optionSchema = [
            {
                'name': 'token',
                'description': 'The secret bot token',
                'type': 'string',
                'default': ''
            },
            {
                'name': 'language',
                'description': 'The language of the framework',
                'type': 'string',
                'default': 'EN'
            },
            {
                'name': 'defaultPrefix',
                'description': 'The prefix for your bot commands',
                'type': 'string',
                'default': '!'
            },
            {
                'name': 'guildSettings',
                'description': '',
                'type': 'object',
                'default': '{}'
            },
            {
                'name': 'userSettings',
                'description': '',
                'type': 'object',
                'default': '{}'
            },
            {
                'name': 'igbots',
                'description': 'Ignore bots',
                'type': 'boolean',
                'default': true
            },
            {
                'name': 'igdm',
                'description': 'Ignore dms',
                'type': 'boolean',
                'default': true
            },
            {
                'name': 'commands',
                'description': 'Load commands',
                'type': '',
                'default': true
            },
        ]

    }

    options() {
        return this.optionSchema.reduce((options, option) => {
            options.push(option.name);
            return options;
        }, []);
    }
    getSchema(option) {
        return this.optionSchema.find(sch => sch.name == option);
    }
    getSetting(option) {
        return this.data.get(option);
    }
    setSetting(option, value) {
        return this.data.set(option, value);
    }

    load(settings) {
        this.data.clear();

        const options = this.options();

        for (let option of options) {
            let defaultVal = this.getSchema(option).default;
            if (settings[option] !== undefined) {
                this.data.set(option, settings[option]);
            } else if (defaultVal !== undefined) {
                this.data.set(option, defaultVal);
            } else throw new Error(`Can't find option ${option}!`)
        }
        return this.data;
    }
}