const fs = require('fs');
const axios = require('axios');
const serverUrl = 'http://api.quuu.linuxpl.eu/todo/emindguj';

const upload = () => {
  let localData;

  try {
    localData = fs.readFileSync('./todo.json', 'utf8');
  } catch (err) {
    console.log("There is no file todo.json, I'm creating it for you");
    fs.writeFileSync('todo.json', '{ "lastId": 0, "tasks": [] }');
    localData = fs.readFileSync('./todo.json', 'utf8');
  }

  axios
    .post(serverUrl, localData)
    .then(function({ status }) {
      if (status === 201) {
        console.log("You've successfully uploaded local data to server");
      } else {
        console.log('Something went wrong...');
      }
    })
    .catch(function(error) {
      console.log('Error');
      console.log(error.message);
    });
};

const download = async () => {
  const serverData = await axios
    .get(serverUrl)
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      console.log('Error');
      console.log(error.message);
    });

  return serverData;
};

module.exports = {
  upload,
  download
};
