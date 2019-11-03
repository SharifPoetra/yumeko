const status = require("../assets/json/status.json");

module.exports = client => {
  console.log(`${client.user.tag} GoGoGo 1!1!11!`);
  setInterval(() => client.updateStats(), 1000 * 60);
  client.user.setActivity("@Yumeko help", { type: "STREAMING" });
  client.moeJP.connect();
  client.moeKR.connect();
};
