import { ConnectionOptions } from 'typeorm';

var connectionOption: ConnectionOptions = {
   type: "postgres",
   host: process.env.DB_HOST || "localhost",
   port: Number(process.env.DB_PORT) || 5432,
   username: process.env.DB_USER || "postgres",
<<<<<<< HEAD
   password: process.env.DB_PASSWORD  ,
=======
   password: process.env.DB_PASSWORD || "Hnavalona419" ,
>>>>>>> b0121d8d616708c4853a7e91c0e093ce2608ef03
   database: process.env.DB_DATABASE || "Mtatitra",
   schema: "public",
   synchronize: false,
   entities: [
    "src/entities/**/*.ts"
   ],
}

var connectionOptionHeroku: ConnectionOptions = {
   type: "postgres",
   url: process.env.DATABASE_URL,
   synchronize: true,
   schema: "public",
   entities: [
    "src/entities/**/*.ts"
   ],
}


export const ormconfig = process.env.DATABASE_URL? connectionOptionHeroku : connectionOption;