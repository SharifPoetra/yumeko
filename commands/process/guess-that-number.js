const { RichEmbed } = require('discord.js');
const sessions = new Set();

exports.run = async (client, msg, args) => {
	if(sessions.has(msg.channel.id)) return msg.channel.send('Only 1 game may occuring per channel');
	try{
		sessions.add(msg.channel.id);
		const number = Math.floor(Math.random()*100);
		msg.reply('You have 10 passes and 15 seconds to guess it!');
		return handleGuessThatNumber(msg, number);
	}catch(e){
		sessions.delete(msg.channel.id);
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
}

let prog = 0;
function handleGuessThatNumber(msg, number){
	if(prog > 9){
    prog = 0;
    return msg.reply(`Too bad.... it was \`${number}\``);
  }
	const filter = (message) => (!isNaN(message.content) || message.content === 'end') && message.author.id === msg.author.id;
	const m = msg.channel.createMessageCollector(filter,{time: 15000, max:1});
	m.on('collect', col => {
		if(col.first().content === 'end') return m.end('lose');
		const choice = parseInt(col.first().content, 10);
		if(choice > number){
			msg.channel.send('The number is lower that');
			prog++;
			return handleGuessThatNumber(msg, number);
		}
		if(choice < number){
			msg.channel.send('The number is greather than');
			prog++;
			return handleGuessThatNumber(msg, number);
		}
		if(choice === number){
			return m.end('win');
		}
	});
	m.on('end', reason => {
    prog = 0;
		sessions.delete(msg.channel.id);
		if(reason === 'lose') return msg.reply(`Too bad.... it was \`${number}\``);
		if(reason === 'win') return msg.reply(`You won!. it was \`${number}\``);
		return msg.reply(`? Time is OUT ! it was \`${number}\``);
	});
}

exports.conf = {
  aliases: ['gtn'],
  clientPerm: '',
  authorPerm: ''
}

exports.help = {
  name: 'guess-that-number',
  description: 'Play a gams Guess That Number',
  usage: 'guess-that-number',
  example: ['guess-that-number']
}