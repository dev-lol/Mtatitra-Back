
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export default function securityCoursier(req: Request, res: Response, next: NextFunction) {
    if(req.path == "/login") return next()
    var jwtToken: string = req.headers["authorization"]
    if (jwtToken == undefined) {
        res.status(401).send({
            message: "JWT token Missing"
        })
        return;
    }
    try {
        jwt.verify(jwtToken.split(" ")[1], process.env.COURSIER_PASS_PHRASE, (error, payload) => {
            if (error != null) {
                res.status(401).send({
                    message: error.message
                })
            }else{
                res.locals.id = payload.id
                return next()
            }
        })
    } catch (error) {
        res.status(401).send({
            message: error.message
        })
        return;
    }
}