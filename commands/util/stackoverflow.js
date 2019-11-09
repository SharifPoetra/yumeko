const { RichEmbed } = require("discord.js");

module.exports.run = async (client, msg, args) => {
  if (args.length < 1) return args.missing(msg, "No query provided", this.help);
  try {
    const { body } = await client.snek.get("http://api.stackexchange.com/2.2/search/advanced")
      .query({
        page: 1,
        pagesize: 1,
        order: "asc",
        sort: "relevance",
        answers: 1,
        q: encodeURIComponent(args.join(" ")),
        site: "stackoverflow"
      });
    if (!body.items.length) return msg.channel.send("Could not find any results.");
    const data = body.items[0];
    const embed = new RichEmbed()
      .setColor("#F48023")
      .setAuthor("Stack Overflow", "https://i.imgur.com/P2jAgE3.png", "https://stackoverflow.com/")
      .setURL(data.link)
      .setTitle(data.title)
      .addField("📟 ID", data.question_id, true)
      .addField("👤 Asker", `[${data.owner.display_name}](${data.owner.link})`, true)
      .addField("🔶 Views", data.view_count, true)
      .addField("⭐ Score", data.score, true)
      .addField("📅 Creation Date", new Date(data.creation_date * 1000).toDateString(), true)
      .addField("🌓 Last Activity", new Date(data.last_activity_date * 1000).toDateString(), true);
    return msg.channel.send(embed);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

module.exports.conf = {
  aliases: ["stov"],
  clientPerm: "EMBED_LINKS",
  authorPerm: ""
};

module.exports.help = {
  name: "stackoverflow",
  description: "Search question on stackoverflow",
  usage: "stackoverflow <query>",
  example: ["stackoverflow discord"]
};
