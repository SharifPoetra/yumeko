const { Collection } = require("discord.js");
const { join, resolve } = require("path");
const { readdirSync, statSync } = require("fs");

const Commands = new Collection();
const Aliases = new Collection();
const Helps = new Collection();

const modules = readdirSync("./commands/")
  .filter(x => statSync(join("./commands", x)).isDirectory());

for (const module of modules) {
  console.log(`Loading ${module} module.....`);
  const moduleConf = require(`../commands/${module}/module.json`);
  moduleConf.path = `./commands/${module}`;
  moduleConf.cmds = [];
  Helps.set(module.toLowerCase(), moduleConf);

  const commandFiles = readdirSync(resolve(`./commands/${module}`))
    .filter(x => !statSync(resolve("./commands/", module, x)).isDirectory())
    .filter(x => x.endsWith(".js"));

  for (let file of commandFiles) {
    file = file.substr(0, file.length - 3);
    console.log(`Loading ${file} command.....`);

    file = require(`../commands/${module}/${file}`);
    file.conf.module = moduleConf;
    file.conf.path = `./commands/${module}/${file}`;
    Commands.set(file.help.name.toLowerCase(), file);
    Helps.get(module.toLowerCase()).cmds.push(file.help.name);

    for (const alias of file.conf.aliases) {
      Aliases.set(alias.toLowerCase(), file.help.name);
    }
  }
}

exports.commands = Commands;
exports.aliases = Aliases;
exports.helps = Helps;
