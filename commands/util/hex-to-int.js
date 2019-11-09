const { RichEmbed } = require("discord.js");

module.exports.run = async (client, msg, args) => {
  if (args.length < 1) return args.missing(msg, "No hexadecimal provided", this.help);
  try {
    const int = parseInt(args.join("").replace("#", ""), 16);
    const embed = new RichEmbed()
      .setColor(int)
      .setDescription(`📝 | Here is the converted hex to int:\nHexadecimal: ${args[0]}\nInteger: ${int}`);
    return msg.channel.send(embed);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

module.exports.conf = {
  aliases: ["hti"],
  clientPerm: "EMBED_LINKS",
  authorPerm: ""
};

module.exports.help = {
  name: "hex-to-int",
  description: "Parses integers to hexadecimals.",
  usage: "hex-to-int <hex>",
  example: ["hext-to-int #00DAFF"]
};
