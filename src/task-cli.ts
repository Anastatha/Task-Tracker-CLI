import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  filterTasksByStatus,
} from "./task-manager";

yargs(hideBin(process.argv))
  .command(
    "add <description>",
    "Add a new task",
    (yargs) => {
      yargs.positional("description", {
        describe: "Description of the task",
        type: "string",
      });
    },
    (argv) => {
      const task = addTask(argv.description as string);
      console.log(`Task added successfully (ID: ${task.id})`);
    }
  )
  .command(
    "update <id> <description>",
    "Update an existing task",
    (yargs) => {
      yargs
        .positional("id", { describe: "ID of the task", type: "number" })
        .positional("description", {
          describe: "New description",
          type: "string",
        });
    },
    (argv) => {
      const updatedTask = updateTask(
        argv.id as number,
        argv.description as string
      );
      if (updatedTask) {
        console.log(`Task updated successfully:`, updatedTask);
      } else {
        console.log("Task not found.");
      }
    }
  )
  .command(
    "delete <id>",
    "Delete a task",
    (yargs) => {
      yargs.positional("id", { describe: "ID of the task", type: "number" });
    },
    (argv) => {
      if (deleteTask(argv.id as number)) {
        console.log(`Task deleted successfully (ID: ${argv.id})`);
      } else {
        console.log("Task not found.");
      }
    }
  )
  .command(
    "mark <id> <status>",
    "Mark a task as todo, in-progress, or done",
    (yargs) => {
      yargs
        .positional("id", { describe: "ID of the task", type: "number" })
        .positional("status", {
          describe: "New status (todo, in-progress, done)",
          choices: ["todo", "in-progress", "done"],
        });
    },
    (argv) => {
      const updatedTask = updateTaskStatus(
        argv.id as number,
        argv.status as "todo" | "in-progress" | "done"
      );
      if (updatedTask) {
        console.log(`Task status updated:`, updatedTask);
      } else {
        console.log("Task not found.");
      }
    }
  )
  .command(
    "list [status]",
    "List tasks (all, todo, in-progress, done)",
    (yargs) => {
      yargs.positional("status", {
        describe: "Filter by status",
        choices: ["todo", "in-progress", "done"],
      });
    },
    (argv) => {
      const tasks = filterTasksByStatus(
        argv.status as "todo" | "in-progress" | "done"
      );
      console.table(tasks);
    }
  )

  .demandCommand(1)
  .strict()
  .help().argv;
