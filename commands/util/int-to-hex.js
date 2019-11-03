const { RichEmbed } = require("discord.js");

exports.run = async (client, msg, args) => {
  if (args.length < 1) return args.missing(msg, "No integer provided", this.help);
  try {
    const hex = parseInt(args.join("")).toString(16);
    const embed = new RichEmbed()
      .setColor(`#${args[0]}`)
      .setDescription(`📝 | Here is the converted int to hex:\nInteger: ${args[0]}\nHexadecimal: #${hex}`);
    return msg.channel.send(embed);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

exports.conf = {
  aliases: ["ith"],
  clientPerm: "EMBED_LINKS",
  authorPerm: ""
};

exports.help = {
  name: "int-to-hex",
  description: "Parses integers to hexadecimals.",
  usage: "int-to-hex <int>",
  example: ["int-to-hex 6665983"]
};
