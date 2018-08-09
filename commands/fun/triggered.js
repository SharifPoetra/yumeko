const Canvas = require('canvas');
const GIFEncoder = require('gifencoder');
const readFile = require('util').promisify(require('fs').readFile);
const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
	let user = msg.mentions.users.first() || client.users.get(args[0]);
	if(!user) user = msg.author;
	try{
		const mDel = await msg.channel.send('Painting 🖌️');
		const link = user.avatarURL.replace(/\.(gif|jpg|png|jpeg)\?size=2048/g, '.png?size=512');
		const { body } = await client.snek.get(link);
		const attachment = await getTriggered(body);
		const embed = new RichEmbed()
		.setColor('RANDOM')
		.attachFile({attachment: attachment, name: 'triggered.gif'})
		.setURL('attachment://triggered.gif')
		.setTitle('Click here if image failed to load')
		.setImage('attachment://triggered.gif');
		await msg.channel.send(embed);
		await mDel.delete();
		return;
	}catch(e){
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
}

function streamToArray(stream) {
	if (!stream.readable) return Promise.resolve([]);
	return new Promise((resolve, reject) => {
		const array = [];
		function onData(data) {
			array.push(data);
		}
		function onEnd(error) {
			if (error) reject(error);
			else resolve(array);
			cleanup();
		}
		function onClose() {
			resolve(array);
			cleanup();
		}
		function cleanup() {
			stream.removeListener('data', onData);
			stream.removeListener('end', onEnd);
			stream.removeListener('error', onEnd);
			stream.removeListener('close', onClose);
		}
		stream.on('data', onData);
		stream.on('end', onEnd);
		stream.on('error', onEnd);
		stream.on('close', onClose);
	});
}

async function getTriggered(triggered) {
	const imgTitle = new Canvas.Image();
	const imgTriggered = new Canvas.Image();
	const encoder = new GIFEncoder(256, 256);
	const canvas = new Canvas(256, 256);
	const ctx = canvas.getContext('2d');
	imgTitle.src = await readFile('./assets/images/plate_triggered.png');
	imgTriggered.src = triggered;
	
	const stream = encoder.createReadStream();
	encoder.start();
	encoder.setRepeat(0);
	encoder.setDelay(50);
	encoder.setQuality(200);
	
	const coord1 = [-25, -33, -42, -14];
	const coord2 = [-25, -13, -34, -10];
	
	for (let i = 0; i < 4; i++) {
		ctx.drawImage(imgTriggered, coord1[i], coord2[i], 300, 300);
		ctx.fillStyle = 'rgba(255 , 100, 0, 0.4)';
		ctx.drawImage(imgTitle, 0, 218, 256, 38);
		ctx.fillRect(0, 0, 256, 256);
		encoder.addFrame(ctx);
	}
	encoder.finish();
	return streamToArray(stream).then(Buffer.concat);
}

exports.conf = {
  aliases: ['trigger'],
  clientPerm: '',
  authorPerm: 'ATTACH_FILES'
}

exports.help = {
  name: 'triggered',
  description: 'Trigger someone...',
  usage: 'triggered [mention|userid]',
  example: ['triggered', 'triggered @yumeko']
}
