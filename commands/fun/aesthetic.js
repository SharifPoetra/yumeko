exports.run = async (client, msg, args) => {
  if (!args.length) return msg.channel.send("A E S T H E T I C");
  try {
    return msg.channel.send(args.join(" ").split("").join(" ").toUpperCase());
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

exports.conf = {
  aliases: [],
  clientPerm: "",
  authorPerm: ""
};

exports.help = {
  name: "aesthetic",
  description: "make text to A E S T H E T I C",
  usage: "aesthetic [text]",
  example: ["aesthetic", "aesthetic you dead"]
};
