const { RichEmbed } = require('discord.js');
const { load } = require('cheerio');
const number = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣'];

exports.run = async (client, msg, args) => {
	if(!args.length) return args.missing(msg, 'No query provided', this.help);
	try{
		const embed = new RichEmbed()
		embed.setColor('#00D2FF');
		const { body } = client.snek.get('https://api.genius.com/search')
		.query({ q: encodeURIComponent(args.join(' ')) })
		.set('Authorization', `Bearer ${process.env.GENIUS}`);
		if(!body.response.hits.length) return msg.channel.send('🚫 No result found');
		const result = body.response.hits.splice(0, 5);
		const thisMess = await msg.channel.send(embed.setDescription(result.map((x, i) => `${number[i]}[${x.result.full_title](${x.result.url})`).join('\n')));
		for(let i = 0; i < result.length; i++){
			await thisMess.react(number[i]);
		}
		const filter = (rect, usr) => number.includes(rect.emoji.name) && usr.id === msg.author.id
		const response = await thisMess.awaitReactions(filter, {
			max: 1,
			time: 15000
		});
		if(!response.size){
			return thisMess.edit('you took to long to reply!', {});
		}
		const choice = number.indexOf(response.first().emoji.name);
		const { text } = await client.snek.get(result[choice].result.url);
		embed.setTitle(result[choice].result.full_title);
		embed.setURL(result[choice].result.url);
		embed.setThumbnail(result[choice].result.header_image_thumbnail_url);
		embed.setDescription(load(text)('.lyrics').text().trim())
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
  name: 'lyrics',
  description: 'Search lyrics',
  usage: 'lyrics <query>',
  example: ['lyrics shape of you']
}
