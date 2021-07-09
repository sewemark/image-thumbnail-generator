import { json, urlencoded } from 'body-parser';
import { Express, NextFunction, Request, Response, Router } from 'express';
import { ServerConfig } from './config/ServerConfig';
import { IExpressAppDecorator } from './IExpressAppDecorator';
import { ILogger } from './logger/ILogger';
import { IRouter } from 'express-serve-static-core';
import { Controllers, Middlewares } from './Types';

const {createTerminus} = require('@godaddy/terminus');

const cors = require('cors');

export class ApiServer {
    private logger: ILogger;
    private app: Express;
    private serverConfig: ServerConfig;
    private appDecorators: IExpressAppDecorator[];
    private middlewareFactory: any;
    private controllerFactory: any;

    constructor(
        logger: ILogger,
        serverConfig: ServerConfig,
        app: Express,
        appDecorators: IExpressAppDecorator[],
        controllerFactory: any,
        middlewareFactory: any,
    ) {
        this.logger = logger;
        this.serverConfig = serverConfig;
        this.app = app;
        this.appDecorators = appDecorators;
        this.middlewareFactory = middlewareFactory;
        this.controllerFactory = controllerFactory;
    }

    public start() {
        this.registerMiddlewares();
        this.registerRoutes();
        this.registerDecorators();
    }

    private registerMiddlewares(): void {
        this.app.use(json());
        this.app.use(urlencoded({extended: false}));
        this.app.use(cors());
        this.app.set('view engine', 'pug');
    }

    private registerRoutes(): void {
        this.logger.info('ApiServer', 'registerRoutes', 'Registering routes...');
        this.app.get('/healthcheck', (req: Request, res: Response, next: NextFunction) => {
            res.status(200).send('Ok2');
        });
        this.app.get('/readiness', (req: Request, res: Response, next: NextFunction) => {
            res.status(200).send('Ok');
        });
        this.app.get('/liveness', (req: Request, res: Response, next: NextFunction) => {
            res.status(200).send('Ok');
        });
        this.app.use((err: any, req: Request, res: Response, next: any) =>
            res.status(422).send({error: err.message}));
        this.registerApiRoutes(this.app);
        this.registerFrontendRoutes(this.app);
    }

    private registerDecorators() {
        this.appDecorators.forEach((appDecorator: IExpressAppDecorator) => {
            appDecorator.decorate(this.app);
        });
    }

    private registerApiRoutes(router: IRouter) {
        const fileRoutes = this.getFileRoutes(Router());
        router.use('/api', fileRoutes);
    }

    private registerFrontendRoutes(router: IRouter) {
        router.get('/', this.controllerFactory(Controllers.PageController, 'index'));
        router.get('/index', this.controllerFactory(Controllers.PageController, 'index'));
    }

    private getFileRoutes(router: IRouter): IRouter {
        router.get('/v1/file/:name',
            this.controllerFactory(Controllers.FileController, 'get'),
        );
        router.post('/v1/file',
            this.middlewareFactory(Middlewares.FileUploadMiddleware),
            this.controllerFactory(Controllers.FileController, 'post'),
        );
        return router;
    }
}
