import { ServerConfig } from './ServerConfig';

export interface IConfigProvider {
    export(config: ServerConfig): Promise<void>;

    import(filePath: string): Promise<ServerConfig>;
}
