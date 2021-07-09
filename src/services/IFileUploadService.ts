import {Request, Response} from 'express-serve-static-core';

export interface IFileUploadService {
    single(filename: string): (req: Request, res: Response, callback: any) => any;
}
