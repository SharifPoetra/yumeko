const yumekoClient = require('./handle/yumekoClient.js');

const client = new yumekoClient({
  fetchAllMember: true,
  disableEveryone: true
});

require('./handle/events')(client);

client.login(process.env.TOKEN);

