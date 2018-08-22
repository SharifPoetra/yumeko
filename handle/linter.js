const linter = new (require('eslint').Linter)();
const { RichEmbed } = require('discord.js');
const bmsg = require('../assets/json/bad-message.json');
const no = require('../assets/json/nodetect-js.json');

module.exports = async msg => {
	if(no.includes(msg.guild.id)) return undefined;
	const input = msg.content.match(/```(js)?(.|\s)+```/gi)[0].replace(/```(js|javascript)?|```/gi, '').trim();
	const code = /\bawait\b/i.test(input) ? `(async function(){ \n${input}\n})()` : input;
	const errors = linter.verify(code, require('../assets/json/eslint-default.json'));
	if(errors.length < 1) return msg.react('✅');
	await msg.react('❌');
	msg.react('🔎');
	const errs = [];
	for(let e of errors){
		errs.push(`- [${e.line}:${e.column}] ${e.message}`);
	}
	
	const filter = (rect, user) => rect.emoji.name === '🔎' && user.id === msg.author.id;
	return msg.createReactionCollector(filter, { max: 1, time: 60000 })
	.on('collect', col => {
		const embed = new RichEmbed()
		.setColor('#FF0000')
		.addField('🚫 Errors', `\`\`\`diff\n${errs.join('\n')}\`\`\``)
		.addField('🔗Annotated Code', `\`\`\`${annotate(code, errors)}\`\`\``);
		msg.channel.send(bmsg[Math.floor(Math.random()*bmsg.length)-1], {embed: embed});
	});
}

function annotate(code, errors){
	let final = '';
	for (const error of errors) {
		const line = code.split('\n')[error.line - 1];
		const annotation = `${' '.repeat(error.column - 1)}^ `;
		const reason = `[${error.line}:${error.column}] ${error.message}`;
		final = `${final}${line}\n${annotation}\n${reason}`;
	}
	return final;
}
