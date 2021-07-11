import { inject, injectable } from 'inversify';
import * as path from 'path';
import { FileNotFoundError } from '../errors/FileNotFoundError';
import { IFileControllerAdapter } from '../http/adapters/FileControllerAdapter';
import { ILogger } from '../logger/ILogger';
import { Types } from '../Types';
import { ALLOWED_IMAGE_TYPES, IAllowedImageType } from './AlloweImageTypes';
import { IFileStream } from './IFileStream';
import { IFileStorage } from './IReadableFileStorage';
import { IThumbnailGenerator } from './IThumbnailGenerator';

@injectable()
export class FileHandler implements IFileControllerAdapter {
    constructor(
        @inject(Types.Logger) protected logger: ILogger,
        @inject(Types.File.ReadableFileStorage) protected fileStorage: IFileStorage,
        @inject(Types.File.ThumbnailGenerator) protected thumbnailGenerator: IThumbnailGenerator,
    ) {
    }

    public async getFileStream(fileName: string): Promise<IFileStream> {
        const stream = await this.fileStorage.getReadStream(fileName);
        if (!stream) {
            throw new FileNotFoundError(`File with ${fileName} was not found`);
        }
        const fileExtension = path.parse(fileName).ext;
        return {
            stream,
            fileName,
            mimeType: ALLOWED_IMAGE_TYPES.find((allowedType: IAllowedImageType) => allowedType.extension === fileExtension)?.mimeType ?? '',
        };
    }

    public async generateThumbnails(fileName: string): Promise<void> {
        const readFileStream = await this.fileStorage.getReadStream(fileName);
        if (!readFileStream) {
            throw new FileNotFoundError(`File with ${fileName} was not found, cannot generate thumbnails`);
        }
        const sizes = [200, 300, 400];
        const parsedFileName = path.parse(fileName);
        const promises = sizes.map(async (size: number) => {
            const thumbnailFileName = `${parsedFileName.name}.name_${size}_x${size}.${this.thumbnailGenerator.getThumbnailExtension()}`;
            const writeFileStream = await this.fileStorage.getWriteStream(thumbnailFileName);
            await this.thumbnailGenerator.generate(readFileStream, writeFileStream, {width: size, height: size});
        });
        await Promise.all(promises);
    }
}
