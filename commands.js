const {
  getInitialData,
  showTasks,
  createTask,
  deleteTask,
  changeStatus,
  filterTasksByStatus,
  filterTasksByCategory
} = require('./localFunctions');

const args = require('yargs').argv;

const showCommand = {
  command: ['show [status]', '$0'],
  describe: 'Show ToDo list',
  handler: () => {
    try {
      const initialData = getInitialData();
      let filteredTasks = initialData.tasks;
      let infoText = 'Your TODO list';

      if (args.status === 'active') {
        filteredTasks = filterTasksByStatus(filteredTasks, true);
        infoText = `Your active tasks of TODO list:`;
      } else if (args.status === 'inactive') {
        filteredTasks = filterTasksByStatus(filteredTasks, false);
        infoText = `Your inactive tasks of TODO list:`;
      } else if (args.status) {
        console.log('You should use [inactive] or [active] status');
        return;
      }

      if (args.category) {
        filteredTasks = filterTasksByCategory(filteredTasks, args.category);
        infoText = `Your tasks of category: ${args.category}`;
      }

      showTasks(filteredTasks, infoText);
    } catch (error) {
      console.log(error.message);
    }
  }
};

const addCommand = {
  command: 'add [name] [category]',
  describe: 'Add new task to local data',
  handler: () => {
    try {
      const initialData = getInitialData();
      createTask(args.name, args.category, initialData);
    } catch (error) {
      console.log(error.message);
    }
  }
};

const deleteCommand = {
  command: 'delete [id]',
  describe: 'Delete task with given id from local data',
  handler: () => {
    try {
      const initialData = getInitialData();
      deleteTask(args.id, initialData);
    } catch (error) {
      console.log(error.message);
    }
  }
};

const changeStatusCommand = {
  command: 'change status [id]',
  describe: 'Change status for task with given id',
  handler: () => {
    try {
      const initialData = getInitialData();
      changeStatus(args.id, initialData, args.status);
    } catch (error) {
      console.log(error.message);
    }
  }
};

module.exports = [showCommand, addCommand, deleteCommand, changeStatusCommand];
