export declare class Emitter<BaseEvents extends {
    [event: string]: (...args: any[]) => any;
}, DerivedEvents extends {
    [event: string]: (...args: any[]) => any;
} = {}> {
    private _evinfo;
    constructor();
    on<Ev extends keyof BaseEvents | keyof DerivedEvents, Data extends EvData<BaseEvents, DerivedEvents, Ev>>(ev: Ev, listener: (...data: Data) => any, options?: {
        filter?: DataFilter<BaseEvents, DerivedEvents, Ev, Data>;
        protect?: boolean;
    }): this;
    prependOn<Ev extends keyof BaseEvents | keyof DerivedEvents, Data extends EvData<BaseEvents, DerivedEvents, Ev> = EvData<BaseEvents, DerivedEvents, Ev>>(ev: Ev, listener: (...args: Data) => any, options?: {
        filter?: DataFilter<BaseEvents, DerivedEvents, Ev, Data>;
        protect?: boolean;
    }): this;
    once<Ev extends keyof BaseEvents | keyof DerivedEvents, Data extends EvData<BaseEvents, DerivedEvents, Ev> = EvData<BaseEvents, DerivedEvents, Ev>>(ev: Ev, listener: (...args: Data) => any, options?: {
        filter?: DataFilter<BaseEvents, DerivedEvents, Ev, Data>;
        protect?: boolean;
    }): this;
    once<Ev extends keyof BaseEvents | keyof DerivedEvents, Data extends EvData<BaseEvents, DerivedEvents, Ev> = EvData<BaseEvents, DerivedEvents, Ev>>(ev: Ev, options?: {
        filter?: DataFilter<BaseEvents, DerivedEvents, Ev, Data>;
    }): Promise<Data>;
    prependOnce<Ev extends keyof BaseEvents | keyof DerivedEvents, Data extends EvData<BaseEvents, DerivedEvents, Ev> = EvData<BaseEvents, DerivedEvents, Ev>>(ev: Ev, listener: (...args: Data) => any, options?: {
        filter?: DataFilter<BaseEvents, DerivedEvents, Ev, Data>;
        protect?: boolean;
    }): this;
    prependOnce<Ev extends keyof BaseEvents | keyof DerivedEvents, Data extends EvData<BaseEvents, DerivedEvents, Ev> = EvData<BaseEvents, DerivedEvents, Ev>>(ev: Ev, options?: {
        filter?: DataFilter<BaseEvents, DerivedEvents, Ev, Data>;
    }): Promise<Data>;
    off<Ev extends keyof BaseEvents | keyof DerivedEvents, Data extends EvData<BaseEvents, DerivedEvents, Ev> = EvData<BaseEvents, DerivedEvents, Ev>>(ev: Ev, listener: (...args: Data) => any): this;
    off<Ev extends keyof BaseEvents | keyof DerivedEvents>(ev: Ev): this;
    off(): this;
    emit<Ev extends keyof BaseEvents | keyof DerivedEvents>(ev: Ev, ...data: EvData<BaseEvents, DerivedEvents, Ev>): this;
}
export declare module Emitter {
    type Events = {
        [event: string]: (...args: any[]) => any;
    };
    module Events {
        type Except<Ev extends string> = Events & {
            [key in Ev]?: never;
        };
    }
    type DerivedEvents<Exclude extends string> = {
        [event: string]: (...args: any[]) => any;
    } & {
        [event in keyof Exclude]: never;
    };
}
declare type EvListener<BaseEvents extends {
    [event: string]: (...args: any[]) => any;
}, DerivedEvents extends {
    [event: string]: (...args: any[]) => any;
}, Ev extends keyof BaseEvents | keyof DerivedEvents> = Ev extends keyof BaseEvents ? BaseEvents[Ev] : Ev extends keyof DerivedEvents ? DerivedEvents[Ev] : never;
declare type EvData<BaseEvents extends {
    [event: string]: (...args: any[]) => any;
}, DerivedEvents extends {
    [event: string]: (...args: any[]) => any;
}, Ev extends keyof BaseEvents | keyof DerivedEvents> = Parameters<EvListener<BaseEvents, DerivedEvents, Ev>>;
declare type DataFilter<BaseEvents extends {
    [event: string]: (...args: any[]) => any;
}, DerivedEvents extends {
    [event: string]: (...args: any[]) => any;
}, Ev extends keyof BaseEvents | keyof DerivedEvents, Data extends EvData<BaseEvents, DerivedEvents, Ev>> = (args: EvData<BaseEvents, DerivedEvents, Ev>) => args is Data;
export {};
