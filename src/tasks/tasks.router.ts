import { Router } from "express";
import { createValidator, updateValidator } from "./tasks.validator";
import { tasksController } from "./tasks.controller";

export const tasksRouter: Router = Router();

tasksRouter.get("/api/tasks", tasksController.getAllTasks);

tasksRouter.post("/api/tasks", createValidator, tasksController.createTask);

tasksRouter.put("/api/tasks", updateValidator, tasksController.updateTask);
