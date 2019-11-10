const { RichEmbed } = require("discord.js");
const number = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣"];
const isPlayed = new Set();
const Akinator = require("../../handle/akinatorGame/Akinator");
const akiThumbnail = require("../../assets/json/akinatorImage");

module.exports.run = async (client, msg) => {
  if (isPlayed.has(msg.channel.id)) return msg.reply("Only one game may be occuring per channel");
  isPlayed.add(msg.channel.id);
  try {
    const akinator = new Akinator("https://srv6.akinator.com:9126");
    let ans = NaN;
    const thisMess = await msg.channel.send("Fetching... Aki");
    for (const num of number) {
      await thisMess.react(num);
    }
    while (akinator.progression < 95) {
      const data = isNaN(ans) ? await akinator.create(msg.channel.nsfw) : await akinator.answer(ans, msg.channel.nsfw);
      if (!data || !data.answers || akinator.step >= 80) break;
      
      const embed = new RichEmbed()
      .setColor("#F78B26")
      .setThumbnail(`${getThumbnail(Math.round(Number.parseInt(data.progression, 10)))}`)
      .setTitle(`**${++data.step}.** ${data.question} (${Math.round(Number.parseInt(data.progression, 10))}%)`)
      .setDescription(`${data.answers.map((x, i) => `${number[i]} ${x.answer}`).join("\n")}`)
      thisMess.edit(embed);
      
      const filter = (rect, usr) => number.includes(rect.emoji.name) && usr.id === msg.author.id;
      const response = await thisMess.awaitReactions(filter, { max: 1, time: 30000 });
      if (!response.size) {
        await msg.channel.send("Time is Up!");
        break;
      }
      ans = number.indexOf(response.first().emoji.name);
    }
    await thisMess.delete();
    isPlayed.delete(msg.channel.id);
    const guess = await akinator.guess();
    if (!guess) return msg.reply("Hmm... I seem to be having a bit of trouble. Check back soon!");
    const embed = new RichEmbed()
      .setColor("#F78B26")
      .setTitle(`I'm ${Math.round(guess.proba * 100)}% sure it's...`)
      .setDescription(`${guess.name}${guess.description ? `\n_${guess.description}_` : ""}`)
      .setImage(guess.absolute_picture_path);
    return msg.reply(embed);
  } catch (e) {
    isPlayed.delete(msg.channel.id);
    return msg.channel.send(`Oh no an error occured :( \`${e.stack}\` try again later`);
  }
};

function getThumbnail(progress) {
  let thumbnail = akiThumbnail[0];
  if (progress > 1) { 
    thumbnail = akiThumbnail[1]; 
  }
  if (progress > 30) { 
    thumbnail = akiThumbnail[2];
  }
  if (progress > 50) {
    thumbnail = akiThumbnail[3];
  }
  if (progress > 70) { 
    thumbnail = akiThumbnail[4];
  }
  if (progress > 90) {
    thumbnail = akiThumbnail[5];
  }
  return thumbnail;
}

module.exports.conf = {
  aliases: ["the-web-genie", "web-genie"],
  clientPerm: "EMBED_LINKS",
  authorPerm: ""
};

module.exports.help = {
  name: "akinator",
  description: "Think about a real or fictional character, I will try to guess who it is.",
  usage: "akinator",
  example: ["akinator"]
};
