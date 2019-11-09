module.exports.run = async (client, msg, args) => {
  if (!args.length) return msg.channel.send("ヽ༼ຈل͜ຈ༽ﾉ");
  try {
    return msg.channel.send(`ヽ༼ຈل͜ຈ༽ﾉ **${args.join(" ").toUpperCase()}** ヽ༼ຈل͜ຈ༽ﾉ`);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

module.exports.conf = {
  aliases: [],
  clientPerm: "",
  authorPerm: ""
};

module.exports.help = {
  name: "riot",
  description: "start a riot ヽ༼ຈل͜ຈ༽ﾉ",
  usage: "riot [text]",
  example: ["riot", "riot i wanna be a contributtor"]
};
