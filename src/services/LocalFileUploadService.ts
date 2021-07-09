import { Request, Response } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import multer from 'multer';
import {ServerConfig} from '../config/ServerConfig';
import {InvalidImageError} from '../errors/InvalidImageError';
import {ILogger} from '../logger/ILogger';
import {Types} from '../Types';
import {ALLOWED_IMAGE_TYPES, IAllowedImageType} from './AlloweImageTypes';
import {IFileUploadService} from './IFileUploadService';

export const FILE_SIZE_LIMIT = 20 * 1024 * 1024;

@injectable()
export class LocalFileUploadService implements IFileUploadService {
    private upload: multer.Multer;

    constructor(
        @inject(Types.Logger) protected logger: ILogger,
        @inject(Types.ServerConfig) protected serverConfig: ServerConfig,
    ) {
        const storage = multer.diskStorage({
            destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
                callback(null, this.serverConfig.storageConfig.storagePath);
            },
            filename: async (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
                callback(null, file.originalname);
            },
        });
        const fileFilter = (req: Request, file: any, callback: any): void => {
            if (ALLOWED_IMAGE_TYPES.find((allowedType: IAllowedImageType) => allowedType.mimeType === file.mimetype)) {
                callback(null, true);
            } else {
                callback(new InvalidImageError(`Got MIMETYPE: ${file?.mimetype} `), false);
            }
        };
        const limits = {
            fileSize: FILE_SIZE_LIMIT,
        };
        this.upload = multer({ storage, fileFilter, limits  });
    }

    public single(filename: string): (req: Request, res: Response, callback: any) => any {
        return this.upload.single(filename);
    }
}
