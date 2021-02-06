let handlers = new Map();

module.exports = {
    add: function (name, handler) {
        if (typeof handler == "function") {
            handler = { "callback": handler, "context": undefined };
        }
        handlers.set(name, handler);
    },

    handle: function (name, data) {
        const handler = handlers.get(name);
        if (!handler) return false;
        handler.callback(data, data.context)
        return true;
    },

    handleAll: function (data) {
        handlers.forEach(handler => {
            handler.callback(data, handler.context);
        })
    },

}