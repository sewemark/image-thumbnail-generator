import { Response } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import multer from 'multer';
import * as path from 'path';
import { FileNotFoundError } from '../../errors/FileNotFoundError';
import { InvalidImageError } from '../../errors/InvalidImageError';
import { NoFileUploadedError } from '../../errors/NoFileUploadedError';
import { ILogger } from '../../logger/ILogger';
import { Pages } from '../../pages/Pages';
import { ALLOWED_IMAGE_TYPES, IAllowedImageType } from '../../services/AlloweImageTypes';
import { IFileStream } from '../../services/IFileStream';
import { Types } from '../../Types';
import { IResponseFactory } from './IResponseFactory';

@injectable()
export class ResponseFactory implements IResponseFactory {
    constructor(
        @inject(Types.Logger) protected logger: ILogger,
    ) {
    }

    public sendErrorResponse(res: Response, error: Error): void {
        switch (error.constructor) {
            case multer.MulterError:
            case InvalidImageError:
                res.render(Pages.ServerError, {errorMessage: 'Invalid image provided'});
                break;
            case FileNotFoundError:
                res.status(404).send('File not found');
                break;
            case NoFileUploadedError:
                res.status(400).send('No file uploaded');
                break;
            default:
                res.status(500).send('Internal server error');
                break;
        }
    }

    public sendStreamResponse(res: Response, fileStream: IFileStream): void {
        const {stream} = fileStream;
        const parsedFileName = path.parse(fileStream.fileName);
        const headers = {
            'Content-Type': ALLOWED_IMAGE_TYPES.find((imageType: IAllowedImageType) => imageType.extension === parsedFileName.ext)?.mimeType ?? '',
            'Content-Encoding': 'chunked',
            'Content-Disposition': `attachment;filename=${encodeURI(fileStream.fileName)}`,
        };

        res.writeHead(200, headers);
        stream.on('end', () => {
            res.end();
            stream.destroy();
        });
        stream.pipe(res);
    }

    public redirectToPage(res: Response, page: Pages): void {
        res.redirect('/index');
    }

    public renderPage(res: Response, page: Pages, options: object): void {
        res.render(page, options);
    }
}
