exports.run = async (client, msg, args) => {
  try {
    const { body } = await client.snek.get("https://api.icndb.com/jokes/random");
    return msg.channel.send(`📢 \`|\` **${body.value.joke}**`);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

exports.conf = {
  aliases: ["ckns"],
  clientPerm: "",
  authorPerm: ""
};

exports.help = {
  name: "chuknorris",
  description: "Send a random chuknorris joke",
  usage: "chuknorris",
  example: ["chuknorris"]
};
