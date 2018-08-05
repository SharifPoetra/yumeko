const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
	try{
		const { body } = await client.snek.get('https://randomfox.ca/floof/');
		const link = body.image;
		const embed = new RichEmbed()
		.setColor('RANDOM')
		.setURL(link)
		.setImage(link)
		.setTitle('Click here if image failed to load')
		return msg.channel.send(embed);
	}catch(e){
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
}

exports.conf = {
  aliases: [],
  clientPerm: 'EMBED_LINKS',
  authorPerm: ''
}

exports.help = {
  name: 'fox',
  description: 'Show a random fox',
  usage: 'fox',
  example: ['fox']
}