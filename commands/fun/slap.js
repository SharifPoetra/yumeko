const { RichEmbed } = require("discord.js");

module.exports.run = async (client, msg, args) => {
  let user = msg.mentions.users.first() || client.users.get(args[0]);
  if (!user) user = msg.author;
  try {
    const { body } = await client.snek.get("https://nekos.life/api/v2/img/slap");
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(reaction(client, msg.author, user, "slaping"))
      .setImage(body.url);
    return msg.channel.send(embed);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

function reaction(client, author, user, rect) {
  if (author.id === user.id) return `${author.toString()} ${rect} themselft ??`;
  if (author.id === client.user.id) return `${author.toString()}, awh you ${rect} me >_<.`;
  return `${author.toString()} ${rect} ${user.toString()}`;
}

module.exports.conf = {
  aliases: [],
  clientPerm: "",
  authorPerm: "EMBED_LINKS"
};

module.exports.help = {
  name: "slap",
  description: "slaping some user",
  usage: "slap [mention | id]",
  example: ["slap", "slap @yumeko", "slap 10383642829282"]
};
