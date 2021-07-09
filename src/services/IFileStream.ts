import { ReadStream } from 'fs-extra';

export interface IFileStream {
    stream: ReadStream;
    mimeType: string;
    fileName: string;
}
