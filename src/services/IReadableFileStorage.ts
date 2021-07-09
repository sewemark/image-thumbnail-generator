import {ReadStream, WriteStream} from 'fs-extra';
import {FileLink} from '../http/adapters/IIndexPageData';

export interface IReadableFileStorage {
    getReadStream(fileName: string): Promise<ReadStream>;
}

export interface IWritableFileStorage {
    getWriteStream(fileName: string): Promise<WriteStream>;
}

export interface IFileStorage extends IReadableFileStorage, IWritableFileStorage {
    getFileLinks(): Promise<FileLink[]>;
}
