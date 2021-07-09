import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/ILogger';
import { Types } from '../Types';
import { StorageConfig } from './StorageConfig';

@injectable()
export class ServerConfig {
    private logger: ILogger;

    constructor(@inject(Types.Logger) logger: ILogger) {
        this.logger = logger;
        this._storageConfig = new StorageConfig(logger);
    }

    private _port: number = 8082;

    public get port(): number {
        return this._port;
    }

    private _apiPath: string = 'http://localhost:8082';

    public get apiPath(): string {
        return this._apiPath;
    }

    private _storageConfig: StorageConfig;

    public get storageConfig(): StorageConfig {
        return this._storageConfig;
    }

    public serialize(): any {
        return {
            port: this.port,
            storageConfig: this._storageConfig.serialize(),
            apiPath: this.apiPath,
        };
    }

    public deserialize(config: any): void {
        if(config.port && Number.isInteger(config.port) && Number(config.port) < Number.MAX_SAFE_INTEGER) {
            this._port = config.port;
        } else {
            this.logger.info(
                'ServerConfig',
                'deserialize',
                `Invalid port value ${config.port}, using default value ${this.port}`,
            );
        }

        if(typeof config.apiPath === 'string') {
            this._apiPath = config.apiPath;
        } else {
            this.logger.info(
                'StorageConfig',
                'deserialize',
                `Invalid api path path ${config.apiPath}, using default value`,
            );
        }

        this._storageConfig.deserialize(config.storageConfig);
    }
}
