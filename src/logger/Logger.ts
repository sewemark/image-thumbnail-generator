import { injectable } from 'inversify';
import 'reflect-metadata';
import { ILogger } from './ILogger';

// tslint:disable-next-line:no-var-requires
const pinoLogger = require('pino')({
    prettyPrint: { colorize: true },
});

@injectable()
export class Logger implements ILogger {

    public info(className: string, method: string, message: string | object) {
        pinoLogger.info(`[${className}@${method}] ${JSON.stringify(message)}`);
    }

    public warn(className: string, method: string, message: string | object) {
        pinoLogger.warn(`[${className}@${method}] ${JSON.stringify(message)}`);
    }

    public error(className: string, method: string, error: any, message?: string | object) {
        pinoLogger.error(`[${className}@${method}] ${JSON.stringify(error)} ${JSON.stringify(message)}`);
    }

    public trace(className: string, method: string, error: Error, message?: string | object): void {
        pinoLogger.trace(`[${className}@${method}] ${JSON.stringify(error)} ${JSON.stringify(message)}`);
    }

    public debug(className: string, method: string, error: Error, message?: string | object): void {
        pinoLogger.debug(`[${className}@${method}] ${JSON.stringify(error)} ${JSON.stringify(message)}`);
    }

    public fatal(className: string, method: string, error: Error, message?: string | object): void {
        pinoLogger.fatal(`[${className}@${method}] ${JSON.stringify(error)} ${JSON.stringify(message)}`);
    }
}
