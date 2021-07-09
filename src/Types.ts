export type MiddlewareType = symbol;
export type ControllerType = symbol;

export const Types = {
    Logger: Symbol.for('Logger'),
    ServerConfig: Symbol.for('ServerConfig'),
    MiddlewareFactory: Symbol.for('MiddlewareFactory'),
    ControllerFactory: Symbol.for('ControllerFactory'),
    LinksFactory: Symbol.for('LinksFactory'),
    File: {
        FileUploadService: Symbol.for('FileUploadService'),
        ThumbnailGenerator: Symbol.for('ThumbnailGenerator'),
        ReadableFileStorage: Symbol.for('ReadableFileStorage'),
        FileStorage: Symbol.for('FileStorage'),
    },
    ResponseFactory: Symbol.for('ResponseFactory'),
};

export const Middlewares = {
    FileUploadMiddleware: Symbol.for('FileUploadMiddleware'),
};

export const Controllers = {
    FileController: Symbol.for('FileUploadController'),
    ThumbnailController: Symbol.for('ThumbnailController'),
    PageController: Symbol.for('PageController'),
};

export const ControllerAdapters = {
    PageControllerAdapter: Symbol.for('PageControllerAdapter'),
    ThumbnailControllerAdapter: Symbol.for('ThumbnailControllerAdapter'),
    FileControllerAdapter: Symbol.for('FileControllerAdapter'),
};
