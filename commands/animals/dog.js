const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, msg) => {
  try {
    const { body } = await client.snek.get("https://random.dog/woof.json");
    const link = body.url;
    const embed = new MessageEmbed()
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
  name: "dog",
  description: "Show a random dog",
  usage: "dog",
  example: ["dog"]
};
