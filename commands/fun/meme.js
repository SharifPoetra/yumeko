const { RichEmbed } = require('discord.js');
const subReddits = ['crappydesign', 'dankmemes', 'me_irl', 'wholesomememes', 'memeeconomy'];

exports.run = async (client, msg, args) => {
	try{
		let img = await client.util.scrapeSubreddit(subReddits[Math.floor(Math.random() * subReddits.length)]);
		if(!img) return msg.channel.send('The image cannot be fetched. Try again ❕');
		if (img.indexOf(".mp4")) img = await client.util.scrapeSubreddit(subReddits[Math.floor(Math.random() * subReddits.length)]);
		const embed = new RichEmbed()
		.setColor('RANDOM')
		.setURL(img)
		.setImage(img)
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
  name: 'meme',
  description: 'Show random meme',
  usage: 'meme',
  example: ['meme']
}
