exports.run = async (client, msg, args) => {
	const serverQueue = client.queue.get(msg.guild.id);
	if (!msg.member.voiceChannel) return msg.channel.send('You must join voice channel first');
	if(serverQueue.voiceChannel.id !== msg.member.voiceChannel.id) return msg.channel.send(`You must be in **${serverQueue.voiceChannel.name}** to change the volume`);
	if(!serverQueue) return msg.channel.send('Are you sure? queue is empty !');
	try{
		if(!args.length) return msg.channel.send(`🔈Current volume is ${serverQueue.volume}%`); 
		if(isNaN(args[0])) return msg.channel.send('Please input valid number >:(');
		if(args[0] > 100) return msg.channel.send('Volume only can be set in range 1 - 100');
		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolume(args[1] / 50);
		return msg.channel.send(`✅ Set volume to **${args[0]}**`);
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
  name: 'volume',
  description: 'change/show current queue volume',
  usage: 'volume [number]',
  example: ['volume', 'volume 100']
}
