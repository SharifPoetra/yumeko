const faces = ['(・`ω´・)', ';;w;;', 'owo', 'UwU', '>w<', '^w^'];

exports.run = async (client, msg, args) => {
	try{
		args = args.join(' ') || 'What text want you to owoify?';
		args.replace(/(?:r|l)/g, 'w')
		.replace(/(?:R|L)/g, 'W')
		.replace(/n([aeiou])/g, 'ny$1')
		.replace(/N([aeiou])/g, 'Ny$1')
		.replace(/N([AEIOU])/g, 'NY$1')
		.replace(/ove/g, 'uv')
		.replace(/!+/g, ` ${faces[Math.floor(Math.random() * faces.length)]} `)
		.trim()
		return msg.channel.send(args);
	}catch(e){
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
}

exports.conf = {
  aliases: [],
  clientPerm: '',
  authorPerm: ''
}

exports.help = {
  name: 'owoify',
  description: 'make your text to owoify',
  usage: 'owoify [text]',
  example: ['owoify', 'owoify nani sore !']
}
