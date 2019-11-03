const { RichEmbed } = require("discord.js");
const choice = {
  "🇯🇵": "JP",
  "🇰🇷": "KR"
};

exports.run = async (client, msg, args) => {
  const voiceChannel = msg.member.voiceChannel;
  if (!voiceChannel) return msg.channel.send("You must join voiceChannel first");
  if (client.queue.has(msg.guild.id)) return msg.channel.send("Woop the queue is not empty. wait to finish it or stop it");
  if (client.listenMOE.has(msg.guild.id)) return msg.channel.send("Im currently playing");
  const permissions = voiceChannel.permissionsFor(msg.client.user);
  if (!permissions.has("CONNECT")) return msg.channel.send("🚫 I don't have permissions **CONNECT**");
  if (!permissions.has("SPEAK")) return msg.channel.send("🚫 I don't have permissions **SPEAK**");
  try {
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`
__**React 🇯🇵**__
To play listen.moe JP
__**React 🇰🇷**__
To play listen.moe KR`);
    const m = await msg.channel.send(embed);
    await m.react("🇯🇵");
    await m.react("🇰🇷");
    const filter = (res, user) => ["🇯🇵", "🇰🇷"].includes(res.emoji.name) && user.id === msg.author.id;
    const choices = await m.awaitReactions(filter, { time: 30000, max: 1 });
    await handleMOE(client, choice[choices.first().emoji.name], voiceChannel);
    await m.delete();
    embed.setDescription("<:listenMoe:473645696155779082> **Now Streaming [LISTEN.moe](https://listen.moe)**. Check the **Now Playing** with the command `npmoe`");
    return msg.channel.send(embed);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

async function handleMOE(client, region, voiceChannel) {
  const structure = {
    voiceChannel: voiceChannel,
    connection: null,
    region: region,
    link: region === "JP" ? "https://listen.moe/stream" : "https://listen.moe/kpop/stream"
  };
  structure.connection = await voiceChannel.join();
  client.listenMOE.set(voiceChannel.guild.id, structure);
  return play(client, client.listenMOE.get(voiceChannel.guild.id));
}

function play(client, serverRadio) {
  serverRadio.connection.playStream(serverRadio.link)
    .on("end", res => {
      serverRadio.voiceChannel.leave();
      client.listenMOE.delete(serverRadio.voiceChannel.guild.id);
    });
  client.on("voiceStateUpdate", (x, i) => {
    const members = serverRadio.voiceChannel.members.array().filter(x => !x.user.bot);
    if (members.length < 1) {
      return setTimeout(() => { serverRadio.connection.dispatcher.end(); }, 5000);
    }
  });
}

exports.conf = {
  aliases: [],
  clientPerm: "",
  authorPerm: ""
};

exports.help = {
  name: "playmoe",
  description: "Play radio stream in listen.moe",
  usage: "playmoe",
  example: ["playmoe"]
};
