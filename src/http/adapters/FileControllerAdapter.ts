import {IFileStream} from '../../services/IFileStream';

export interface IFileControllerAdapter {
    generateThumbnails(fileName: string): Promise<void>;
    getFileStream(fileName: string): Promise<IFileStream>;
}
