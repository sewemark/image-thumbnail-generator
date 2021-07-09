import * as fsExtra from 'fs-extra';
import { ILogger } from '../logger/ILogger';
import { StorageTypes } from './StoragTypes';

export class StorageConfig {
    public type: StorageTypes = StorageTypes.Local;
    private logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    private _storagePath: string = './tmpDir';

    public get storagePath(): string {
        return this._storagePath;
    }

    public serialize(): any {
        return {
            storagePath: this.storagePath,
        };
    }

    public deserialize(config: any): void {
        console.log(config);
        if(!fsExtra.existsSync(config.storagePath)) {
            fsExtra.mkdirpSync(config.storagePath);
        }
        if(typeof config.storagePath === 'string') {
            this._storagePath = config.storagePath;
        } else {
            this.logger.info(
                'StorageConfig',
                'deserialize',
                `Invalid local storage path ${config.storagePath}, using default value ${this.storagePath}`,
            );
        }
    }
}
