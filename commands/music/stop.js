module.exports.run = async (client, msg, args) => {
  try {
    const serverQueue = client.queue.get(msg.guild.id) || client.listenMOE.get(msg.guild.id);
    if (!msg.member.voice.channel) return msg.channel.send("You must join voice channel first");
    if (!serverQueue) return msg.channel.send("Im not playing anything right now");
    if (serverQueue.voiceChannel.id !== msg.member.voice.channel.id) return msg.channel.send(`You must be in **${serverQueue.voiceChannel.name}** to stop the song`);
    msg.channel.send(`🛑 Stop the current Queue`);
    serverQueue.songs = [];
    serverQueue.endReason = "stop";
    serverQueue.connection.dispatcher.end();
    return client.listenMOE.delete(msg.guild.id);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

module.exports.conf = {
  aliases: [],
  clientPerm: "",
  authorPerm: ""
};

module.exports.help = {
  name: "stop",
  description: "stop the queue",
  usage: "stop",
  example: ["stop"]
};
