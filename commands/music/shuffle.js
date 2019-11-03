const { RichEmbed } = require("discord.js");

module.exports.run = async (client, msg, args) => {
  try {
    const serverQueue = client.queue.get(msg.guild.id);
    if (!serverQueue) return msg.channel.send("Are you sure ? the queue is empty");
    if (serverQueue.songs.length < 3) return msg.channel.send("You must add some songs first!");
    if (!msg.member.voiceChannel) return msg.channel.send("You must join voice channel first");
    if (msg.member.voiceChannel.id !== serverQueue.voiceChannel.id) return msg.channel.send(`You must go to **${serverQueue.voiceChannel.name}** to shuffle the queue`);
    const np = serverQueue.songs.shift();
    const shuffled = client.util.shuffle(serverQueue.songs);
    shuffled.unshift(np);
    serverQueue.songs = shuffled;
    return msg.channel.send("🔀 **Shuffled**");
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

module.exports.conf = {
  aliases: ["sf"],
  clientPerm: "",
  authorPerm: ""
};

module.exports.help = {
  name: "shuffle",
  description: "shuffle current queue",
  usage: "shuffle",
  example: ["shuffle"]
};
