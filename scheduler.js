const moment = require('moment');
const scheduler = require("node-schedule")

const timeAdjustment = {
    'deciminute': { 'seconds': 10 },
    'minute': { 'minutes': 1 },
    'hourly': { 'hours': 1 },
    'daily': { 'days': 1 },
    'weekly': { 'days': 7 },
    'biweekly': { 'days': 14 }
};
let tasks = {};

module.exports = {

    getNext: function (task) {
        let { frequency, begin_at, start_of } = tasks[task];
        let nextDate = moment(begin_at).add(timeAdjustment[frequency]);
        if (start_of) nextDate.startOf(start_of);
        return nextDate.format('YYYY-MM-DD HH:mm:ss');
    },

    unschedule: function (task) {
        if (!tasks[task]) return;
        tasks[task].instance.cancel();
        delete tasks[task];
    },


    schedule: function (options, context) {
        if (options === undefined
            || options.frequency === undefined
            || timeAdjustment[options.frequency] === undefined
            || options.name === undefined
            || options.callback === undefined
        ) throw new TypeError('Missing options!');

        options.once = options.once || false;
        options.context = options.context || context;

        tasks[options.name] = options;

        this.enqueue(options.name);
        if (options.immediate) options.callback(options.context);
    },

    enqueue: function (task) {
        let options = tasks[task];

        let nextDate = this.getNext(task);

        options.instance = scheduler.scheduleJob(options.name, nextDate, () => {
            if (!options.once) this.enqueue(options.name);
            options.callback(options.context)
        });

        return this;
    }
}