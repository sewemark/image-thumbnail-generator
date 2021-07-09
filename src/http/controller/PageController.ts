import { Response } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ILogger } from '../../logger/ILogger';
import { Pages } from '../../pages/Pages';
import { ControllerAdapters, Types } from '../../Types';
import { IPageControllerAdapter } from '../adapters/PageControllerAdapter';
import { FileUploadRequest } from '../request/FileUploadRequest';
import { IResponseFactory } from '../response/IResponseFactory';

@injectable()
export class PageController {
    constructor(
        @inject(Types.Logger) protected logger: ILogger,
        @inject(ControllerAdapters.PageControllerAdapter) protected pageControllerAdapter: IPageControllerAdapter,
        @inject(Types.ResponseFactory) protected responseFactory: IResponseFactory,
    ) {
    }

    public async index(req: FileUploadRequest, res: Response): Promise<void> {
        try {
            const {fileLinks} = await this.pageControllerAdapter.getIndexData();
            this.responseFactory.renderPage(res, Pages.Index, {fileLinks});
        } catch (err) {
            this.logger.error('PageController', 'get', err, 'Cannot get index page');
            this.responseFactory.renderPage(res, Pages.ServerError, {errorMessage: err.message});
        }
    }
}
