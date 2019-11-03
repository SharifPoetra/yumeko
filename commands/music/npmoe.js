const { RichEmbed, Util } = require("discord.js");

exports.run = async (client, msg, args) => {
  const serverRadio = client.listenMOE.get(msg.guild.id);
  if (!serverRadio) return msg.channel.send("I'm not currently play listen.moe");
  try {
    const radioInfo = serverRadio.region === "JP" ? client.radioInfo : client.radioInfoKpop;
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setThumbnail(radioInfo.event ? radioInfo.eventCover : radioInfo.albumCover)
      .setAuthor(radioInfo.songName, radioInfo.albumCover, "https://listen.moe")
      .addField(`✒️ ${radioInfo.artistCount > 1 ? "Artists" : "Artist"}`, Util.escapeMarkdown(radioInfo.artistList))
      .addField("💿 Album", radioInfo.albumName ? Util.escapeMarkdown(radioInfo.albumName) : "None")
      .addField("📩 Requested", radioInfo.event ? Util.escapeMarkdown(radioInfo.eventName) : radioInfo.requestedBy ? Util.escapeMarkdown(radioInfo.requestedBy) : "None")
      .addField("🎧 Listener(s)", `${radioInfo.listeners} listener(s)`);
    return msg.channel.send(embed);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

exports.conf = {
  aliases: [],
  clientPerm: "EMBED_LINKS",
  authorPerm: ""
};

exports.help = {
  name: "npmoe",
  description: "Show currently playing in listen.moe",
  usage: "npmoe",
  example: ["npmoe"]
};
