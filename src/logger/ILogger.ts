export interface ILogger {
    info(className: string, method: string, message: string | object): void;

    warn(className: string, method: string, message: string | object): void;

    trace(className: string, method: string, error: Error, message?: string | object): void;

    debug(className: string, method: string, error: Error, message?: string | object): void;

    error(className: string, method: string, error: Error, message?: string | object): void;

    fatal(className: string, method: string, error: Error, message?: string | object): void;
}
