module.exports = class Queue {

    constructor() { }

    stop(instance) {
        clearTimeout(instance);
        return true;
    }

    add(callback, timeout) {
        return setTimeout(callback, timeout);
    }

    repeat(callback, timeout) {
        return setInterval(callback, timeout);
    }

    getQueueDelay(end_date, start_date) {
        let future_date;
        try {
            future_date = new Date(end_date);
        } catch (e) {
            throw TypeError('Not a valid date!');
        }

        let present_date = start_date ? new Date(start_date) : new Date();
        let delta = (future_date.getTime() - present_date.getTime());

        return delta > 0 ? delta : 0;
    }

    addForTime(callback, time_in_future) {
        let delay = this.getQueueDelay(time_in_future);
        return this.add(callback, delay);
    }

    repeatFromTime(callback, time_in_future) {
        let delay = this.getQueueDelay(time_in_future);
        return this.repeat(callback, delay);
    }
}