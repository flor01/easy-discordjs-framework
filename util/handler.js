module.exports = exports = class Handler {
    constructor() {
        this.handlers = new Map();
    }

    add(name, handler) {
        if (typeof handler == "function") {
            handler = { "callback": handler, "context": undefined };
        }
        this.handlers.set(name, handler);
    }

    handle(name, data) {
        const handler = this.handlers.get(name);
        if (!handler) return false;
        handler.callback(data, data.context)
        return true;
    }

    handleAll(data) {
        this.handlers.forEach(handler => {
            if (handler.class) {
                new handler.callback(data, handler.context);
            } else handler.callback(data, handler.context);
        })
    }
}