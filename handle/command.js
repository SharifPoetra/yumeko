const { prefix, owners } = require("../config.json");
const { RichEmbed } = require("discord.js");

module.exports = (client, msg) => {
  const PREFIX = msg.content.startsWith(prefix) ? prefix : `${client.user.toString()} `;
  const args = msg.content.slice(PREFIX.length).trim().split(/ +/g);
  const command = args.shift();
  args.missing = argsMissing;

  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  }
  if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (!cmd) return undefined;
  if (!owners.includes(msg.author.id) && cmd.conf.module.hide === true) return undefined;
  if (cmd.conf.clientPerm.length > 0 && !msg.guild.me.hasPermission(cmd.conf.clientPerm)) return msg.channel.send(`❌ **Sorry but i don't have permissions** __**${cmd.conf.clientPerm}**__`).then(x => x.delete(60000));
  if (cmd.conf.authorPerm.length > 0 && !msg.member.hasPermission(cmd.conf.authorPerm)) return msg.channel.send(`❌ **Sorry but you don't have permissions** __**${cmd.conf.authorPerm}**__`).then(x => x.delete(60000));
  cmd.run(client, msg, args);
};

function argsMissing(msg, res, help) {
  const embed = new RichEmbed()
    .setColor("#FF1000")
    .setTitle(`🚫 It's not how you use ${help.name}`)
    .addField("❓Reason", `\`\`\`${res}\`\`\``)
    .addField("<:commandJS:480697097629204492> Usage", `\`\`\`${help.usage}\`\`\``)
    .addField("📂 Example", help.example.map(x => `\`\`\`${x}\`\`\``));
  return msg.channel.send(embed);
}
