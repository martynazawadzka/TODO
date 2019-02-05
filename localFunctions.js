const fs = require('fs');
const Task = require('./newTask');

const listTitle = title => {
  console.log('===============');
  console.log('');
  console.log(title);
  console.log('');
  console.log('===============');
};

const findTaskIndexById = (id, initialData) => {
  let taskIndex;
  initialData.tasks.forEach((task, index) => {
    if (task.id === parseInt(id)) {
      taskIndex = index;
    }
  });
  return taskIndex;
};

const getInitialData = () => {
  try {
    return JSON.parse(fs.readFileSync('./todo.json', 'utf8'));
  } catch (err) {
    console.log("There is no file todo.json, I'm creating it for you");
    fs.writeFileSync('todo.json', '{ "lastId": 0, "tasks": [] }');
    return JSON.parse(fs.readFileSync('./todo.json', 'utf8'));
  }
};

const updateLocalData = data => {
  const stringifiedData = JSON.stringify(data);
  fs.writeFileSync('todo.json', stringifiedData);
};

const showTasks = (tasks, infoText) => {
  if (!tasks) {
    console.log('Your data are not valid');
    return;
  }

  if (!tasks.length) {
    infoText = 'Your list is empty';
  }

  listTitle(infoText);

  tasks.forEach((task, index) => {
    console.log(
      `${index + 1}. ${task.task} (category: ${task.category}, id: ${
        task.id
      },  ${task.isActive ? 'active' : 'inactive'} )`
    );
  });
};

const createTask = (name, category = 'others', initialData) => {
  const taskId = ++initialData.lastId;
  const newTask = new Task(taskId, name, category);

  initialData.tasks.push(newTask);
  updateLocalData(initialData);

  console.log(`You have succesfully created task: ${name}`);
};

const deleteTask = (id, initialData) => {
  if (isNaN(id)) {
    console.error('Id should be a number');
    return;
  }

  const taskToDeleteIndex = findTaskIndexById(id, initialData);

  if (taskToDeleteIndex !== undefined) {
    initialData.tasks.splice(taskToDeleteIndex, 1);
    updateLocalData(initialData);

    console.log(`You have succesfully removed task with id ${id}`);
  } else {
    console.error(`There is no task with id ${id}`);
  }
};

const changeStatus = (id, initialData, newStatus) => {
  if (isNaN(id)) {
    console.error('Id should be a number');
    return;
  }

  const taskToChangeIndex = findTaskIndexById(id, initialData);
  const taskToChange = initialData.tasks[taskToChangeIndex];

  if (taskToChangeIndex === undefined) {
    console.error(`There is no task with id ${id}`);
    return;
  }

  if (newStatus === 'active') {
    taskToChange.isActive = true;
  } else if (newStatus === 'inactive') {
    taskToChange.isActive = false;
  } else if (newStatus) {
    console.log('You should use [inactive] or [active] status');
    return;
  } else {
    taskToChange.isActive = !taskToChange.isActive;
  }

  updateLocalData(initialData);

  console.log(
    `You have succesfully changed task status to ${
      taskToChange.isActive ? 'active' : 'inactive'
    }`
  );
};

const filterTasksByStatus = (tasks, status) => {
  return tasks.filter(task => {
    return task.isActive === status;
  });
};

const filterTasksByCategory = (tasks, category) => {
  return tasks.filter(task => {
    return task.category === category;
  });
};

module.exports = {
  getInitialData,
  showTasks,
  createTask,
  deleteTask,
  changeStatus,
  filterTasksByStatus,
  filterTasksByCategory,
  updateLocalData
};
