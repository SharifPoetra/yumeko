const { Attachment } = require('discord.js');

exports.run = async (client, msg, args) => {
	args = args.join(' ').split('--').map(x => decodeURIComponent(x));
	if(!args[0]) return args.missing(msg, 'No type provided', this.help);
	if(!args[1]) return args.missing(msg, 'No top text provided', this.help);
	if(!args[2]) return args.missing(msg, 'No bottom text provided', this.help);
	try{
		const { body: search } = await client.snek.get(`https://memegen.link/api/search/${args[0]}`);
		if(!search.length) return msg.channel.send(`Could not find meme with type \`${args[0]}\``);
		const { body } = await client.snek.get(search[0].template.blank.replace(/\/_/, `/${args[1]}/${args[2]}`));
		return msg.channel.send(new Attachment(body, 'meme.jpg'));
	}catch(e){
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
}

exports.conf = {
  aliases: ['memegen'],
  clientPerm: 'ATTACH_FILES',
  authorPerm: ''
}

exports.help = {
  name: 'creatememe',
  description: 'Sends a meme with the text and background of your choice.',
  usage: 'creatememe <type> --<top text> --<bottom text>',
  example: ['creatememe spongebob --you are --pekok']
}
