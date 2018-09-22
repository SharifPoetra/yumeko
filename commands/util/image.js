const { RichEmbed } = require('discord.js');
const choiches = ['⏪', '⬅', '🔁', '➡', '⏩'];

exports.run = async (client, msg, args) => {
	if(!msg.channel.nsfw) return msg.channel.send('🚫 For some reason this command can only work in NSFW channel');
	if(!args.length) return args.missing(msg, 'No query provided', this.help);
	try{
		const { text } = await client.snek.get('https://www.google.co.uk/search')
		.query({
			q: encodeURIComponent(args.join(' ')),
			tbm: 'isch',
			safe: 'strict'
		}) // owner this test from Sharif 
		.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0');
		const image = text.match(/"ou":"([^"]*)"/g).map(i => i.slice(6, -1));
		let index = 0;
		const embed = new RichEmbed()
		.setColor('RANDOM')
		.setDescription(`Image **${index+1}** of **${image.length}**\n⬇__**[link here](${image[index]})**__`)
		.setImage(image[index]);
		const thisMess = await msg.reply(embed);
		for(const choiche of choiches){
			await thisMess.react(choiche);
		}
		async function awaitReaction(){
			const filter = (rect, usr) => choiches.includes(rect.emoji.name) && usr.id === msg.author.id;
			const response = await thisMess.awaitReactions(filter, { max: 1, time: 30000 });
			if(!response.size) return undefined;
			const emo = response.first().emoji.name;
			if(emo === '⏪') index -= 10;
			if(emo === '⬅') index--;
			if(emo === '🔁') index = Math.floor(Math.random()*image.length);
			if(emo === '➡') index++;
			if(emo === '⏩') index += 10;
			index = ((index % image.length) + image.length) % image.length;
			embed.setDescription(`Image **${index+1}** of **${image.length}**\n⬇__**[link here](${image[index]})**__`);
			embed.setImage(image[index]);
			thisMess.edit(msg.author.toString(), { embed });
			return awaitReaction(); 
		}
		return awaitReaction();
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
  name: 'image',
  description: 'search image with given query',
  usage: 'image <query>',
  example: ['image yumeko jabami']
}
