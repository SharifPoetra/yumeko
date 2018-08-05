const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
	if(args.length < 1) return args.missing(msg, 'No query Provided', this.help);
	try{
		const search = await client.snek.get('https://store.steampowered.com/api/storesearch')
		.query({
			cc: 'us',
			l: 'en',
			term: args.join('+')
		});
		if (!search.body.items.length) return msg.channel.send('🚫Could not find any results.');
		const { id, tiny_image } = search.body.items[0];
		const { body } = await client.snek.get('https://store.steampowered.com/api/appdetails')
		.query({ appids: id });
		const { data } = body[id.toString()];
		const current = data.price_overview ? `$${data.price_overview.final / 100}` : 'Free';
		const original = data.price_overview ? `$${data.price_overview.initial / 100}` : 'Free';
		const price = current === original ? current : `~~${original}~~ ${current}`;
		const platforms = [];
		if (data.platforms) {
			if (data.platforms.windows) platforms.push('Windows');
			if (data.platforms.mac) platforms.push('Mac');
			if (data.platforms.linux) platforms.push('Linux');
		}
		const embed = new RichEmbed()
		.setColor('#101D2F')
		.setAuthor('Steam', 'https://i.imgur.com/xxr2UBZ.png', 'http://store.steampowered.com/')
		.setTitle(data.name)
		.setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
		.setImage(data['header_image'])
		.addField('💰 Price', price, true)
		.addField('✴️ Metascore', data.metacritic ? data.metacritic.score : '???', true)
		.addField('🔹 Recommendations', data.recommendations ? data.recommendations.total : '???', true)
		.addField('💻 Platforms', platforms.join(', ') || 'None', true)
		.addField('📅 Release Date', data.release_date ? data.release_date.date : '???', true)
		.addField('🔗 DLC Count', data.dlc ? data.dlc.length : 0, true)
		.addField('👥 Developers', data.developers ? data.developers.join(', ') || '???' : '???')
		.addField('📢 Publishers', data.publishers ? data.publishers.join(', ') || '???' : '???');
		return msg.channel.send(embed);
	}catch(e){
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
}

exports.conf = {
  aliases: [],
  clientPerm: 'EMBED_LINKS',
  authorPerm: ''
}

exports.help = {
  name: 'steam',
  description: 'Search game or app in steam',
  usage: 'steam <query>',
  example: ['steam csgo']
}