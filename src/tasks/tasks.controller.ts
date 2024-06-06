import { Task } from "./tasks.entity";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { dataSource } from "../index";
import { validationResult } from "express-validator";
import { UpdateResult } from "typeorm";

class TasksController {
  async getAllTasks(req: Request, res: Response): Promise<Response> {
    let tasks: Task[];
    try {
      tasks = await dataSource.getRepository(Task).find({
        order: {
          date: "ASC",
        },
      });
      tasks = instanceToPlain(tasks) as Task[];
      return res.json(tasks).status(200);
    } catch (_err) {
      return res.json({ error: "Internal server error" }).status(500);
    }
  }

  async createTask(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newTask = new Task();

    newTask.title = req.body.title;
    newTask.date = req.body.date;
    newTask.description = req.body.description;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;

    let createdTask: Task;

    try {
      createdTask = await dataSource.getRepository(Task).save(newTask);
      console.log(createdTask);
      createdTask = instanceToPlain(createdTask) as Task;

      return res.status(201).json(createdTask);
    } catch (_err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateTask(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let task: Task | null;

    try {
      task = await dataSource
        .getRepository(Task)
        .findOne({ where: { id: req.body.id } });
    } catch (_errors) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!task) {
      return res.status(404).json({ error: "No task exists with given id" });
    }

    let updatedTask: UpdateResult;

    try {
      updatedTask = await dataSource
        .getRepository(Task)
        .update(
          req.body.id,
          plainToInstance(Task, { status: req.body.status }),
        );
      updatedTask = instanceToPlain(updatedTask) as UpdateResult;

      return res.status(200).json(updatedTask);
    } catch (_error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export const tasksController = new TasksController();
