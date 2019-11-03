const { RichEmbed } = require("discord.js");
const { owners } = require("../../config.json");

exports.run = async (client, msg, args) => { // pinjem bentar pak buat bot saya :)
  try {
    if (args.length < 1) {
      let module = client.helps.array();
      if (!owners.includes(msg.author.id)) module = client.helps.array().filter(x => !x.hide);
      const embed = new RichEmbed()
        .setColor("RANDOM")
        .setFooter("ℹ️ To get additional information use !y.help <command name>, <command name> to command what you want");
      for (const mod of module) {
        embed.addField(`${mod.emot} | ${mod.name}`, mod.cmds.map(x => `\`${x}\``).join(", "));
      }
      return msg.channel.send(embed);
    }
    let cmd;
    if (client.commands.has(args[0])) {
      cmd = client.commands.get(args[0]);
    }
    if (client.aliases.has(args[0])) {
      cmd = client.commands.get(client.aliases.get(args[0]));
    }
    if (!cmd) {
      const embed = new RichEmbed()
        .setColor("#FF1000")
        .setTitle("🚫 I don't have command like this");
      const search = client.commands.keyArray().filter(x => x.includes(args[0])).map(x => `▫ __**${x}**__`);
      search.length > 0 ? embed.setDescription(`**Are you mean this? :**\n${search.join("\n")}`) : undefined;
      return msg.channel.send(embed);
    }
    const embed = new RichEmbed()
      .setColor("RANDOM")
      .setTitle(`❗ Command info for ${cmd.help.name}`)
      .setDescription(`**${cmd.help.description}**`)
      .addField("✂️ Aliases", cmd.conf.aliases.length > 0 ? cmd.conf.aliases.map(x => `${x}`).join(", ") : "None")
      .addField("🤖 My Permission", cmd.conf.clientPerm.length > 0 ? cmd.conf.clientPerm : "None")
      .addField("👤 User Permission", cmd.conf.authorPerm.length > 0 ? cmd.conf.authorPerm : "None")
      .addField("<:commandJS:480697097629204492> Usage", cmd.help.usage)
      .addField("📂 Example", cmd.help.example.map(x => `▫ __**${x}**__`).join("\n"))
      .setFooter("ℹ️ Don't include <> or [], it's mean <> is required and [] is optional");
    return msg.channel.send(embed);
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

exports.conf = {
  aliases: ["h"],
  clientPerm: "",
  authorPerm: ""
};

exports.help = {
  name: "help",
  description: "The first command you'll typing",
  usage: "help [command]",
  example: ["help", "help ping"]
};


/*
Kolom chat ea :u
Mohon gunakan dengan bijak :u
=============================
OwO#8287 : 'Woy, jawab ea'
OwO#8287 : 'Diem diem bae :u'
Sharif#2769 : gk sopan bangsat gk izin pulak
OwO#828: ea :u
OwO#8287: Jawab ea :h
OwO#8287: akhirnya :7
=============================
*/
