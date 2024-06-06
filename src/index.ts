import express, { Express } from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import * as process from "node:process";
import cors from "cors";
import bodyParser from "body-parser";
import { Task } from "./tasks/tasks.entity";
import { tasksRouter } from "./tasks/tasks.router";

const app: Express = express();
dotenv.config();

app.use(bodyParser.json());
app.use(cors());

export const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5435,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  synchronize: true,
  entities: [Task],
});

const port = process.env.PORT || 3200;

dataSource
  .initialize()
  .then(() => {
    console.log("Data source initialized");
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) =>
    console.error("Error during Data Source initialization", err),
  );

app.use("/", tasksRouter);
