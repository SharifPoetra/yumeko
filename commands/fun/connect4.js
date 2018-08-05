const { RichEmbed } = require('discord.js');
const numbers = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '⏹'];
const sessions = new Map();
const Connect4 = require('../../handle/game/connect4.js');

exports.run = async (client, msg, args) => {
	const user = msg.mentions.members.first();
	if(!user) return args.missing(msg, 'No user provided', this.help);
	try{
		const c4 = new Connect4()
		if(sessions.has(msg.channel.id)) return msg.channel.send('Only 1 game may occuring per channel');
		if(user.bot) return msg.channel.send('You can\'t play with bot');
		if(user.id === msg.author.id) return msg.channel.send('You can\'t play lonely :(');
		const m = await msg.channel.send(`${user.toString()} Are you accept the challenge?`);
		const check = await awaitReactions(user, m);
		if(!check) return m.edit('Look like they declined');
		await m.delete();
		const c4Mess = await msg.channel.send('Loading board....');
		c4.startGame(msg, user);
		sessions.set(msg.channel.id, true);
		await c4.initialReact(c4Mess);
		return handleProgress(client, c4Mess, c4);
	}catch(e){
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
}

async function handleProgress(client, msg, c4) {
	const { players, choice, table } = c4;
	const usr = players[choice % 2];
	await msg.edit(c4.turnTable());
	msg.awaitReactions((r, user) => user.id === usr && numbers.includes(r.emoji.toString()), { time: 60000, max: 1, errors: ['time'] })
	.then(async reactions => {
		const res = reactions.first();
		if (res.emoji.name === '⏹') {
			await msg.edit(`${client.users.get(usr).toString()} has decided to quit. He loses!\n${c4.getTable()}`);
			c4.reset();
			return sessions.delete(msg.channel.id);
		}
		const column = numbers.indexOf(res.emoji.name);
		if (!c4.checkColumnPossible(column)) return handleProgress(client, msg, c4);
		c4.updateTable(usr, column);
		const win = c4.check(usr);
		if (win) {
			const output = `${client.users.get(usr).toString()} won!\n\n${c4.getTable()}`;
			c4.reset();
			sessions.delete(msg.channel.id);
			return msg.edit(output);
	}
		const draw = c4.checkNoMove();
		if (draw) {
			const output = `DRAW !\n${c4.getTable()}`;
			c4.reset();
			sessions.delete(msg.channel.id);
			return msg.edit(output);
		}
		c4.choice += 1;
		handleProgress(client, msg, c4);
	})
	.catch(e => {
		c4.reset();
		sessions.delete(msg.channel.id);
		return msg.edit(`${client.users.get(usr)} TIME IS OUT!\n${c4.getTable()}`);
	});
}

async function awaitReactions(user, msg){
	await msg.react('🇾');
	await msg.react('🇳');
	const data = await msg.awaitReactions(reaction => reaction.users.has(user.id), { time: 30000, max: 1 });
	if (data.firstKey() === '🇾') return true;
	return false;
}

exports.conf = {
  aliases: ['c4'],
  clientPerm: '',
  authorPerm: ''
}

exports.help = {
  name: 'connect4',
  description: 'Play a game of connect 4.',
  usage: 'connect4 @user',
  example: ['connect4 @OwO#2728']
}