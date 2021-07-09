import {ReadStream, WriteStream} from 'fs-extra';
import * as fsExtra from 'fs-extra';
import {inject, injectable} from 'inversify';
import * as path from 'path';
import {ServerConfig} from '../config/ServerConfig';
import {FileLink} from '../http/adapters/IIndexPageData';
import {ILogger} from '../logger/ILogger';
import {Types} from '../Types';
import {ILinksFactory} from './ILinksFactory';
import {IFileStorage} from './IReadableFileStorage';

@injectable()
export class LocalReadableFileStorage implements IFileStorage {
    constructor(
        @inject(Types.Logger) protected logger: ILogger,
        @inject(Types.ServerConfig) protected serverConfig: ServerConfig,
        @inject(Types.LinksFactory) protected linksFactory: ILinksFactory,
    ) {
    }
    public getReadStream(fileName: string): Promise<ReadStream> {
        const filePath = path.join(this.serverConfig.storageConfig.storagePath, fileName);
        return Promise.resolve(fsExtra.createReadStream(filePath));
    }

    public getWriteStream(fileName: string): Promise<WriteStream> {
        const filePath = path.join(this.serverConfig.storageConfig.storagePath, fileName);
        return Promise.resolve(fsExtra.createWriteStream(filePath));
    }

    public async getFileLinks(): Promise<FileLink[]> {
        const fileNames = fsExtra.readdirSync(this.serverConfig.storageConfig.storagePath);
        return fileNames.map((fileName: string) => ({
            href: this.linksFactory.fileRoute(fileName),
            name: fileName,
        }));
    }

}
