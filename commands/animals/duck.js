const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
	try{
		const { body } = await client.snek.get('https://random-d.uk/api/v1/random?type=gif');
		const link = body.url;
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
  name: 'duck',
  description: 'Show a random duck',
  usage: 'duck',
  example: ['duck']
}