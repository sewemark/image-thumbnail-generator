import { Container } from 'inversify';
import {ServerConfig} from './config/ServerConfig';
import {FileController} from './http/controller/FileController';
import {PageController} from './http/controller/PageController';
import {FileUploadMiddleware} from './http/middleware/FileUploadMiddleware';
import {IMiddleware} from './http/middleware/IMiddleware';
import {ResponseFactory} from './http/response/ResponseFactory';
import { ILogger } from './logger/ILogger';
import { Logger } from './logger/Logger';
import {FileHandler} from './services/FileHandler';
import {IFileUploadService} from './services/IFileUploadService';
import {LinksFactory} from './services/LinksFactory';
import {LocalFileUploadService} from './services/LocalFileUploadService';
import {LocalReadableFileStorage} from './services/LocalReadableFileStorage';
import {PageHandler} from './services/PageHandler';
import {SharpThumbnailGenerator} from './services/SharpThumbnailGenerator';
import {ControllerAdapters, Controllers, ControllerType, Middlewares, MiddlewareType, Types} from './Types';

export function initContainer(logger: ILogger, config: ServerConfig): Container {
    const container = new Container();
    container.bind(Types.ServerConfig).toConstantValue(config);
    registerDependencies(container);
    registerMiddlewares(logger, container);
    registerControllers(logger, container);
    return container;
}

function registerDependencies(container: Container): void {
    container.bind<ILogger>(Types.Logger).to(Logger);
    container.bind<IFileUploadService>(Types.File.FileUploadService).to(LocalFileUploadService);
    container.bind(Types.File.FileStorage).to(LocalReadableFileStorage);
    container.bind(Types.File.ThumbnailGenerator).to(SharpThumbnailGenerator);
    container.bind(Types.File.ReadableFileStorage).to(LocalReadableFileStorage);
    container.bind(Types.LinksFactory).to(LinksFactory);
    container.bind(Types.ResponseFactory).to(ResponseFactory);
    container.bind(ControllerAdapters.PageControllerAdapter).to(PageHandler);
    container.bind(ControllerAdapters.FileControllerAdapter).to(FileHandler);
}

function registerControllers(logger: ILogger, container: Container): void {
    container.bind(Controllers.FileController).to(FileController);
    container.bind(Controllers.PageController).to(PageController);
    container.bind(Types.ControllerFactory).toFactory((ctx): any =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (controllerType: ControllerType, method: string): any => {
            if (ctx.container.isBound(controllerType)) {
                const controller = ctx.container.get(controllerType);
                // @ts-ignore
                if (controller && controller[method] && typeof controller[method] === 'function') {
                    // @ts-ignore
                    return controller[method].bind(controller);
                }
                throw new Error(`Invalid controller method ${method}`);
            }
            return (): void => {
                logger.error(
                    'Controller',
                    'handle',
                    new Error('Invalid controller type'), `Controller ${controllerType.toString()} not found.`,
                );
            };
        });
}
function registerMiddlewares(logger: ILogger, container: Container): void {
    container.bind(Types.MiddlewareFactory).toFactory((ctx): any =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (middlewareType: MiddlewareType): any => {
            if (ctx.container.isBound(middlewareType)) {
                const middleware = ctx.container.get<IMiddleware>(middlewareType);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return middleware.handle.bind(middleware);
            }
            return (): void => {
                logger.error(
                    'Middleware',
                    'handle',
                    new Error('Invalid middleware type'), `Middleware ${middlewareType.toString()} not found.`,
                    );
            };
        });
    container.bind(Middlewares.FileUploadMiddleware).to(FileUploadMiddleware);
}
