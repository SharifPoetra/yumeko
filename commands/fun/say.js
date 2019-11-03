module.exports.run = async (client, msg, args) => {
  try {
    return msg.channel.send(args.join(" ") || "Im trying to send an empty message");
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

module.exports.conf = {
  aliases: ["echo"],
  clientPerm: "",
  authorPerm: ""
};

module.exports.help = {
  name: "say",
  description: "say something with bot",
  usage: "say [text]",
  example: ["say", "say baka"]
};
