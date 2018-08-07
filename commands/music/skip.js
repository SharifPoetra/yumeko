exports.run = async (client, msg, args) => {
	const serverQueue = client.queue.get(msg.guild.id);
	if (!msg.member.voiceChannel) return msg.channel.send('You must join voice channel first');
	if(serverQueue.voiceChannel.id !== msg.member.voiceChannel.id) return msg.channel.send(`You must be in **${serverQueue.voiceChannel.name}** to skip the song`);
	if(!serverQueue) return msg.channel.send('Are you sure? nothing to skip because queue is empty');
	const members = serverQueue.voiceChannel.members.filter(x => !x.user.bot);
	if(serverQueue.songs[0].requester.id !== msg.author.id && members.size > 2){
		if(serverQueue.songs[0].votes.includes(msg.author.id)) return msg.channel.send('You already voted to skip this song');
		serverQueue.songs[0].votes.push(msg.author.id);
		if(serverQueue.songs[0].votes.length === 3){
			msg.channel.send(`⏩ Skip the current song`);
			return serverQueue.connection.dispatcher.end();
		}
		return msg.channel.send(`📢 You voted to skip this songs, need more votes! **${serverQueue.songs[0].votes.length} / 3**`);
	}
	msg.channel.send(`⏩ Skip the current song`);
	return serverQueue.connection.dispatcher.end(); 
	try{
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
  name: 'skip',
  description: 'Skip the current songs',
  usage: 'skip',
  example: ['skip']
}
