const { RichEmbed } = require('discord.js');
const { get } = require('node-superfetch');
const { load } = require('cheerio');

let link = {}; //chace the link

exports.run = async (client, msg, args) => {
	if(args.length < 1) return args.missing(msg, 'No link provided', this.help);
	try{
		const html = await getHtml(args[0]);
		const $ = load(html);
		let evaled = eval(args[0] || '$');
		evaled = require('util').inspect(evaled);
		evaled = client.util.codblock(evaled, 'xl');
		if(evaled.length < 1024) evaled = await client.util.hastebin(evaled);
		const embed = new RichEmbed()
		.setColor('GREEN')
		.setTitle('🔍 jQuery Selector Loader')
		.setDescription(evaled)
		return msg.channel.send(embed);
	}catch(e){
		const embed = new RichEmbed()
		.setColor('RED')
		.setTitle('🚫 An Ewwo Occuwed >w<')
		.setDescription(client.util.codeblock(e.stack, 'ini'));
		return msg.channel.send(embed);
	}
}

async function getHtml(url){
	try{
		if(link[url]) return link[url];
		const { text } = await get(url);
		link[url] = text;
		return text;
	}catch(e){
		throw e;
	}
}

exports.conf = {
  aliases: ['cheer', 'jq'],
  clientPerm: '',
  authorPerm: ''
}

exports.help = {
  name: 'jquery',
  description: 'load html and select with jQuery',
  usage: 'jquery <link> [selector]',
  example: ['jquery https://minecraft.net', 'jquery https://minecraft.net $(\'title\')']
}
