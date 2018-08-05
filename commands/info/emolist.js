const { RichEmbed } = require('discord.js');
const emojis = ['⏪', '◀', '▶', '⏩'];

exports.run = async (client, msg, args) => {
	try{
		let emojis = msg.content.includes('--all') ? client.emojis : msg.guild.emojis;
		emojis = emojis.map(x => `<:${x.name}:${x.id}> | \`<:${x.name}:${x.id}>\``);
		const chunks = client.util.chunk(emojis);
		let index = 0;
		const embed = new RichEmbed()
		.setColor('RANDOM')
		.setDescription(chunks[index].join('\n'))
		.setFooter(`Page ${index+1} of ${chunks.length}`);
		function awaitReactions (m) {
			const filter = (rect, usr) => emojis.includes(rect.emoji.name) && usr.id === msg.author.id;
			m.createReactionCollector(filter, {time: 30000, max: 1})
			.on('collect', col => {
				const emo = col.first().emoji.name;
				if(emo === emojis[0]) index -= 10;
				if(emo === emojis[1]) index--;
				if(emo === emojis[2]) index++;
				if(emo === emojis[3]) index += 10;
				index = ((index % chunks.length) + chunks.length) % chunks.length;
				embed.setDescription(chunks[index].join('\n'));
				embed.setFooter(`Page ${index+1} of ${chunks.length}`);
				m.edit(embed);
				return awaitReactions(m);
			});
		}
		const thisMess = await msg.channel.send('Loading...');
		for(const emo of emojis){
			await thisMess.react(emo);
      console.log(emo);
		}
		return awaitReactions(thisMess);
	}catch(e){
		msg.channel.send(`Oh no an error occured :( \`${client.util.codeblock(e.stack, 'ini')}\` try again later`);
    return console.error(e);
	}
}

exports.conf = {
  aliases: [],
  clientPerm: '',
  authorPerm: ''
}

exports.help = {
  name: 'emolist',
  description: 'Look list emojis',
  usage: 'emolist',
  example: ['emolist', 'emolist --all']
}