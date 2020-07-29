import { ConnectionOptions } from 'typeorm';

var connectionOption: ConnectionOptions = {
   type: "mysql",
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT),
   username: process.env.DB_USER,
   password: process.env.DB_PASSWORD ,
   database: process.env.DB_DATABASE,
   synchronize: true,
   entities: [
    "src/entities/**/*.ts"
   ],
}

export const ormconfig = connectionOption;