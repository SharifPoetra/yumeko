exports.run = async (client, msg, args) => {
	try{
		args = args.join(' ') || 'What text want you to clapify?';
		args.replace(/ /g, '??');
		args += '??';
		return msg.channel.send(`??${args}`);
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
  name: 'clapify',
  description: 'make your text to clapify',
  usage: 'clapify [text]',
  example: ['clapify' 'clapify nani sore !']
}