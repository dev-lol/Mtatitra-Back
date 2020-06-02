
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { print } from 'util';
export default function securityClient(req: Request, res: Response, next: NextFunction) {
    if (req.path == "/login" || req.path.includes("confirmation") || req.path.includes("resend") || req.path.includes("signup")) return next()
    var jwtToken: string = req.headers["authorization"]
    console.log(jwtToken)
    if (jwtToken == undefined) {
        res.status(401).send({
            message: "JWT token Missing"
        })
        return;
    }
    try {
        jwt.verify(jwtToken.split(" ")[1], process.env.CLIENT_PASS_PHRASE, (error, payload) => {
            if (error != null) {
                res.status(401).send({
                    message: error.message
                })
            }
            else{
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

export function checkId(req: Request, res: Response, next: NextFunction, id) {
    var jwtToken: string = req.headers["authorization"]
    jwt.decode(jwtToken.split(" ")[1], (error, payload) => {
        console.log(payload)
        if (payload.id != id) {
            throw "Not found";
        }else{
            return
        }
    })
}