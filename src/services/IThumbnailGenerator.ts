import {ReadStream, WriteStream} from 'fs-extra';
import {IThumbnailOptions} from './IThumbnailOptions';

export interface IThumbnailGenerator {
    generate(readableFileStream: ReadStream, writableStream: WriteStream, options: IThumbnailOptions): Promise<string>;
}
