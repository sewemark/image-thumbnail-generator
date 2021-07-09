import { Request } from 'express';

export interface IFileMetadata {
    name: string;
    mimeType: string;
    size: number;
    originalName: string;
}

export interface FileUploadRequest extends Request {
    fileMetadata: IFileMetadata;
}
