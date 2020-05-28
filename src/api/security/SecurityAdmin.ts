
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export default function securityAdmin(req: Request, res: Response, next: NextFunction) {
    var jwtToken: string = req.headers["authorization"]
    console.log(jwtToken)
    if (jwtToken == undefined) {
        res.status(401).send({
            message: "JWT token Missing"
        })
        return;
    }
    try {
        jwt.verify(jwtToken.split(" ")[1], process.env.ADMIN_PASS_PHRASE, (error, payload) => {
            if (error != null) {
                res.status(401).send({
                    message: error.message
                })
            }
        })
    } catch (error) {
        res.status(401).send({
            message: error.message
        })
        return;
    }
}