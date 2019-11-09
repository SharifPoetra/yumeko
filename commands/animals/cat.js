const { RichEmbed } = require("discord.js");
const { load } = require("cheerio");

module.exports.run = async (client, msg) => {
  try {
    const { body } = await client.snek.get("http://random.cat");
    const link = load(body)("img#cat").attr("src");
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
  name: "cat",
  description: "Show a random cat",
  usage: "cat",
  example: ["cat"]
};
