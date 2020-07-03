import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
export default function (req: Request, res: Response, next: NextFunction) {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json(validationResult(req))
    } else {
        return next()
    }
}
