import express from 'express';
import bodyParser from "body-parser"
import compression from "compression"
import router from './routerApi';
import { createConnection } from 'typeorm';
import { ormconfig } from '../config';
export default () => {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use("/api", compression())
    app.use("/api", router)
    createConnection(ormconfig).catch(err => console.log(err))
    console.log("Mtatitra is ONLINE ")
    return app.listen(process.env.PORT || 3000)
}