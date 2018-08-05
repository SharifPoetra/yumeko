const { RichEmbed } = require('discord.js');
const Turndown = require('turndown');

exports.run = async (client, msg, args) => {
	if(args.length < 1) return args.missing(msg, 'No query provided', this.help);
	const query = args.join('+').replace(/#/g, '.prototype.');
	try{
		const { body } = await client.snek.get('https://mdn.topkek.pw/search')
		.query({ q: query });
		if (!body.URL || !body.Title || !body.Summary) return msg.channel.send('🚫 **No result found**');
		const td = new Turndown();
		td.addRule('hyperlink', {
			filter: 'a',
			replacement: (text, node) => `[${text}](https://developer.mozilla.org${node.href})`
		});
		const embed = new RichEmbed()
		.setColor('#066FAD')
		.setAuthor('MDN', 'https://i.imgur.com/DFGXabG.png', 'https://developer.mozilla.org/')
		.setURL(`https://developer.mozilla.org${body.URL}`)
		.setTitle(body.Title)
		.setDescription(td.turndown(body.Summary));
		return msg.channel.send(embed);
	}catch(e){
		return msg.channel.send(`Oh no an error occured :( \`\`\`ini\n${e.stack}\`\`\``);
	}
}

exports.conf = {
  aliases: [],
  clientPerm: '',
  authorPerm: ''
}

exports.help = {
  name: 'mdn',
  description: 'resource for developer form developer',
  usage: 'mdn <query>',
  example: ['mdn Array#concat']
}