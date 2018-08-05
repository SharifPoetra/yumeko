const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
	const serverQueue = client.queue.get(msg.guild.id);
	if(!msg.member.voiceChannel) return msg.channel.send('Join voice channel first');
	if(!serverQueue) return msg.channel.send('No songs to seek');
	if(serverQueue.voiceChannel.id !== msg.member.voiceChannel.id) return msg.chanel.send(`You must in **${serverQueue.voiceChannel.name}** to seek the song`)
	try{
		const curDuration = (serverQueue.songs[0].duration.minutes*60000) + ((serverQueue.songs[0].duration.seconds%60000)*1000);
		const choiceDur = args.join(' ').split(':');
		if(choiceDur.length < 2) return args.missing(msg, 'No duration provided or invalid ?', this.help);
		const optDurr = (parseInt(choiceDur[0], 10)*60000) + ((parseInt(choiceDur[1], 10)%60000)*1000);
		if(optDurr > curDuration) return msg.channel.send('Your duration is too big');
		serverQueue.songs.splice(1, 0, serverQueue.songs[0]);
		return serverQueue.connection.dispatcher.end(`seek ${optDurr}`);
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
  name: 'seek',
  description: 'Seek current songs',
  usage: 'seek <duration>',
  example: ['seek 00:00']
}