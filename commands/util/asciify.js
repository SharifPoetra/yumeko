const { RichEmbed } = require("discord.js");
const figlet = require("figlet");

module.exports.run = async (client, msg, args) => {
  const maxLen = 14; // You can modify the max characters here

  if (args.join(" ").length > maxLen) {
    return msg.channel.send({ embed: {
      color: 0xfc0f0f,
      description: `${msg.author} Only 14 characters admitted!`
    } });
  }

  if (args.length < 1) return args.missing(msg, "No text provided", this.help);

  figlet(`${args.join(" ")}`, (err, data) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }

    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`\`\`\`${data}\`\`\``, { code: "AsciiArt" });

    msg.channel.send(embed);
  });
};

module.exports.conf = {
  aliases: ["ascii", "unik"],
  clientPerm: "",
  authorPerm: ""
};

module.exports.help = {
  name: "asciify",
  description: "Convert text to ascii",
  usage: "asciify <text>",
  example: ["asciify morning"]
};
