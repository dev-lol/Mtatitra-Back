import 'reflect-metadata';
import { CustomServer } from './api/Server';
import dotenv from 'dotenv'
dotenv.config()
import * as os from "os";
import cluster from "cluster";
const cores = os.cpus().length
if (cluster.isMaster) {
    for (let i = 0; i < cores; i++) {
        cluster.fork()
    }
    cluster.on('exit',() => {
        cluster.fork()
    })
} else {
    new CustomServer();
}
