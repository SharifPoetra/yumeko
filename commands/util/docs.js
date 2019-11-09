const qs = require("querystring");
const SOURCES = ["stable", "master", "rpc", "commando", "akairo", "akairo-master", "11.5-dev"];

module.exports.run = async (client, msg, args) => {
  if (args.length < 1) return args.missing(msg, "No query provided", this.help);
  let source = SOURCES.includes(args.slice(-1)[0]) ? args.pop() : "stable";
  if (source === "11.5-dev") {
    source = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${source}.json`;
  }
  try {
    const queryString = qs.stringify({ src: source, q: args.join(" ") });
    const { body: embed } = await client.snek.get(`https://djsdocs.sorta.moe/v2/embed?${queryString}`);
    if (!embed) {
      return msg.reply("I couldn't find the requested information. Maybe look for something that actually exists the next time!");
    }
    return msg.channel.send({ embed });
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

module.exports.conf = {
  aliases: [],
  clientPerm: "",
  authorPerm: "EMBED_LINKS"
};

module.exports.help = {
  name: "docs",
  description: "Search the discord.js documentation",
  usage: "docs <query> [version]",
  example: ["docs voiceConnection"]
};

