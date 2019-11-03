module.exports.run = async (client, msg, args) => {
  const serverQueue = client.queue.get(msg.guild.id);
  if (!msg.member.voiceChannel) return msg.channel.send("You must join voice channel first");
  if (serverQueue.voiceChannel.id !== msg.member.voiceChannel.id) return msg.channel.send(`You must be in **${serverQueue.voiceChannel.name}** to loop the queue`);
  if (!serverQueue) return msg.channel.send("Are you sure? nothing to loop because queue is empty");
  try {
    serverQueue.loop = !serverQueue.loop;
    if (serverQueue.loop) return msg.channel.send("loop is on");
    return msg.channel.send("loop is off");
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
  name: "loop",
  description: "loop the current queue",
  usage: "loop",
  example: ["loop"]
};
