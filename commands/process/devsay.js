const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
	try{
		if(args.length < 2) return args.missing(msg, 'Check you missing something', this.help);
		const user = client.users.get(args[0]);
		if(!user) return msg.channel.send('No user with id '+ args[0]);
		msg.channel.send('Msg sended!');
		return user.send(args.slice(1).join(' '));
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
  name: 'devsay',
  description: 'Say as dev',
  usage: 'devsay <id> <message>',
  example: ['devsay 20393722829 yo']
}