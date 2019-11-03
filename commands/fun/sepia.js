const { Attachment } = require("discord.js");
const { Canvas, sepia } = require("canvas-constructor");
const { loadImage } = require("canvas");

module.exports.run = async (client, msg, args) => {
  let user = msg.mentions.users.first() || client.users.get(args[0]);
  if (!user) user = msg.author;
  try {
    const paintMess = await msg.channel.send("🖌️ Painting...");
    const png = user.avatarURL.replace(/\.gif/g, ".png");
    const { body } = await client.snek.get(png);
    const avatar = await loadImage(body);
    let newSepia = new Canvas(avatar.width, avatar.height)
      .addRect(0, 0, avatar.width, avatar.height)
      .setColor("#000000")
      .addImage(body, 0, 0, avatar.width, avatar.height);
    newSepia = sepia(newSepia)
      .toBuffer();
    await paintMess.delete();
    return msg.channel.send(new Attachment(newSepia, "sepia.png"));
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

module.exports.conf = {
  aliases: [],
  clientPerm: "ATTACH_FILES",
  authorPerm: ""
};

module.exports.help = {
  name: "sepia",
  description: "Draws an user's avatar in sepia.",
  usage: "sepia [@user | id ]",
  example: ["sepia", "sepia @yumeko", "sepia 203733537282929"]
};
