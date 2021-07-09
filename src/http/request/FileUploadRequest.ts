import { Request } from 'express';
import { IFileMetadata } from './IFileMetadata';

// tslint:disable-next-line:interface-name
export interface FileUploadRequest extends Request {
    fileMetadata: IFileMetadata;
}
