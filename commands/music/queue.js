const { RichEmbed } = require("discord.js");
const { getTime, getProgressBar } = require("./nowplay.js");

exports.run = async (client, msg, args) => {
  try {
    const serverQueue = client.queue.get(msg.guild.id);
    if (!serverQueue) return msg.channel.send("Not playing anything right now");
    const progBar = getProgressBar(serverQueue);
    const cur = getTime(serverQueue);
    let queue = [];
    serverQueue.songs.forEach((x, i) => {
      if (i !== 0) {
        queue.push(x);
      }
    });
    const embed = new RichEmbed().setColor("RANDOM");
    if (!queue || queue.length < 1) return msg.channel.send(`🎶** | Now playing ${serverQueue.songs[0].title}**\n▶${progBar} \`${cur}\`🔉`, { embed: embed.setDescription("**No songs in queue**") });
    if (queue.length > 10) {
      let index = 0;
      queue = queue.map((x, i) => `\`${i + 1}\`. __**[${x.title}](${x.url})**__ **by** ${x.requester.toString()}`);
      queue = client.util.chunk(queue, 10);
      embed.setDescription(queue[index].join("\n"));
      embed.setFooter(`Page ${index + 1} of ${queue.length}`);
      const queueMess = await msg.channel.send(`🎶 ** | Now playing ${serverQueue.songs[0].title}**\n▶${progBar} \`${cur}\`🔉\n\n🎶 Current queue | ${serverQueue.songs.length - 1} entries`, { embed: embed });
      await queueMess.react("⬅");
      await queueMess.react("➡");
      awaitReactions();
      function awaitReactions() {
        const filter = (rect, usr) => ["⬅", "➡"].includes(rect.emoji.name) && usr.id === msg.author.id;
        queueMess.createReactionCollector(filter, { time: 30000, max: 1 })
          .on("collect", col => {
            if (col.emoji.name === "⬅") index--;
            if (col.emoji.name === "➡") index++;
            index = ((index % queue.length) + queue.length) % queue.length;
            embed.setDescription(queue[index].join("\n"));
            embed.setFooter(`Page ${index + 1} of ${queue.length}`);
            queueMess.edit(`🎶 ** | Now playing ${serverQueue.songs[0].title}**\n▶${progBar} \`${cur}\`🔉\n\n🎶 Current queue | ${serverQueue.songs.length - 1} entries`, { embed: embed });
            return awaitReactions();
          });
      }
    } else {
		 embed.setDescription(queue.map((x, i) => `\`${i + 1}\`. __**[${x.title}](${x.url})**__ **by** ${x.requester.toString()}`).join("\n"));
		 return msg.channel.send(`🎶 ** | Now playing ${serverQueue.songs[0].title}**\n▶${progBar} \`${cur}\`🔉\n\n🎶 Current queue | ${serverQueue.songs.length - 1} entries`, { embed: embed });
    }
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`\`\`${e.stack}\`\`\`try again later`);
  }
};

exports.conf = {
  aliases: ["q"],
  clientPerm: "",
  authorPerm: ""
};

exports.help = {
  name: "queue",
  description: "Show the current queue",
  usage: "queue",
  example: ["queue"]
};
