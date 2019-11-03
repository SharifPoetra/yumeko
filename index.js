const YumekoClient = require("./handle/YumekoClient.js");

const client = new YumekoClient({
  fetchAllMember: true,
  disableEveryone: true
});

require("./handle/events")(client);

client.login(process.env.TOKEN);

require("./server.js");
