import Task from "./task.js";

export default class Project {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.tasks = [];
  }

  createProjectTask(data) {
    const task = new Task(data["title"], data["description"], data["priority"], data["date"], "in progress");
    this.tasks.push(task);
    return task;
  }

  deleteTask(taskId) {
    return this.tasks = this.tasks.filter((task) => task.id !== taskId)
  }

  findTask(taskId) {
    return this.tasks.find((task) => task.id == taskId)
  }

  static fromJSON(data) {
    if(data.tasks.length) data.tasks = data.tasks.map(task => Task.fromJSON(task));
    return Object.assign(new Project(), data)
  }
}
