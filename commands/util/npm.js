const { RichEmbed } = require("discord.js");

module.exports.run = async (client, msg, args) => {
  const query = args.join("+");
  if (!query) return args.missing(msg, "No query provided", this.help);
  try {
    const { body } = await client.snek.get(`https://registry.npmjs.com/${query}`);
    const version = body.versions[body["dist-tags"].latest];
    let deps = version.dependencies ? Object.keys(version.dependencies) : null;
    let maintainers = body.maintainers.map(user => user.name);
    if (maintainers.length > 10) maintainers = client.util.trimArray(maintainers);
    if (deps && deps.length > 10) deps = client.util.trimArray(deps);
    const embed = new RichEmbed()
      .setColor("#CB0000")
      .setAuthor(body.name, "https://i.imgur.com/ErKf5Y0.png")
      .setDescription(`${body.description || "No description."}
🆙 **Version:** ${body["dist-tags"].latest}
©️ **License:** ${body.license}
👤 **Author:** ${body.author ? body.author.name : "Unknown"}
⏰ **Modified:** ${new Date(body.time.modified).toDateString()}
🗃️ **Dependencies:** ${deps && deps.length ? deps.map(x => `\`${x}\``).join(", ") : "None"}
👥 **Maintainers:** ${maintainers.map(x => `\`x\``).join(" ")}
**Download:** [${body.name}](https://www.npmjs.com/package/${query})`);
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
  name: "npm",
  description: "Gets information on an NPM package.",
  usage: "npm <package name>",
  example: ["npm gulp"]
};
