"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
class Emitter {
    constructor() {
        this._evinfo = {};
        for (const [prop, descr] of Object.entries(Object.getOwnPropertyDescriptors(this)))
            if (prop[0] === "_")
                Object.defineProperty(this, prop, Object.assign(Object.assign({}, descr), { enumerable: false }));
    }
    on(ev, listener, options) {
        const info = this._evinfo[ev];
        const opts = Object.assign({ once: false }, options);
        if (info)
            info.push([listener, opts]);
        else
            this._evinfo[ev] = [[listener, opts]];
        return this;
    }
    prependOn(ev, listener, options) {
        const info = this._evinfo[ev];
        const opts = Object.assign({ once: false }, options);
        if (info)
            info.unshift([listener, opts]);
        else
            this._evinfo[ev] = [[listener, opts]];
        return this;
    }
    once(ev, listenerOrOptions, options) {
        if (typeof listenerOrOptions === "function") {
            const info = this._evinfo[ev];
            const opts = Object.assign({ once: true }, options);
            if (info)
                info.push([listenerOrOptions, opts]);
            else
                this._evinfo[ev] = [[listenerOrOptions, opts]];
            return this;
        }
        else {
            return new Promise((resolve) => {
                const info = this._evinfo[ev];
                const opts = Object.assign(Object.assign({ once: true }, listenerOrOptions), { protect: true });
                const shim = (...data) => resolve(data);
                if (info)
                    info.push([shim, opts]);
                else
                    this._evinfo[ev] = [[shim, opts]];
            });
        }
    }
    prependOnce(ev, listenerOrOptions, options) {
        if (typeof listenerOrOptions === "function") {
            const info = this._evinfo[ev];
            const opts = Object.assign({ once: true }, options);
            if (info)
                info.unshift([listenerOrOptions, opts]);
            else
                this._evinfo[ev] = [[listenerOrOptions, opts]];
            return this;
        }
        else {
            return new Promise((resolve) => {
                const info = this._evinfo[ev];
                const opts = Object.assign(Object.assign({ once: true }, listenerOrOptions), { protect: true });
                const shim = (...data) => resolve(data);
                if (info)
                    info.unshift([shim, opts]);
                else
                    this._evinfo[ev] = [[shim, opts]];
            });
        }
    }
    off(ev, listener) {
        if (ev !== undefined && listener !== undefined) {
            const cbs = this._evinfo[ev];
            if (cbs) {
                cbs.splice(cbs.findIndex(([l]) => l === listener), 1);
                if (cbs.length === 0)
                    delete this._evinfo[ev];
            }
        }
        else if (ev !== undefined) {
            const cbs = this._evinfo[ev];
            if (cbs) {
                const todel = [];
                for (const [cb, { protect }] of cbs)
                    if (!protect)
                        todel.push(cb);
                for (const cb of todel)
                    cbs.splice(cbs.findIndex(([l]) => l === cb), 1);
                if (cbs.length === 0)
                    delete this._evinfo[ev];
            }
        }
        else {
            Object.keys(this._evinfo).forEach((ev) => this.off(ev));
        }
        return this;
    }
    emit(ev, ...data) {
        if (this._evinfo[ev])
            for (const [cb, { once, filter }] of [...this._evinfo[ev]])
                if (filter ? filter(data) : true) {
                    cb(...data);
                    if (once)
                        this.off(ev, cb);
                }
        return this;
    }
}
exports.Emitter = Emitter;
