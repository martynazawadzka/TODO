class Task {
  constructor(id, task, category = 'others') {
    this.id = id;
    this.task = task;
    this.isActive = true;
    this.category = category;
  }
}

module.exports = Task;
