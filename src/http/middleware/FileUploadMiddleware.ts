import { NextFunction } from 'express';
import { Response } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { ServerConfig } from '../../config/ServerConfig';
import { ILogger } from '../../logger/ILogger';
import { Pages } from '../../pages/Pages';
import { IFileUploadService } from '../../services/IFileUploadService';
import { Types } from '../../Types';
import { FileUploadRequest } from '../request/FileUploadRequest';
import { IResponseFactory } from '../response/IResponseFactory';
import { IMiddleware } from './IMiddleware';

@injectable()
export class FileUploadMiddleware implements IMiddleware {
    constructor(
        @inject(Types.Logger) protected logger: ILogger,
        @inject(Types.ServerConfig) protected serverConfig: ServerConfig,
        @inject(Types.File.FileUploadService) protected uploadService: IFileUploadService,
        @inject(Types.ResponseFactory) protected responseFactory: IResponseFactory,
    ) {
    }

    public async handle(req: FileUploadRequest, res: Response, next: NextFunction): Promise<void> {
        this.logger.info('FileUploadMiddleware', 'handle', 'Request with file');
        try {
            this.uploadService.single('file')(req, res, (err: Error) => {
                if (err) {
                    this.logger.error('FileUploadMiddleware', 'handle', err, `Cannot upload file - ${err?.message}`);
                    this.responseFactory.sendErrorResponse(res, err);
                } else {
                    const file = req.file;
                    if (!file) {
                        this.responseFactory.renderPage(res, Pages.ServerError, { errorMessage: 'No file uploaded'});
                        return;
                    }
                    this.logger.info('FileUploadMiddleware', 'handle', `File has been uploaded ${file.originalname} `);
                    req.fileMetadata = {
                        name: file.filename,
                        originalName: file.originalname,
                        mimeType: file.mimetype,
                        size: file.size,
                    };
                    next();
                }
            });
        } catch (err) {
            this.logger.error('FileUploadMiddleware', 'handle', err, 'File upload error');
            this.responseFactory.sendErrorResponse(res, err);
        }
    }
}
