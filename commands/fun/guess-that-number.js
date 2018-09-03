const { RichEmbed } = require('discord.js');
const sessions = new Set();

exports.run = async (client, msg, args) => {
	if(sessions.has(msg.channel.id)) return msg.channel.send('Only 1 game may occuring per channel');
	try{
		const thatNumber = Math.floor(Math.random()*100);
		let progres = 10;
		let isWin = false;
		let ans = '❓ Guess started!';
		while(progres > 0 && !isWin){
			await msg.channel.send(`${ans}\nYou have \`${progres}\` chance now!`);
			const filter = msgs => (msgs.content.toLowerCase === 'end' || !isNaN(msgs.content)) && msgs.author.id === msg.author.id;
			const response = await msg.channel.awaitMessages(filter, { max: 1, time: 15000 });
			if(!response.size){
				await msg.channel.send('⏱️ Sorry time is Up');
				break;
			}
			if(response.first().content.toLowerCase === 'end') break;
			const choice = parseInt(response.first().content, 10);
			if(choice < thatNumber) ans = '🔺 That number is higher than!';
			if(choice > thatNumber) ans = '🔻 That number is lower than!';
			if(choice === thatNumber) isWin = true;
			progres--;
		}
		if(isWin) return msg.channel.send(`You won!, it was \`${thatNumber}\``);
		return msg.channel.send(`Too bad it was \`${thatNumber}\``);
	}catch(e){
		sessions.delete(msg.channel.id);
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
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
