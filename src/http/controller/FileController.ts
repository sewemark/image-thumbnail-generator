import { Request, Response } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ILogger } from '../../logger/ILogger';
import { Pages } from '../../pages/Pages';
import { ControllerAdapters, Types } from '../../Types';
import { IFileControllerAdapter } from '../adapters/FileControllerAdapter';
import { FileUploadRequest } from '../request/FileUploadRequest';
import { IResponseFactory } from '../response/IResponseFactory';

@injectable()
export class FileController {
    constructor(
        @inject(Types.Logger) protected logger: ILogger,
        @inject(ControllerAdapters.FileControllerAdapter) protected fileHandler: IFileControllerAdapter,
        @inject(Types.ResponseFactory) protected responseFactory: IResponseFactory,
    ) {
    }

    public async post(req: FileUploadRequest, res: Response): Promise<void> {
        try {
            this.logger.info('FileController', 'post', `Uploading  file ${req.fileMetadata.originalName}`);
            await this.fileHandler.generateThumbnails(req.fileMetadata.originalName);
            this.responseFactory.redirectToPage(res, Pages.Index);
        } catch (err) {
            this.logger.error('FileController', 'post', err, 'Cannot upload file');
            this.responseFactory.renderPage(res, Pages.ServerError, {errorMessage: err.message});
        }
    }

    public async get(req: Request, res: Response): Promise<void> {
        try {
            this.logger.info('FileController', 'get', `Getting file ${req.params.name}`);
            const stream = await this.fileHandler.getFileStream(req.params.name);
            this.responseFactory.sendStreamResponse(res, stream);
        } catch (err) {
            this.logger.error('FileController', 'get', err, `Cannot get file ${req.params.name}`);
            this.responseFactory.renderPage(res, Pages.ServerError, {errorMessage: err.message});
        }
    }
}
