import "reflect-metadata"; // Import reflect-metadata for TypeORM decorators
import { DataSource } from "typeorm"
import  { User }  from "./userWithORM.js"
import { Book } from "./book.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "crud_ts",
    entities: [Book],
    synchronize: true,
})