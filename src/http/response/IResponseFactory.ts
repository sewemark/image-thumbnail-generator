import { Response } from 'express-serve-static-core';
import {Pages} from '../../pages/Pages';
import {IFileStream} from '../../services/IFileStream';

export interface IResponseFactory {
    sendErrorResponse(res: Response, error: Error): void;
    sendStreamResponse(res: Response, fileStream: IFileStream): void;
    redirectToPage(res: Response, page: Pages): void;
    renderPage(res: Response, page: Pages, options?: object): void;
}
