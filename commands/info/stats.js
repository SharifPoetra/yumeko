const HighChartsConstructor = require('canvas');
const { RichEmbed, Attachment } = require('discord.js');
const { loadavg } = require('os');

const now = new Date();
const plotOptions = {
	series: {
		pointStart: now.setHours(now.getHours() - 1),
		pointInterval: 60 * 1000
	}
}

exports.run = async (client, msg, args) => {
	try{
		const embed = new RichEmbed()
		.setColor('RANDOM')
		.setAuthor(`Curent stats for ${client.user.tag}`, client.user.avatarURL)
		.addField('📌 Presence', `\`\`\`
•Guilds    ::     ${client.guilds.size}
•Channels  ::     ${client.channels.size}
•Users     ::     ${client.users.size}
•Commands  ::     ${client.commands.size}
•Websocket ::     ${Math.floor(client.ping)}ms
•Uptime    ::     ${client.util.parseDur(client.uptime)}\`\`\``, true)
		.addField('📌 Process', `\`\`\`
•RAM (Used)  ::     ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
•RAM (Total) ::     ${Math.round(100 * (process.memoryUsage().heapTotal / 1048576)) / 100} MB
•CPU Usage   ::     ${Math.round(loadavg()[0] * 100) / 100}%
•Uptime      ::     ${client.util.parseDur(Date.now() - (process.uptime()* 1000))}\`\`\``, true)
    .addField('📌 Other', `\`\`\`
•Discord.js ::    v${require('discord.js').version}
•Node.js    ::    ${process.version}\`\`\``,true);
		
		
    //WIP :P
    
    if(args.length > 0 && args[0] === 'command'){
			const chart = await new HighChartsConstructor()
			.plotOptionsOptions(plotOptions)
			.seriesDataSetter([
				{
					type: 'line',
					color: '#3498DB',
					data: client.health.cmd.slice(-10),
					name: 'Commands per minute.'
				}
			])
			.titleOptions({ text: 'Chart' })
			.toBuffer();
			embed.attachFile(new Attachment(chart, 'chart.png'));
			embed.setImage('attachment://chart.png');
		}
		if(args.length > 0 && args[0] === 'memory'){
			const chart = await new HighChartsConstructor()
			.plotOptionsOptions(plotOptions)
			.seriesDataSetter([
				{
					type: 'line',
					color: '#3498DB',
					data: client.health.ram.slice(-10),
					name: 'RAM (Used)'
				},
				{
					type: 'line',
					color: '#FF8000',
					data: client.health.prc.slice(-10),
					name: 'RAM (Total)'
				}
			])
			.titleOptions({ text: 'Chart' })
			.toBuffer();
			embed.attachFile(new Attachment(chart, 'chart.png'));
			embed.setImage('attachment://chart.png');
		}
		return msg.channel.send(embed);
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
  name: 'stats',
  description: 'Show Statistic of yumeko',
  usage: 'stats',
  example: ['stats']
}