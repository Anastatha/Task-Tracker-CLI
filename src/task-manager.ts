import * as fs from "fs";
import * as path from "path";

const tasksFilePath = path.resolve(__dirname, "../tasks.json");

export type Task = {
  id: number;
  description: string;
  status: "todo" | "in-progress" | "done";
  createdAt: string;
  updatedAt: string;
};

export const getTasks = (): Task[] => {
  if (!fs.existsSync(tasksFilePath)) {
    return [];
  }
  const data = fs.readFileSync(tasksFilePath, "utf-8");
  return JSON.parse(data);
};

export const saveTasks = (tasks: Task[]): void => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

export const addTask = (description: string): Task => {
  const tasks = getTasks();
  const task: Task = {
    id: tasks.length + 1,
    description,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
};

export const updateTask = (id: number, description: string): Task | null => {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;

  task.description = description;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  return task;
};

export const deleteTask = (id: number): boolean => {
  let tasks = getTasks();
  const startLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
  return tasks.length < startLength;
};

export const updateTaskStatus = (
  id: number,
  status: "todo" | "in-progress" | "done"
): Task | null => {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;

  task.status = status;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  return task;
};

export const filterTasksByStatus = (
  status?: "todo" | "in-progress" | "done"
): Task[] => {
  const tasks = getTasks();
  return status ? tasks.filter((t) => t.status === status) : tasks;
};
