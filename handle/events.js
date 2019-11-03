const { readdirSync } = require("fs");

module.exports = client => {
  const events = readdirSync("./events/");
  for (const event of events) {
    const file = require(`../events/${event}`);
    client.on(event.split(".")[0], (...args) => file(client, ...args));
  }
};
