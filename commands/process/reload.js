module.exports.run = async (client, message, args) => {

  var msgs = await message.channel.send('Please wait...')

  if (!args.length) return msgs.edit("Specify what you want to reload you b-baka!").then(m => m.delete(7000))
  if (!args[1]) {
    let category = ['animals', 'fun', 'info', 'music', 'nsfw', 'process', 'util']
    let name = args[0]
    if (!category.includes(args[0])) return msgs.edit(`No category found, valid category are ${category.join('\n')}`)
    client.helps.get(name.toLowerCase()).cmds.forEach(x => {
      let commands
      if (client.commands.has(x)) {
        commands = client.commands.get(x)
      }

      commands = commands.help.name
      delete require.cache[require.resolve(`../.${client.helps.get(name.toLowerCase()).path}/${x}.js`)]
      let cmds = require(`../.${client.helps.get(name.toLowerCase()).path}/${x}`)
      client.commands.delete(commands)
      if (cmds.init) cmds.init(client)
      client.aliases.forEach((cmds, alias) => {
        if (cmds === commands) client.aliases.delete(alias)
      })
      client.commands.set(commands, cmds)
      cmds.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmds.help.name)
      })
      msgs.edit(`The command **${cmds.help.name}** has been reloaded.`) // .then(x => x.delete(5000));
    })
    return msgs.edit(`The module **${client.helps.get(name.toLowerCase()).name}** has been reloaded!`)
  } else {
    try {
      let command
      if (client.commands.has(args[1])) {
        command = client.commands.get(args[1])
      } else if (client.aliases.has(args[1])) {
        command = client.commands.get(client.aliases.get(args[1]))
      }
      if (!command) return msgs.edit(`Command named **${args[1]}** was not found. Are you blind?`)
      command = command.help.name

      delete require.cache[require.resolve(`../../commands/${args[0]}/${command}.js`)]
      let cmd = require(`../../commands/${args[0]}/${command}`)
      client.commands.delete(command)
      if (cmd.init) cmd.init(client)
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias)
      })
      client.commands.set(command, cmd)
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name)
      })

      msgs.edit(`The command **${command}** has been reloaded.`)
    } catch (error) {
      return msgs.edit(`Whoops some error happened when reloading ${args[1]}: \`${error.message || error.toString()}\``)
    }
  }
}

module.exports.conf = {
  aliases: ['rl'],
  clientPerm: "",
  authorPerm: ""
}

module.exports.help = {
  name: 'reload',
  description: 'Reloads a command that\'s been modified.',
  usage: 'reload <category> <command>',
  example: ["reload ping"]
}