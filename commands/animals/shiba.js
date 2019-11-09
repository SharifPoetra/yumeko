const { RichEmbed } = require("discord.js");

module.exports.run = async (client, msg, args) => {
  try {
    const { body } = await client.snek.get("http://shibe.online/api/shibes");
    const link = body[0];
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setURL(link)
      .setImage(link)
      .setTitle("Click here if image failed to load");
    return msg.channel.send(embed);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

module.exports.conf = {
  aliases: [],
  clientPerm: "EMBED_LINKS",
  authorPerm: ""
};

module.exports.help = {
  name: "shiba",
  description: "Show a random shiba inu",
  usage: "shiba",
  example: ["shiba"]
};
