exports.run = async (client, msg, args) => {
	try{
		args = args.join(' ') || 'What text want you to reversed?';
		let reversed = '';
		for(let i = args.length-1; i >= 0; i--){
			reversed += args[i];
		}
		return msg.channel.send(reversed);
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
  name: 'reversed',
  description: 'make your text to reversed',
  usage: 'reversed [text]',
  example: ['reversed', 'reversed nani sore !']
}
