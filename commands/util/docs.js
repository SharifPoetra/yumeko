exports.docs = {};
const request = require('node-superfetch');
const { oneLineTrim } = require('common-tags');

exports.fetchDocs = async(version) => {
	if (this.docs[version]) return this.docs[version];
	const link = version === 'commando'
			? 'https://raw.githubusercontent.com/Gawdl3y/discord.js-commando/docs/master.json'
			: `https://raw.githubusercontent.com/hydrabolt/discord.js/docs/${version}.json`;
	const { text } = await request.get(link);
	const json = JSON.parse(text);
	this.docs[version] = json;
	return json;
}

exports.search = (docs, query) => {
	query = query.split(/[#.]/g);
	const mainQuery = query[0].toLowerCase();
	let memberQuery = query[1] ? query[1].toLowerCase() : null;
	const findWithin = (parentItem, props, name) => {
		let found = null;
		for (const category of props) {
			if (!parentItem[category]) continue;
			const item = parentItem[category].find(i => i.name.toLowerCase() === name);
			if (item) {
				found = { item, category };
				break;
			}
		}
		return found;
	}
	const main = findWithin(docs, ['classes', 'interfaces', 'typedefs'], mainQuery);
	if (!main) return [];
	const res = [main];
	if (!memberQuery) return res;
	let props;
	if (/\(.*?\)$/.test(memberQuery)) {
		memberQuery = memberQuery.replace(/\(.*?\)$/, '');
		props = ['methods'];
	} else {
		props = main.category === 'typedefs' ? ['props'] : ['props', 'methods', 'events'];
	}
	const member = findWithin(main.item, props, memberQuery);
	if (!member) return [];
	const rest = query.slice(2);
	if (rest.length) {
		if (!member.item.type) return [];
		const base = this.joinType(member.item.type)
		.replace(/<.+>/g, '')
		.replace(/\|.+/, '')
		.trim();
		return this.search(docs, `${base}.${rest.join('.')}`);
	}
	res.push(member);
	return res;
}

exports.clean = (text, version) => {
	const getLink = this.getLink;
	const search = this.search;
	return text.replace(/\n/g, ' ')
	.replace(/<\/?(?:info|warn)>/g, '')
	.replace(/\{@link (.+?)\}/g, '`$1`');
}

exports.source = (version) => {
  return `https://github.com/discordjs/${version === 'commando' ? 'commando/blob/master' : `discord.js/blob/${version}`}`
}

exports.joinType = (type) => {
	return type.map(t => t.map(a => Array.isArray(a) ? a.join('') : a).join('')).join(' | ');
}

exports.getLink = (version) => {
	return version === 'commando'
	? 'https://discord.js.org/#/docs/commando/master/'
	: `https://discord.js.org/#/docs/main/${version}/`;
}

exports.makeLink = (main, member, version) => {
	return oneLineTrim`
			${this.getLink(version)}
			${main.category === 'classes' ? 'class' : 'typedef'}/${main.item.name}
			?scrollTo=${member.item.scope === 'static' ? 's-' : ''}${member.item.name}
		`;
}

exports.formatMain = (main, version) => {
	const embed = {
		description: `__**[${main.item.name}`,
		fields: []
	};
	if (main.item.extends) embed.description += ` (extends ${main.item.extends[0]})`;
	embed.description += oneLineTrim`
			](${this.getLink(version)}
			${main.category === 'classes' ? 'class' : 'typedef'}/${main.item.name})**__
		`;
	embed.description += '\n';
	if (main.item.description) embed.description += `\n${this.clean(main.item.description, version)}`;
	const join = it => `\`${it.map(i => i.name).join('` `')}\``;
	if (main.item.props) {
		embed.fields.push({
			name: 'Properties',
			value: join(main.item.props)
		})
	}
	if (main.item.methods) {
		embed.fields.push({
			name: 'Methods',
			value: join(main.item.methods)
		})
	}
	if (main.item.events) {
		embed.fields.push({
			name: 'Events',
			value: join(main.item.events)
		})
	}
	if (main.item.events) {
		embed.fields.push({
			name: 'Events',
			value: join(main.item.events)
		})
	}
	embed.fields.push({
		name: '\u200b',
		value: `[View Source](${this.source(version)}/${main.item.meta.path}/${main.item.meta.file}#L${main.item.meta.line})`
	});
	return embed;
}

exports.formatProp = (main, member, version) => {
	const embed = {
		description: oneLineTrim`
				__**[${main.item.name}${member.item.scope === 'static' ? '.' : '#'}${member.item.name}]
				(${this.makeLink(main, member, version)})**__
			`,
		fields: []
	}
	embed.description += '\n';
	if (member.item.description) embed.description += `\n${this.clean(member.item.description, version)}`;
	const type = this.joinType(member.item.type);
	embed.fields.push({
		name: 'Type',
		value: `\`${type}\``
	});
	if (member.item.examples) {
		embed.fields.push({
			name: 'Example',
			value: `\`\`\`js\n${member.item.examples.join('```\n```js\n')}\`\`\``
		})
	}
	embed.fields.push({
		name: '\u200b',
		value: `[View Source](${this.source(version)}/${member.item.meta.path}/${member.item.meta.file}#L${member.item.meta.line})`
	});
	return embed;
}

exports.formatMethod = (main, member, version) =>{
	const embed = {
		description: oneLineTrim`
				__**[${main.item.name}${member.item.scope === 'static' ? '.' : '#'}${member.item.name}()]
				(${this.makeLink(main, member, version)})**__
			`,
		fields: []
	}
	embed.description += '\n';
	if (member.item.description) embed.description += `\n${this.clean(member.item.description, version)}`;
	if (member.item.params) {
		const params = member.item.params.map(param => {
			const name = param.optional ? `[${param.name}]` : param.name;
			const type = this.joinType(param.type);
			return `\`${name}: ${type}\`\n${this.clean(param.description, version)}`;
		});
		embed.fields.push({
			name: 'Parameters',
			value: params.join('\n\n')
		});
	}
	
	if (member.item.returns) {
		const desc = member.item.returns.description ? `${this.clean(member.item.returns.description, version)}\n` : '';
		const type = this.joinType(member.item.returns.types || member.item.returns);
		const returns = `${desc}\`=> ${type}\``;
		embed.fields.push({
			name: 'Returns',
			value: returns
		})
	} else {
		embed.fields.push({
			name: 'Returns',
			value: '`=> void`'
		})
	}
	
	if (member.item.examples) {
		embed.fields.push({
			name: 'Example',
			value: `\`\`\`js\n${member.item.examples.join('```\n```js\n')}\`\`\``
		})
	}
	embed.fields.push({
		name: '\u200b',
		value: `[View Source](${this.source(version)}/${member.item.meta.path}/${member.item.meta.file}#L${member.item.meta.line})`
	});
	return embed;
}

exports.formatEvent = (main, member, version) => {
	const embed = {
		description: `__**[${main.item.name}#${member.item.name}](${this.makeLink(main, member, version)})**__\n`,
		fields: []
	}
	if (member.item.description) embed.description += `\n${this.clean(member.item.description, version)}`;
	if (member.item.params) {
		const params = member.item.params.map(param => {
			const type = this.joinType(param.type);
			return `\`${param.name}: ${type}\`\n${this.clean(param.description, version)}`;
		});
		embed.fields.push({
			name: 'Parameters',
			value: params.join('\n\n')
		});
	}
	if (member.item.examples) {
		embed.fields.push({
			name: 'Example',
			value: `\`\`\`js\n${member.item.examples.join('```\n```js\n')}\`\`\``
		})
	}
	embed.fields.push({
		name: '\u200b',
		value: `[View Source](${this.source(version)}/${member.item.meta.path}/${member.item.meta.file}#L${member.item.meta.line})`
	});
	return embed;
}

exports.run = async (client, msg, args) => {
  const query = args[0];
  const version = !args[1] ? 'stable' : args[1];
	if(!query) return args.missing(msg, 'Query not provided', this.help);
	try{
		const docs = await this.fetchDocs(version);
		const [main, member] = this.search(docs, query);
		if (!main) return msg.channel.send('🚫 Could not find that item in the docs.');
		const embed = member ? {
			props: this.formatProp,
			methods: this.formatMethod,
			events: this.formatEvent
		}[member.category].call(this, main, member, version) : this.formatMain(main, version);
		embed.url = this.getLink(version);
    embed.color = 0x00B9FF;
		embed.author = {
			name: `Discord.js Docs (${version})`,
      icon_url: 'https://discordapp.com/api/emojis/466983381318762496.png '
		}
	return msg.channel.send({embed});
	}catch(e){
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
}

exports.conf = {
  aliases: [],
  clientPerm: '',
  authorPerm: 'EMBED_LINKS'
}

exports.help = {
  name: 'docs',
  description: 'Search the discord.js documentation',
  usage: 'docs <query> [version]',
  example: ['docs voiceConnection']
}