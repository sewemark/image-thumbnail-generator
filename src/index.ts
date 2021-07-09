import express from 'express';
import { ApiServer } from './ApiServer';
import { initContainer } from './Bootstrap';
import { YamlConfigProvider } from './config/YamlConfigProvider';
import { ILogger } from './logger/ILogger';
import { Logger } from './logger/Logger';
import { Types } from './Types';
import { ExpressAppDecorator } from './ExpressAppDecorator';

(async () => {
    try {
        process.on('SIGINT', function onSigint() {
            console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
        });

        process.on('SIGTERM', function onSigterm() {
            console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
        });

        const startupLogger = new Logger();
        const configProvider = new YamlConfigProvider(startupLogger);
        const configName = process.argv.indexOf('--debug') >= 0 ? 'config-dev.yml' : 'config.yml';
        const config = await configProvider.import('.', configName);
        const container = initContainer(startupLogger, config);
        const logger = container.get<ILogger>(Types.Logger);
        const app = express();
        const terminusAppDecorator = new ExpressAppDecorator(logger, config);
        const server = new ApiServer(
            logger,
            config,
            app,
            [terminusAppDecorator],
            container.get(Types.ControllerFactory),
            container.get(Types.MiddlewareFactory),
        );
        server.start();
    } catch (err) {
        console.log('Error occured ' + err.stack);
    }
})();
