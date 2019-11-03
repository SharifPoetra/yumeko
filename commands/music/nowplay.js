const { RichEmbed } = require("discord.js");

exports.run = async (client, msg, args) => {
  try {
    const serverQueue = client.queue.get(msg.guild.id);
    if (!serverQueue) return msg.channel.send("Not Playing anything right now");
    const progBar = this.getProgressBar(serverQueue);
    const dur = this.getTime(serverQueue);
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setAuthor(serverQueue.songs[0].requester.tag, serverQueue.songs[0].requester.avatarURL)
      .setTitle(serverQueue.songs[0].title)
      .setURL(serverQueue.songs[0].url)
      .setThumbnail(serverQueue.songs[0].thumbnail)
      .setDescription(`▶ ${progBar} \`${dur}\`🔊`);
    return msg.channel.send(embed);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

exports.getProgressBar = serverQueue => {
  const duration = (serverQueue.songs[0].duration.minutes * 60000) + ((serverQueue.songs[0].duration.seconds % 60000) * 1000);
  const percent = serverQueue.connection.dispatcher.time / duration;
  const num = Math.floor(percent * 12);
  let str = "";
  for (let i = 0; i < 12; i++) {
    str += i === num ? "🔘" : "▬";
  }
  return str;
};

exports.getTime = serverQueue => {
  const curentDurationMinute = Math.floor(serverQueue.connection.dispatcher.time / 60000) < 10 ? `0${Math.floor(serverQueue.connection.dispatcher.time / 60000)}` : Math.floor(serverQueue.connection.dispatcher.time / 60000);
  const currentDurationSeconds = Math.floor((serverQueue.connection.dispatcher.time % 60000) / 1000) < 10 ? `0${Math.floor((serverQueue.connection.dispatcher.time % 60000) / 1000)}` : Math.floor((serverQueue.connection.dispatcher.time % 60000) / 1000);
  const endDurationMinute = serverQueue.songs[0].duration.minutes < 10 ? `0${serverQueue.songs[0].duration.minutes}` : serverQueue.songs[0].duration.minutes;
  const endDurationSeconds = serverQueue.songs[0].duration.seconds < 10 ? `0${serverQueue.songs[0].duration.seconds}` : serverQueue.songs[0].duration.seconds;
  return `[${curentDurationMinute}:${currentDurationSeconds} - ${endDurationMinute}:${endDurationSeconds}]`;
};

exports.conf = {
  aliases: ["np"],
  clientPerm: "",
  authorPerm: ""
};

exports.help = {
  name: "nowplay",
  description: "Show current song playing",
  usage: "nowplay",
  example: ["nowplay"]
};
