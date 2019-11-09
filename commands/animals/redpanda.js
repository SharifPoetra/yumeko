const { RichEmbed } = require("discord.js");

module.exports.run = async (client, msg) => {
  try {
    const { body } = await client.snek.get("https://animals.anidiots.guide/red_panda");
    const link = body.link;
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
  name: "redpanda",
  description: "Show a random redpanda",
  usage: "redpanda",
  example: ["redpanda"]
};
