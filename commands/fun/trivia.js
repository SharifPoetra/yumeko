const { RichEmbed } = require("discord.js");
const choices = ["A", "B", "C", "D"];

module.exports.run = async (client, msg) => {
  try {
    const { body } = await client.snek.get("https://opentdb.com/api.php")
      .query({
        amount: 1,
        encode: "url3986"
      });
    let answer = body.results[0].incorrect_answers;
    answer.push(body.results[0].correct_answer);
    answer = client.util.shuffle(answer);
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`**${decodeURIComponent(body.results[0].question)}**\n\n${answer.map((x, i) => `**${choices[i]}** - __**${decodeURIComponent(x)}**__`).join("\n")}`);
    msg.channel.send("You have 15 Seconds to answer this question", { embed: embed });
    const filter = res => choices.includes(res.content) && res.author.id === msg.author.id;
    const reply = await msg.channel.awaitMessages(filter, { max: 1, time: 15000 });
    if (!reply.size) return msg.channel.send(`⏱️ Sorry time is up it was **${decodeURIComponent(body.results[0].correct_answer)}**`);
    if (answer[choices.indexOf(reply.first().content.toUpperCase())] === body.results[0].correct_answer) return msg.reply("You won");
    return msg.reply(`Too bad it's was **${decodeURIComponent(body.results[0].correct_answer)}**`);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

module.exports.conf = {
  aliases: ["tv"],
  clientPerm: "",
  authorPerm: ""
};

module.exports.help = {
  name: "trivia",
  description: "play trivia game with randomly quiz",
  usage: "trivia",
  example: ["trivia"]
};
