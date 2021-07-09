import { inject, injectable } from 'inversify';
import { IIndexPageData } from '../http/adapters/IIndexPageData';
import { IPageControllerAdapter } from '../http/adapters/PageControllerAdapter';
import { ILogger } from '../logger/ILogger';
import { Types } from '../Types';
import { IFileStorage } from './IReadableFileStorage';

@injectable()
export class PageHandler implements IPageControllerAdapter {
    constructor(
        @inject(Types.Logger) protected logger: ILogger,
        @inject(Types.File.FileStorage) protected fileStorage: IFileStorage,
    ) {
    }

    public async getIndexData(): Promise<IIndexPageData> {
        const fileLinks = await this.fileStorage.getFileLinks();
        return Promise.resolve({
            fileLinks,
        });
    }
}
