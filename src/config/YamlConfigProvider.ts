import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { ILogger } from '../logger/ILogger';
import { IConfigProvider } from './IConfigProvider';
import { ServerConfig } from './ServerConfig';

const CONFIG_FILENAME = 'config.yml';

export class YamlConfigProvider implements IConfigProvider {
    private logger: ILogger;

    constructor(
        logger: ILogger,
    ) {
        this.logger = logger;
    }

    public export(config: ServerConfig): Promise<void> {
        const yamlConfig = yaml.safeDump(config.serialize());
        fs.writeFileSync(path.join('.', CONFIG_FILENAME), yamlConfig);
        return Promise.resolve();
    }

    public import(filePath: string, fileName?: string): Promise<ServerConfig> {
        const file = fileName ? fileName : CONFIG_FILENAME;
        if(!fs.existsSync(path.join(filePath, file))) {
            this.export(new ServerConfig(this.logger));
        }
        const config = yaml.safeLoad(fs.readFileSync(path.join(filePath, file), 'utf-8'));
        const serverConfig = new ServerConfig(this.logger);
        serverConfig.deserialize(config);
        return Promise.resolve(serverConfig);
    }
}
