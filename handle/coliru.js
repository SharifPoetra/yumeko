const snek = require('node-superfetch');
const { hastebin } = require('./util.js');

module.exports = async msg => {
	const src = msg.content.match(/```(cpp)?(.|\s)+```/gi)[0].replace(/```(cpp)?|```/gi, '').trim();
	let { text } = await snek.post('http://coliru.stacked-crooked.com/compile')
	.send({
		cmd: 'g++ main.cpp && ./a.out',
		src
	});
	text = client.util.codeblock(text, 'diff');
	if(text.length > 2000) text = await hastebin(text);
	await msg.react('480697097629204492');
	const filter = (rect, usr) => rect.emoji.id === '480697097629204492' && usr.id === msg.author.id;
	const response = await msg.awaitReactions(filter,{
		max: 1,
		time: 60000
	});
	if(!response.size) return undefined;
	return msg.reply(text);
}
