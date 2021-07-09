import { IExpressAppDecorator } from './IExpressAppDecorator';
import { Express } from 'express';
import * as http from 'http';
import { ServerConfig } from './config/ServerConfig';
import { ILogger } from './logger/ILogger';

const {createTerminus} = require('@godaddy/terminus')

export class ExpressAppDecorator implements IExpressAppDecorator {
    private logger: ILogger;
    private serverConfig: ServerConfig;

    constructor(
        logger: ILogger,
        serverConfig: ServerConfig,
    ) {
        this.logger = logger;
        this.serverConfig = serverConfig;
    }

    public decorate(app: Express): void {
        const server = http.createServer(app)
        server.listen(process.env.PORT || this.serverConfig.port || 8081, () => {
            this.logger.info('ApiServer', 'startApp', `Server listening on  ${this.serverConfig.port}`);
        });
        createTerminus(server, {
            signal: 'SIGINT',
            healthChecks: {'/healthcheck': this.onHealthCheck.bind(this)},
            onSignal: this.onSignal.bind(this),
        });
    }

    private onSignal() {
        this.logger.info('ExpressAppDecorator', 'onSignal', 'Server is starting cleanup');
    }

    private async onHealthCheck() {
        this.logger.info('ExpressAppDecorator', 'onHealthCheck', 'Healthcheck called');
        return Promise.resolve();
    }
}
