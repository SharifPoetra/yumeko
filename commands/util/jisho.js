const { RichEmbed } = require("discord.js");

exports.run = async (client, msg, args) => {
  if (args.length < 1) return args.missing(msg, "No query provided", this.help);
  try {
    const { body } = await client.snek.get("http://jisho.org/api/v1/search/words")
      .query({ keyword: args.join("+") });
    if (!body.data.length) return msg.channel.send("🚫 Could not find any results.");
    const data = body.data[0];
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`
__**${data.japanese[0].word || data.japanese[0].reading}**__
${data.senses[0].english_definitions.join(", ")}`);
    return msg.channel.send(embed);
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
  name: "jisho",
  description: "Defines a word, but with Japanese.",
  usage: "jisho <query>",
  example: ["jisho you"]
};
