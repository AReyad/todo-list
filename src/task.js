export default class Task {

  constructor(title, description, priority, dueDate, status) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.status = status;
  }

  finishTask() {
    this.status = "done";
  }

  static fromJSON(data) {
    console.log(data.status)
    return Object.assign(new Task(), data)
  }
}
