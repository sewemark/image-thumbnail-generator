import { Express } from 'express';

export interface IExpressAppDecorator {
    decorate(app: Express ): void;
}
