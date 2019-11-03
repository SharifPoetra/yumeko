const { RichEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  if (args.length < 1) return args.missing(message, "No query provided", this.help);
  const query = args.join("+").replace(/#/g, ".prototype.");
  try {
    const { body } = await client.snek
      .get("https://developer.mozilla.org/en-US/search.json")
      .query({
        q: query,
        locale: "en-US",
        highlight: false
      });
    if (!body.documents.length) return message.channel.send("🚫 **No result found**");
    const data = body.documents[0];
    const embed = new RichEmbed()
      .setColor("#066FAD")
      .setAuthor("MDN", "https://i.imgur.com/DFGXabG.png", "https://developer.mozilla.org/")
      .setTitle(data.title)
      .setURL(data.url)
      .setDescription(data.excerpt);
    return message.channel.send(embed);
  } catch (e) {
    return msg.reply(`Oh no, an error occurred: \`${e.message}\`. Try again later!`);
  }
};

exports.conf = {
  aliases: [],
  clientPerm: "",
  authorPerm: ""
};

exports.help = {
  name: "mdn",
  description: "resource for developer form developer",
  usage: "mdn <query>",
  example: ["mdn Array#concat"]
};
