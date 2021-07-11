import { ReadStream, WriteStream } from 'fs-extra';
import { inject, injectable } from 'inversify';
import sharp from 'sharp';
import { ILogger } from '../logger/ILogger';
import { Types } from '../Types';
import { IThumbnailGenerator } from './IThumbnailGenerator';
import { IThumbnailOptions } from './IThumbnailOptions';

@injectable()
export class SharpThumbnailGenerator implements IThumbnailGenerator {
    constructor(
        @inject(Types.Logger) protected logger: ILogger,
    ) {
    }

    public generate(readableStream: ReadStream, writableStream: WriteStream, options: IThumbnailOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            const sharpSteam = sharp()
                .resize(options.height, options.width)
                .png();
            const resultStream = readableStream
                .pipe(sharpSteam)
                .pipe(writableStream);
            resultStream.on('error', (error: Error) => {
                reject(error);
            });
            resultStream.on('finish', () => resolve(writableStream.path.toString()));
            resultStream.on('close', () => resolve(writableStream.path.toString()));
        });
    }

    public getThumbnailExtension(): string {
        return 'png';
    }
}
