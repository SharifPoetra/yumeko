exports.run = async (client, msg, args) => {
  if (args.length < 1) return args.missing(msg, "No query provided", this.help);
  let branch = args[1] || "stable";
  let project = "main";
  if (branch === "commando" || branch === "rpc") {
    project = branch;
    branch = "master";
  }
  try {
    const { body } = await client.snek.get(`https://djsdocs.sorta.moe/${project}/${branch}/embed`)
      .query({ q: args[0] });
    return msg.channel.send({ embed: body });
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

exports.conf = {
  aliases: [],
  clientPerm: "",
  authorPerm: "EMBED_LINKS"
};

exports.help = {
  name: "docs",
  description: "Search the discord.js documentation",
  usage: "docs <query> [version]",
  example: ["docs voiceConnection"]
};

