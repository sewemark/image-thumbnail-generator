import { NextFunction, Request, Response } from 'express';

export interface IMiddleware {
    handle(request: Request, res: Response, next: NextFunction): Promise<void>;
}
