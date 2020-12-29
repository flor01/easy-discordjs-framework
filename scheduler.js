const moment = require('moment');
const timeAdjustment = {
    'deciminute': { 'seconds': 10 },
    'minute': { 'minutes': 1 },
    'hourly': { 'hours': 1 },
    'daily': { 'days': 1 },
    'weekly': { 'days': 7 },
    'biweekly': { 'days': 14 }
};
const scheduler = require("node-schedule")
module.exports = class Scheduler {

    constructor(context) {
        this.context = context;
        this.tasks = {};
    }

    getNext(task) {
        let { frequency, begin_at, start_of } = this.tasks[task];
        let nextDate = moment(begin_at).add(timeAdjustment[frequency]);
        if (start_of) nextDate.startOf(start_of);
        return nextDate.format('YYYY-MM-DD HH:mm:ss');
    }

    setContext(context) {
        this.context = context;
        return this;
    }

    unschedule(task) {
        if (!this.tasks[task]) return;
        this.tasks[task].instance.cancel();
        delete this.tasks[task];
        return this;
    }


    schedule(options) {
        if (options === undefined
            || options.frequency === undefined
            || timeAdjustment[options.frequency] === undefined
            || options.name === undefined
            || options.callback === undefined
        ) throw new TypeError('Missing options!');

        options.once = options.once || false;
        options.context = options.context || this.context;

        this.tasks[options.name] = options;

        this.enqueue(options.name);
        if (options.immediate) options.callback(options.context);

        return this;
    }

    enqueue(task) {
        let options = this.tasks[task];

        let nextDate = this.getNext(task);

        options.instance = scheduler.scheduleJob(options.name, nextDate, () => {
            if (!options.once) {
                this.enqueue(options.name);
            }
            options.callback(options.context)
        });

        return this;
    }

}