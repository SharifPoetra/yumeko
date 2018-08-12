const { RichEmbed, Client} = require('discord.js');

exports.run = async (client, msg, args) => {
	if(args.length < 1) return args.missing(msg, 'No token provided', this.help);
	try{
		const edMessage = await msg.channel.send('Loggin....');
		const bot = new Client();
		bot.login(args[0]);
		bot.on('ready', () => {
			const embed = new RichEmbed()
			.setColor('GREEN')
			.setDescription(`
__**Logged as ${bot.user.tag}**__
▫ Guilds : ${bot.guilds.size}
▫ Channels : ${bot.channels.size}
▫ Users : ${bot.users.size}
			`)
			.setThumbnail(bot.user.avatarURL);
			msg.channel.send(embed);
			return bot.destroy();
		});
		return undefined;
	}catch(e){
		const embed = new RichEmbed()
		.setColor('RED')
		.setTitle('🚫 An error occured')
		.setDescription(`
\`${e.code}\`
${client.util.codeblock(e.path || e.message, 'ini')}`);
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`, {embed});
	}
}

exports.conf = {
  aliases: ['ttk'],
  clientPerm: '',
  authorPerm: ''
}

exports.help = {
  name: 'testtoken',
  description: 'test token bot',
  usage: 'testtoken <token>',
  example: ['testtoken NQwerskeksk-ksnsensn']
}
