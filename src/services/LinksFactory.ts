import { inject, injectable } from 'inversify';
import  urljoin from 'url-join';
import {ServerConfig} from '../config/ServerConfig';
import {ILogger} from '../logger/ILogger';
import {Types} from '../Types';
import {ILinksFactory} from './ILinksFactory';

@injectable()
export class LinksFactory implements ILinksFactory {
    constructor(
        @inject(Types.Logger) protected logger: ILogger,
        @inject(Types.ServerConfig) protected serverConfig: ServerConfig,
    ) {
    }

    public fileRoute(fileName: string): string {
        return urljoin(this.serverConfig.apiPath, 'api/v1/file', fileName);
    }
}
