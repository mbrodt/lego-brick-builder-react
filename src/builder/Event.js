export class Event {
    constructor() {
        this.listeners = {}
    }

    on(event, callback, bind) {
        const cb = bind ? callback.bind(bind) : callback
        if (this.listeners[event]) this.listeners[event].push(cb)
        else this.listeners[event] = [cb]
        return () => this.off(event, cb)
    }

    off(event, callback, bind) {
        const cb = bind ? callback.bind(bind) : callback
        if (this.listeners?.[event]?.includes(cb)) this.listeners[event].splice(this.listeners[event].indexOf(cb), 1)
    }

    emit(event, params) {
        if (this.listeners[event]) this.listeners[event].forEach((callback) => callback?.(params))
    }

    destroy() {
        Object.keys(this.listeners).forEach((event) => {
            this.listeners[event].forEach((callback) => {
                this.off(event, callback)
            })
        })
        this.listeners = {}
    }
    hasListener(event) {
        return this.listeners[event]
    }
}

export default new Event()
