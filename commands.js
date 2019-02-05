const {
  getInitialData,
  showTasks,
  createTask,
  deleteTask,
  changeStatus,
  filterTasksByStatus,
  filterTasksByCategory,
  updateLocalData
} = require('./localFunctions');

const { upload, download } = require('./serverFunctions');

const showCommand = {
  command: ['show [status] [category]', '$0'],
  describe: 'Show TODO list [with filering by status, category or both]',
  builder: yargs => {
    yargs
      .positional('status', {
        describe: 'Task new status',
        type: 'string'
      })
      .positional('category', {
        describe: 'Task category',
        type: 'string'
      });
  },
  handler: args => {
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
  command: 'add <name> [category]',
  describe: 'Add new task to local data',
  builder: yargs => {
    yargs
      .positional('name', {
        describe: 'Task name',
        type: 'string'
      })
      .positional('category', {
        describe: 'Task category',
        type: 'string'
      });
  },
  handler: args => {
    try {
      const initialData = getInitialData();
      createTask(args.name, args.category, initialData);
    } catch (error) {
      console.log(error.message);
    }
  }
};

const deleteCommand = {
  command: 'delete <id>',
  describe: 'Delete task with given id from local data',
  builder: yargs => {
    yargs.positional('id', {
      describe: 'Task id',
      type: 'number'
    });
  },
  handler: args => {
    try {
      const initialData = getInitialData();
      deleteTask(args.id, initialData);
    } catch (error) {
      console.log(error.message);
    }
  }
};

const changeStatusCommand = {
  command: 'change <id> [status]',
  describe: 'Change status for task with given id',
  builder: yargs => {
    yargs
      .positional('id', {
        describe: 'Task id',
        type: 'number'
      })
      .positional('status', {
        describe: 'Task new status [active/inactive]',
        type: 'string'
      });
  },
  handler: args => {
    try {
      const initialData = getInitialData();
      changeStatus(args.id, initialData, args.status);
    } catch (error) {
      console.log(error.message);
    }
  }
};

const uploadCommand = {
  command: 'upload',
  describe: 'Upload local data to server',
  handler: () => {
    try {
      upload();
    } catch (error) {
      console.log(error.message);
    }
  }
};

const downloadCommand = {
  command: 'download',
  describe: 'Download remote data and overwrite local',
  handler: async () => {
    try {
      const serverData = await download();

      if (serverData) {
        showTasks(serverData.tasks, 'Your tasks on server');
        updateLocalData(serverData);
        console.log('Your local tasks are now the same as on server');
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};

module.exports = [
  showCommand,
  addCommand,
  deleteCommand,
  changeStatusCommand,
  uploadCommand,
  downloadCommand
];
